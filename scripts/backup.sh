#!/bin/bash
# scripts/backup.sh

set -e

# Configuration
BACKUP_DIR="/backup"
S3_BUCKET="ivanchat-backups"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
backup_mongodb() {
    log_info "Backing up MongoDB..."
    
    MONGO_BACKUP_DIR="$BACKUP_DIR/mongodb_$TIMESTAMP"
    
    # Use mongodump
    mongodump \
        --uri="$MONGODB_URI" \
        --out="$MONGO_BACKUP_DIR" \
        --gzip \
        --quiet
    
    # Compress backup
    tar -czf "$MONGO_BACKUP_DIR.tar.gz" -C "$BACKUP_DIR" "mongodb_$TIMESTAMP"
    rm -rf "$MONGO_BACKUP_DIR"
    
    # Upload to S3
    aws s3 cp "$MONGO_BACKUP_DIR.tar.gz" "s3://$S3_BUCKET/mongodb/mongodb_$TIMESTAMP.tar.gz" \
        --storage-class STANDARD_IA
    
    # Clean local backup
    rm -f "$MONGO_BACKUP_DIR.tar.gz"
    
    log_info "MongoDB backup completed"
}

# Backup Redis
backup_redis() {
    log_info "Backing up Redis..."
    
    REDIS_BACKUP_FILE="$BACKUP_DIR/redis_$TIMESTAMP.rdb"
    
    # Trigger Redis backup
    redis-cli -h redis --pass "$REDIS_PASSWORD" BGSAVE
    
    # Wait for backup to complete
    while [ $(redis-cli -h redis --pass "$REDIS_PASSWORD" LASTSAVE) -eq $(redis-cli -h redis --pass "$REDIS_PASSWORD" LASTSAVE) ]; do
        sleep 1
    done
    
    # Copy backup file
    docker cp ivanchat-redis:/data/dump.rdb "$REDIS_BACKUP_FILE"
    
    # Compress backup
    gzip "$REDIS_BACKUP_FILE"
    
    # Upload to S3
    aws s3 cp "$REDIS_BACKUP_FILE.gz" "s3://$S3_BUCKET/redis/redis_$TIMESTAMP.rdb.gz" \
        --storage-class STANDARD_IA
    
    # Clean local backup
    rm -f "$REDIS_BACKUP_FILE.gz"
    
    log_info "Redis backup completed"
}

# Backup uploaded files
backup_files() {
    log_info "Backing up uploaded files..."
    
    FILES_BACKUP_DIR="$BACKUP_DIR/files_$TIMESTAMP"
    
    # Sync files from S3
    aws s3 sync "s3://ivanchat-uploads" "$FILES_BACKUP_DIR" --quiet
    
    # Compress backup
    tar -czf "$FILES_BACKUP_DIR.tar.gz" -C "$BACKUP_DIR" "files_$TIMESTAMP"
    rm -rf "$FILES_BACKUP_DIR"
    
    # Upload to backup S3
    aws s3 cp "$FILES_BACKUP_DIR.tar.gz" "s3://$S3_BUCKET/files/files_$TIMESTAMP.tar.gz" \
        --storage-class GLACIER
    
    # Clean local backup
    rm -f "$FILES_BACKUP_DIR.tar.gz"
    
    log_info "Files backup completed"
}

# Backup configurations
backup_configs() {
    log_info "Backing up configurations..."
    
    CONFIGS_BACKUP_DIR="$BACKUP_DIR/configs_$TIMESTAMP"
    mkdir -p "$CONFIGS_BACKUP_DIR"
    
    # Backup Kubernetes configs
    kubectl get configmaps -n ivanchat -o yaml > "$CONFIGS_BACKUP_DIR/configmaps.yaml"
    kubectl get secrets -n ivanchat -o yaml > "$CONFIGS_BACKUP_DIR/secrets.yaml"
    
    # Compress backup
    tar -czf "$CONFIGS_BACKUP_DIR.tar.gz" -C "$BACKUP_DIR" "configs_$TIMESTAMP"
    rm -rf "$CONFIGS_BACKUP_DIR"
    
    # Upload to S3
    aws s3 cp "$CONFIGS_BACKUP_DIR.tar.gz" "s3://$S3_BUCKET/configs/configs_$TIMESTAMP.tar.gz" \
        --server-side-encryption AES256
    
    # Clean local backup
    rm -f "$CONFIGS_BACKUP_DIR.tar.gz"
    
    log_info "Configurations backup completed"
}

# Clean old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups..."
    
    # Calculate cutoff date
    CUTOFF_DATE=$(date -d "$RETENTION_DAYS days ago" +%Y-%m-%d)
    
    # Clean S3 backups
    aws s3api list-objects-v2 --bucket "$S3_BUCKET" --query "Contents[?LastModified<='$CUTOFF_DATE'].Key" --output text | \
    while read -r key; do
        if [ -n "$key" ]; then
            aws s3 rm "s3://$S3_BUCKET/$key"
            log_info "Deleted old backup: $key"
        fi
    done
    
    log_info "Cleanup completed"
}

# Create backup manifest
create_manifest() {
    log_info "Creating backup manifest..."
    
    MANIFEST_FILE="$BACKUP_DIR/manifest_$TIMESTAMP.json"
    
    cat > "$MANIFEST_FILE" <<EOF
{
    "timestamp": "$TIMESTAMP",
    "date": "$(date -Iseconds)",
    "environment": "$ENVIRONMENT",
    "components": {
        "mongodb": "mongodb_$TIMESTAMP.tar.gz",
        "redis": "redis_$TIMESTAMP.rdb.gz",
        "files": "files_$TIMESTAMP.tar.gz",
        "configs": "configs_$TIMESTAMP.tar.gz"
    },
    "retention_days": $RETENTION_DAYS,
    "s3_bucket": "$S3_BUCKET"
}
EOF
    
    # Upload manifest
    aws s3 cp "$MANIFEST_FILE" "s3://$S3_BUCKET/manifests/manifest_$TIMESTAMP.json"
    
    # Clean local manifest
    rm -f "$MANIFEST_FILE"
    
    log_info "Manifest created"
}

# Verify backup
verify_backup() {
    log_info "Verifying backup..."
    
    # Check if all backup files exist in S3
    COMPONENTS=("mongodb/mongodb_$TIMESTAMP.tar.gz" "redis/redis_$TIMESTAMP.rdb.gz" "files/files_$TIMESTAMP.tar.gz" "configs/configs_$TIMESTAMP.tar.gz")
    
    for component in "${COMPONENTS[@]}"; do
        if aws s3api head-object --bucket "$S3_BUCKET" --key "$component" >/dev/null 2>&1; then
            log_info "✓ $component exists"
        else
            log_error "✗ $component not found"
            exit 1
        fi
    done
    
    log_info "Backup verification completed"
}

# Send notification
send_notification() {
    local status=$1
    
    if [ "$status" = "success" ]; then
        MESSAGE="Backup completed successfully at $TIMESTAMP"
    else
        MESSAGE="Backup failed at $TIMESTAMP"
    fi
    
    # Send to Slack
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$MESSAGE\"}" \
            $SLACK_WEBHOOK_URL
    fi
    
    # Send email
    if [ -n "$NOTIFICATION_EMAIL" ]; then
        echo "$MESSAGE" | mail -s "IvanChat Backup Status" $NOTIFICATION_EMAIL
    fi
}

# Main execution
main() {
    log_info "Starting backup process..."
    
    # Run backups
    backup_mongodb
    backup_redis
    backup_files
    backup_configs
    
    # Create manifest
    create_manifest
    
    # Verify backup
    verify_backup
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Send notification
    send_notification "success"
    
    log_info "Backup process completed successfully!"
}

# Error handling
trap 'log_error "Backup failed!"; send_notification "failed"; exit 1' ERR

# Run main function
main