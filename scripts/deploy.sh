#!/bin/bash
# scripts/deploy.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
ROLLBACK=${3:-false}

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check for required tools
    command -v docker >/dev/null 2>&1 || { log_error "Docker is required but not installed."; exit 1; }
    command -v kubectl >/dev/null 2>&1 || { log_error "kubectl is required but not installed."; exit 1; }
    command -v helm >/dev/null 2>&1 || { log_error "Helm is required but not installed."; exit 1; }
    
    # Check Kubernetes context
    CURRENT_CONTEXT=$(kubectl config current-context)
    log_info "Current Kubernetes context: $CURRENT_CONTEXT"
    
    if [[ ! "$CURRENT_CONTEXT" =~ "$ENVIRONMENT" ]]; then
        log_warn "Current context doesn't match environment. Expected: $ENVIRONMENT"
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

build_images() {
    log_info "Building Docker images..."
    
    # Build backend
    log_info "Building backend image..."
    docker build -t ivanchat/backend:$VERSION ./server
    
    # Build frontend
    log_info "Building frontend image..."
    docker build -t ivanchat/frontend:$VERSION ./client
    
    # Tag images
    docker tag ivanchat/backend:$VERSION ivanchat/backend:latest
    docker tag ivanchat/frontend:$VERSION ivanchat/frontend:latest
}

push_images() {
    log_info "Pushing images to registry..."
    
    # Login to registry
    if [ -n "$DOCKER_REGISTRY_URL" ]; then
        log_info "Logging into Docker registry..."
        echo $DOCKER_REGISTRY_PASSWORD | docker login $DOCKER_REGISTRY_URL -u $DOCKER_REGISTRY_USERNAME --password-stdin
    fi
    
    # Push images
    docker push ivanchat/backend:$VERSION
    docker push ivanchat/backend:latest
    docker push ivanchat/frontend:$VERSION
    docker push ivanchat/frontend:latest
}

run_tests() {
    log_info "Running tests..."
    
    # Run backend tests
    log_info "Running backend tests..."
    docker run --rm ivanchat/backend:$VERSION npm test
    
    # Run frontend tests
    log_info "Running frontend tests..."
    docker run --rm ivanchat/frontend:$VERSION npm test
    
    # Run integration tests
    log_info "Running integration tests..."
    ./scripts/integration-tests.sh
}

backup_database() {
    log_info "Creating database backup..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_NAME="ivanchat_backup_${ENVIRONMENT}_${TIMESTAMP}"
    
    # MongoDB backup
    kubectl exec -n ivanchat mongodb-0 -- mongodump --out=/backup/$BACKUP_NAME
    
    # Upload to S3
    kubectl exec -n ivanchat mongodb-0 -- aws s3 cp /backup/$BACKUP_NAME s3://ivanchat-backups/$BACKUP_NAME --recursive
    
    log_info "Backup created: $BACKUP_NAME"
}

deploy_kubernetes() {
    log_info "Deploying to Kubernetes..."
    
    # Update ConfigMaps
    log_info "Updating ConfigMaps..."
    kubectl apply -f infrastructure/kubernetes/configmaps/
    
    # Update Secrets (if needed)
    if [ "$UPDATE_SECRETS" = "true" ]; then
        log_info "Updating Secrets..."
        ./scripts/update-secrets.sh $ENVIRONMENT
    fi
    
    # Deploy with Helm
    log_info "Deploying with Helm..."
    helm upgrade --install ivanchat \
        ./infrastructure/helm/ivanchat \
        --namespace ivanchat \
        --set image.tag=$VERSION \
        --set environment=$ENVIRONMENT \
        --values ./infrastructure/helm/ivanchat/values.$ENVIRONMENT.yaml \
        --wait \
        --timeout 10m
}

run_migrations() {
    log_info "Running database migrations..."
    
    # Get a backend pod
    POD=$(kubectl get pods -n ivanchat -l app=ivanchat-backend -o jsonpath='{.items[0].metadata.name}')
    
    # Run migrations
    kubectl exec -n ivanchat $POD -- npm run migrate
    
    log_info "Migrations completed"
}

health_check() {
    log_info "Performing health check..."
    
    # Wait for pods to be ready
    kubectl wait --for=condition=ready pod -l app=ivanchat-backend -n ivanchat --timeout=300s
    kubectl wait --for=condition=ready pod -l app=ivanchat-frontend -n ivanchat --timeout=300s
    
    # Check endpoints
    BACKEND_URL="https://api.$ENVIRONMENT.ivanchat.com/health"
    FRONTEND_URL="https://$ENVIRONMENT.ivanchat.com"
    
    if curl -f $BACKEND_URL > /dev/null 2>&1; then
        log_info "Backend health check passed"
    else
        log_error "Backend health check failed"
        exit 1
    fi
    
    if curl -f $FRONTEND_URL > /dev/null 2>&1; then
        log_info "Frontend health check passed"
    else
        log_error "Frontend health check failed"
        exit 1
    fi
}

rollback() {
    log_warn "Rolling back deployment..."
    
    # Helm rollback
    helm rollback ivanchat -n ivanchat
    
    # Wait for rollback to complete
    kubectl rollout status deployment/ivanchat-backend -n ivanchat
    kubectl rollout status deployment/ivanchat-frontend -n ivanchat
    
    log_info "Rollback completed"
}

send_notification() {
    local status=$1
    local message=$2
    
    # Send Slack notification
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"Deployment $status: $message\"}" \
            $SLACK_WEBHOOK_URL
    fi
    
    # Send email notification
    if [ -n "$NOTIFICATION_EMAIL" ]; then
        echo "$message" | mail -s "IvanChat Deployment $status" $NOTIFICATION_EMAIL
    fi
}

cleanup() {
    log_info "Cleaning up old resources..."
    
    # Remove old Docker images
    docker image prune -a -f --filter "until=168h"
    
    # Clean up old Kubernetes resources
    kubectl delete pods -n ivanchat --field-selector status.phase=Failed
    kubectl delete pods -n ivanchat --field-selector status.phase=Succeeded
}

# Main deployment flow
main() {
    log_info "Starting deployment to $ENVIRONMENT with version $VERSION"
    
    # Check if rollback is requested
    if [ "$ROLLBACK" = "true" ]; then
        rollback
        exit 0
    fi
    
    # Pre-deployment checks
    check_prerequisites
    
    # Build and test
    if [ "$SKIP_BUILD" != "true" ]; then
        build_images
        run_tests
        push_images
    fi
    
    # Backup before deployment
    if [ "$ENVIRONMENT" = "production" ]; then
        backup_database
    fi
    
    # Deploy
    deploy_kubernetes
    
    # Post-deployment tasks
    run_migrations
    health_check
    
    # Cleanup
    cleanup
    
    # Notify
    send_notification "SUCCESS" "Successfully deployed version $VERSION to $ENVIRONMENT"
    
    log_info "Deployment completed successfully!"
}

# Error handling
trap 'log_error "Deployment failed!"; send_notification "FAILED" "Failed to deploy version $VERSION to $ENVIRONMENT"; exit 1' ERR

# Run main function
main