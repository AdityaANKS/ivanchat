# infrastructure/terraform/main.tf
terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
  
  backend "s3" {
    bucket         = "ivanchat-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "ivanchat-terraform-locks"
  }
}

# Provider Configuration
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      Project     = "IvanChat"
      ManagedBy   = "Terraform"
      Owner       = var.owner
      CostCenter  = var.cost_center
    }
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
  }
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
    }
  }
}

# Data Sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Random Resources
resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "random_password" "redis_password" {
  length  = 32
  special = true
}

# Networking Module
module "vpc" {
  source = "./modules/vpc"
  
  name               = "${var.project_name}-vpc"
  cidr               = var.vpc_cidr
  availability_zones = data.aws_availability_zones.available.names
  
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }
  
  public_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                    = "1"
  }
  
  private_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"           = "1"
  }
}

# EKS Cluster Module
module "eks" {
  source = "./modules/eks"
  
  cluster_name    = var.cluster_name
  cluster_version = var.kubernetes_version
  
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  
  node_groups = {
    general = {
      desired_capacity = 3
      min_capacity     = 2
      max_capacity     = 10
      
      instance_types = ["t3.large"]
      
      k8s_labels = {
        Environment = var.environment
        NodeType    = "general"
      }
    }
    
    spot = {
      desired_capacity = 2
      min_capacity     = 1
      max_capacity     = 5
      
      instance_types = ["t3.medium", "t3a.medium"]
      capacity_type  = "SPOT"
      
      k8s_labels = {
        Environment = var.environment
        NodeType    = "spot"
      }
      
      taints = [
        {
          key    = "spot"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      ]
    }
  }
  
  enable_irsa = true
  
  cluster_addons = {
    coredns = {
      addon_version = "v1.10.1-eksbuild.1"
    }
    kube-proxy = {
      addon_version = "v1.27.3-eksbuild.1"
    }
    vpc-cni = {
      addon_version = "v1.13.4-eksbuild.1"
    }
    aws-ebs-csi-driver = {
      addon_version = "v1.20.0-eksbuild.1"
    }
  }
}

# RDS Database Module
module "rds" {
  source = "./modules/rds"
  
  identifier = "${var.project_name}-db"
  
  engine            = "postgres"
  engine_version    = "15.3"
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  storage_encrypted = true
  
  database_name = "ivanchat"
  username      = "ivanchat_admin"
  password      = random_password.db_password.result
  
  vpc_id                 = module.vpc.vpc_id
  subnet_ids             = module.vpc.private_subnet_ids
  allowed_security_groups = [module.eks.cluster_security_group_id]
  
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  deletion_protection = var.environment == "production"
  skip_final_snapshot = var.environment != "production"
  
  performance_insights_enabled = true
  monitoring_interval         = 60
  
  parameters = {
    shared_preload_libraries = "pg_stat_statements"
    log_statement           = "all"
    log_duration           = "on"
  }
}

# ElastiCache Redis Module
module "elasticache" {
  source = "./modules/elasticache"
  
  name = "${var.project_name}-redis"
  
  node_type            = var.redis_node_type
  number_cache_nodes   = var.redis_number_cache_nodes
  parameter_group_family = "redis7"
  engine_version       = "7.0"
  
  vpc_id                 = module.vpc.vpc_id
  subnet_ids             = module.vpc.private_subnet_ids
  allowed_security_groups = [module.eks.cluster_security_group_id]
  
  auth_token = random_password.redis_password.result
  
  snapshot_retention_limit = 5
  snapshot_window         = "03:00-05:00"
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  automatic_failover_enabled = var.redis_number_cache_nodes > 1
  multi_az_enabled          = var.redis_number_cache_nodes > 1
}

# S3 Buckets
module "s3" {
  source = "./modules/s3"
  
  buckets = {
    uploads = {
      name = "${var.project_name}-uploads-${var.environment}"
      versioning = true
      lifecycle_rules = [
        {
          id      = "delete-old-versions"
          enabled = true
          noncurrent_version_expiration = {
            days = 90
          }
        },
        {
          id      = "move-to-ia"
          enabled = true
          transition = {
            days          = 30
            storage_class = "STANDARD_IA"
          }
        }
      ]
    }
    
    backups = {
      name = "${var.project_name}-backups-${var.environment}"
      versioning = true
      lifecycle_rules = [
        {
          id      = "delete-old-backups"
          enabled = true
          expiration = {
            days = 90
          }
        }
      ]
    }
    
    static = {
      name = "${var.project_name}-static-${var.environment}"
      website = {
        index_document = "index.html"
        error_document = "error.html"
      }
      cors_rules = [
        {
          allowed_methods = ["GET", "HEAD"]
          allowed_origins = ["*"]
          allowed_headers = ["*"]
          max_age_seconds = 3000
        }
      ]
    }
  }
}

# CloudFront CDN
module "cloudfront" {
  source = "./modules/cloudfront"
  
  aliases = var.environment == "production" ? ["cdn.ivanchat.com"] : []
  
  origin_domain_name = module.s3.buckets["static"].bucket_regional_domain_name
  origin_id          = "S3-${module.s3.buckets["static"].id}"
  
  default_cache_behavior = {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${module.s3.buckets["static"].id}"
    
    forwarded_values = {
      query_string = false
      cookies = {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  
  price_class = "PriceClass_100"
  
  restrictions = {
    geo_restriction = {
      restriction_type = "none"
    }
  }
  
  viewer_certificate = {
    cloudfront_default_certificate = var.environment != "production"
    acm_certificate_arn            = var.environment == "production" ? var.acm_certificate_arn : null
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"
  
  name = "${var.project_name}-alb"
  
  vpc_id          = module.vpc.vpc_id
  subnets         = module.vpc.public_subnet_ids
  security_groups = [aws_security_group.alb.id]
  
  target_groups = {
    backend = {
      port     = 5000
      protocol = "HTTP"
      health_check = {
        enabled             = true
        healthy_threshold   = 2
        unhealthy_threshold = 2
        timeout             = 5
        interval            = 30
        path                = "/health"
        matcher             = "200"
      }
    }
    
    frontend = {
      port     = 3000
      protocol = "HTTP"
      health_check = {
        enabled             = true
        healthy_threshold   = 2
        unhealthy_threshold = 2
        timeout             = 5
        interval            = 30
        path                = "/"
        matcher             = "200"
      }
    }
  }
  
  listeners = {
    http = {
      port     = 80
      protocol = "HTTP"
      default_action = {
        type = "redirect"
        redirect = {
          port        = "443"
          protocol    = "HTTPS"
          status_code = "HTTP_301"
        }
      }
    }
    
    https = {
      port            = 443
      protocol        = "HTTPS"
      certificate_arn = var.acm_certificate_arn
      default_action = {
        type             = "forward"
        target_group_arn = module.alb.target_group_arns["frontend"]
      }
      
      rules = [
        {
          priority = 100
          condition = {
            path_pattern = {
              values = ["/api/*"]
            }
          }
          action = {
            type             = "forward"
            target_group_arn = module.alb.target_group_arns["backend"]
          }
        },
        {
          priority = 200
          condition = {
            path_pattern = {
              values = ["/socket.io/*"]
            }
          }
          action = {
            type             = "forward"
            target_group_arn = module.alb.target_group_arns["backend"]
          }
        }
      ]
    }
  }
  
  enable_deletion_protection = var.environment == "production"
  enable_http2              = true
  enable_cross_zone_load_balancing = true
  
  access_logs = {
    bucket  = module.s3.buckets["logs"].id
    enabled = true
    prefix  = "alb"
  }
}

# Security Groups
resource "aws_security_group" "alb" {
  name_prefix = "${var.project_name}-alb-"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  lifecycle {
    create_before_destroy = true
  }
}

# Secrets Manager
resource "aws_secretsmanager_secret" "app_secrets" {
  name_prefix = "${var.project_name}-secrets-"
  
  rotation_rules {
    automatically_after_days = 90
  }
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  
  secret_string = jsonencode({
    db_password    = random_password.db_password.result
    redis_password = random_password.redis_password.result
    jwt_secret     = random_password.jwt_secret.result
    encryption_key = random_password.encryption_key.result
  })
}

resource "random_password" "jwt_secret" {
  length  = 64
  special = true
}

resource "random_password" "encryption_key" {
  length  = 32
  special = false
}

# Monitoring and Alerting
module "monitoring" {
  source = "./modules/monitoring"
  
  cluster_name = module.eks.cluster_name
  
  sns_email_endpoints = var.alert_email_endpoints
  
  alarms = {
    high_cpu = {
      metric_name = "CPUUtilization"
      namespace   = "AWS/EKS"
      statistic   = "Average"
      period      = 300
      threshold   = 80
      comparison  = "GreaterThanThreshold"
    }
    
    high_memory = {
      metric_name = "MemoryUtilization"
      namespace   = "AWS/EKS"
      statistic   = "Average"
      period      = 300
      threshold   = 80
      comparison  = "GreaterThanThreshold"
    }
    
    database_connections = {
      metric_name = "DatabaseConnections"
      namespace   = "AWS/RDS"
      statistic   = "Average"
      period      = 300
      threshold   = 80
      comparison  = "GreaterThanThreshold"
    }
  }
}

# Outputs
output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "database_endpoint" {
  description = "RDS database endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = module.elasticache.endpoint
  sensitive   = true
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.alb.dns_name
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.cloudfront.domain_name
}

output "s3_bucket_names" {
  description = "S3 bucket names"
  value       = module.s3.bucket_names
}