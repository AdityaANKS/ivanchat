#!/bin/bash

# Secret rotation script for Ivan Chat
# Rotates encryption keys, API keys, and other secrets

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
KEY_DIR="../../security/keys"
BACKUP_DIR="../../security/keys/backup"
ROTATION_LOG="../../security/keys/rotation.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DRY_RUN=${1:-false}
ENVIRONMENT=${2:-development}

# Rotation tracking
ROTATED_KEYS=()
FAILED_KEYS=()
SKIPPED_KEYS=()

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1" >> "$ROTATION_LOG"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1" >> "$ROTATION_LOG"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARN: $1" >> "$ROTATION_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$ROTATION_LOG"
}

# Check if rotation is needed
check_rotation_needed() {
    local key_file=$1
    local max_age_days=${2:-90}
    
    if [ ! -f "$key_file" ]; then
        return 0
    fi
    
    local file_age_days=$(( ($(date +%s) - $(stat -f %m "$key_file" 2>/dev/null || stat -c %Y "$key_file")) / 86400 ))
    
    if [ $file_age_days -ge $max_age_days ]; then
        log_info "Key $key_file is $file_age_days days old (max: $max_age_days)"
        return 0
    else
        log_info "Key $key_file is $file_age_days days old (max: $max_age_days) - skipping"
        return 1
    fi
}

# Backup current keys
backup_keys() {
    log_info "Creating backup of current keys..."
    
    if [ "$DRY_RUN" == "true" ]; then
        log_info "[DRY RUN] Would backup keys to $BACKUP_DIR/keys_pre_rotation_$TIMESTAMP.tar.gz.enc"
        return 0
    fi
    
    # Create encrypted backup
    tar -czf - -C "$KEY_DIR" . | \
        openssl enc -aes-256-cbc -salt -pbkdf2 \
        -out "$BACKUP_DIR/keys_pre_rotation_$TIMESTAMP.tar.gz.enc"
    
    if [ $? -eq 0 ]; then
        log_success "Backup created: keys_pre_rotation_$TIMESTAMP.tar.gz.enc"
        
        # Store backup password securely
        echo "Backup Password Required: Please store the backup password securely" >> "$ROTATION_LOG"
    else
        log_error "Failed to create backup"
        exit 1
    fi
}

# Rotate AES encryption keys
rotate_aes_keys() {
    log_info "Rotating AES encryption keys..."
    
    local aes_key_file="$KEY_DIR/encryption/aes_key.txt"
    
    if ! check_rotation_needed "$aes_key_file" 90; then
        SKIPPED_KEYS+=("AES Key")
        return 0
    fi
    
    if [ "$DRY_RUN" == "true" ]; then
        log_info "[DRY RUN] Would rotate AES key"
        return 0
    fi
    
    # Backup old key
    if [ -f "$aes_key_file" ]; then
        mv "$aes_key_file" "$aes_key_file.old.$TIMESTAMP"
    fi
    
    # Generate new key
    openssl rand -base64 32 > "$aes_key_file"
    chmod 400 "$aes_key_file"
    
    if [ $? -eq 0 ]; then
        log_success "AES key rotated successfully"
        ROTATED_KEYS+=("AES Key")
    else
        log_error "Failed to rotate AES key"
        FAILED_KEYS+=("AES Key")
        return 1
    fi
}

# Rotate JWT keys
rotate_jwt_keys() {
    log_info "Rotating JWT keys..."
    
    local jwt_private_key="$KEY_DIR/jwt/private.pem"
    local jwt_public_key="$KEY_DIR/jwt/public.pem"
    
    if ! check_rotation_needed "$jwt_private_key" 180; then
        SKIPPED_KEYS+=("JWT Keys")
        return 0
    fi
    
    if [ "$DRY_RUN" == "true" ]; then
        log_info "[DRY RUN] Would rotate JWT keys"
        return 0
    fi
    
    # Backup old keys
    if [ -f "$jwt_private_key" ]; then
        mv "$jwt_private_key" "$jwt_private_key.old.$TIMESTAMP"
        mv "$jwt_public_key" "$jwt_public_key.old.$TIMESTAMP"
    fi
    
    # Generate new key pair
    openssl genrsa -out "$jwt_private_key" 4096
    openssl rsa -in "$jwt_private_key" -pubout -out "$jwt_public_key"
    
    # Set permissions
    chmod 400 "$jwt_private_key"
    chmod 444 "$jwt_public_key"
    
    if [ $? -eq 0 ]; then
        log_success "JWT keys rotated successfully"
        ROTATED_KEYS+=("JWT Keys")
    else
        log_error "Failed to rotate JWT keys"
        FAILED_KEYS+=("JWT Keys")
        return 1
    fi
}

# Rotate API keys
rotate_api_keys() {
    log_info "Rotating API keys..."
    
    local api_key_file="$KEY_DIR/api/api_key.txt"
    local api_secret_file="$KEY_DIR/api/api_secret.txt"
    
    if ! check_rotation_needed "$api_key_file" 30; then
        SKIPPED_KEYS+=("API Keys")
        return 0
    fi
    
    if [ "$DRY_RUN" == "true" ]; then
        log_info "[DRY RUN] Would rotate API keys"
        return 0
    fi
    
    # Backup old keys
    if [ -f "$api_key_file" ]; then
        mv "$api_key_file" "$api_key_file.old.$TIMESTAMP"
        mv "$api_secret_file" "$api_secret_file.old.$TIMESTAMP"
    fi
    
    # Generate new keys
    openssl rand -hex 32 > "$api_key_file"
    openssl rand -hex 64 > "$api_secret_file"
    
    # Set permissions
    chmod 400 "$api_key_file"
    chmod 400 "$api_secret_file"
    
    if [ $? -eq 0 ]; then
        log_success "API keys rotated successfully"
        ROTATED_KEYS+=("API Keys")
    else
        log_error "Failed to rotate API keys"
        FAILED_KEYS+=("API Keys")
        return 1
    fi
}

# Rotate master key
rotate_master_key() {
    log_info "Rotating master encryption key..."
    
    local master_key_file="$KEY_DIR/encryption/master.key"
    
    if ! check_rotation_needed "$master_key_file" 365; then
        SKIPPED_KEYS+=("Master Key")
        return 0
    fi
    
    if [ "$DRY_RUN" == "true" ]; then
        log_info "[DRY RUN] Would rotate master key"
        return 0
    fi
    
    # This is critical - require confirmation
    if [ "$ENVIRONMENT" == "production" ]; then
        log_warn "Master key rotation in production requires data re-encryption!"
        read -p "Are you sure you want to continue? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            log_info "Master key rotation cancelled"
            SKIPPED_KEYS+=("Master Key")
            return 0
        fi
    fi
    
    # Backup old key
    if [ -f "$master_key_file" ]; then
        mv "$master_key_file" "$master_key_file.old.$TIMESTAMP"
    fi
    
    # Generate new master key
    openssl rand -hex 64 > "$master_key_file"
    chmod 400 "$master_key_file"
    
    if [ $? -eq 0 ]; then
        log_success "Master key rotated successfully"
        ROTATED_KEYS+=("Master Key")
        log_warn "Remember to re-encrypt all data with the new master key!"
    else
        log_error "Failed to rotate master key"
        FAILED_KEYS+=("Master Key")
        return 1
    fi
}

# Rotate session secret
rotate_session_secret() {
    log_info "Rotating session secret..."
    
    local session_secret_file="$KEY_DIR/encryption/session_secret.txt"
    
    if ! check_rotation_needed "$session_secret_file" 30; then
        SKIPPED_KEYS+=("Session Secret")
        return 0
    fi
    
    if [ "$DRY_RUN" == "true" ]; then
        log_info "[DRY RUN] Would rotate session secret"
        return 0
    fi
    
    # Backup old secret
    if [ -f "$session_secret_file" ]; then
        mv "$session_secret_file" "$session_secret_file.old.$TIMESTAMP"
    fi
    
    # Generate new secret
    openssl rand -base64 64 > "$session_secret_file"
    chmod 400 "$session_secret_file"
    
    if [ $? -eq 0 ]; then
        log_success "Session secret rotated successfully"
        ROTATED_KEYS+=("Session Secret")
        log_warn "Active sessions will be invalidated"
    else
        log_error "Failed to rotate session secret"
        FAILED_KEYS+=("Session Secret")
        return 1
    fi
}

# Rotate database encryption key
rotate_db_encryption_key() {
    log_info "Rotating database encryption key..."
    
    local db_key_file="$KEY_DIR/encryption/db_encryption.key"
    
    if [ ! -f "$db_key_file" ]; then
        log_info "Database encryption key not found, skipping"
        return 0
    fi
    
    if ! check_rotation_needed "$db_key_file" 180; then
        SKIPPED_KEYS+=("Database Key")
        return 0
    fi
    
    if [ "$DRY_RUN" == "true" ]; then
        log_info "[DRY RUN] Would rotate database encryption key"
        return 0
    fi
    
    # Backup old key
    mv "$db_key_file" "$db_key_file.old.$TIMESTAMP"
    
    # Generate new key
    openssl rand -hex 32 > "$db_key_file"
    chmod 400 "$db_key_file"
    
    if [ $? -eq 0 ]; then
        log_success "Database encryption key rotated successfully"
        ROTATED_KEYS+=("Database Key")
        log_warn "Database re-encryption required!"
    else
        log_error "Failed to rotate database encryption key"
        FAILED_KEYS+=("Database Key")
        return 1
    fi
}

# Update environment files
update_env_files() {
    log_info "Updating environment files..."
    
    if [ "$DRY_RUN" == "true" ]; then
        log_info "[DRY RUN] Would update environment files"
        return 0
    fi
    
    local env_file="$KEY_DIR/.env.$ENVIRONMENT"
    
    if [ ! -f "$env_file" ]; then
        log_warn "Environment file not found: $env_file"
        return 0
    fi
    
    # Backup environment file
    cp "$env_file" "$env_file.backup.$TIMESTAMP"
    
    # Update with new keys
    cat > "$env_file" << EOF
# Auto-generated environment variables for $ENVIRONMENT
# Generated: $(date)
# Last rotation: $TIMESTAMP

# Encryption Keys
ENCRYPTION_KEY=$(cat "$KEY_DIR/encryption/aes_key.txt" 2>/dev/null || echo "NOT_SET")
MASTER_KEY=$(cat "$KEY_DIR/encryption/master.key" 2>/dev/null || echo "NOT_SET")
SESSION_SECRET=$(cat "$KEY_DIR/encryption/session_secret.txt" 2>/dev/null || echo "NOT_SET")
HMAC_KEY=$(cat "$KEY_DIR/encryption/hmac_key.txt" 2>/dev/null || echo "NOT_SET")

# JWT Keys
JWT_PRIVATE_KEY_PATH=$KEY_DIR/jwt/private.pem
JWT_PUBLIC_KEY_PATH=$KEY_DIR/jwt/public.pem

# API Keys
API_KEY=$(cat "$KEY_DIR/api/api_key.txt" 2>/dev/null || echo "NOT_SET")
API_SECRET=$(cat "$KEY_DIR/api/api_secret.txt" 2>/dev/null || echo "NOT_SET")

# Rotation Metadata
LAST_ROTATION=$TIMESTAMP
NEXT_ROTATION=$(date -d "+90 days" +%Y%m%d 2>/dev/null || date -v +90d +%Y%m%d)
EOF
    
    chmod 400 "$env_file"
    log_success "Environment file updated"
}

# Verify rotated keys
verify_rotation() {
    log_info "Verifying rotated keys..."
    
    local verification_failed=false
    
    # Check AES key
    if [[ " ${ROTATED_KEYS[@]} " =~ " AES Key " ]]; then
        if [ ! -f "$KEY_DIR/encryption/aes_key.txt" ]; then
            log_error "AES key verification failed"
            verification_failed=true
        fi
    fi
    
    # Check JWT keys
    if [[ " ${ROTATED_KEYS[@]} " =~ " JWT Keys " ]]; then
        if ! openssl rsa -in "$KEY_DIR/jwt/private.pem" -check -noout 2>/dev/null; then
            log_error "JWT key verification failed"
            verification_failed=true
        fi
    fi
    
    # Check API keys
    if [[ " ${ROTATED_KEYS[@]} " =~ " API Keys " ]]; then
        if [ ! -f "$KEY_DIR/api/api_key.txt" ] || [ ! -f "$KEY_DIR/api/api_secret.txt" ]; then
            log_error "API key verification failed"
            verification_failed=true
        fi
    fi
    
    if [ "$verification_failed" = true ]; then
        log_error "Key verification failed! Check rotation log for details."
        return 1
    else
        log_success "All rotated keys verified successfully"
        return 0
    fi
}

# Notify about rotation
send_notification() {
    local subject="Key Rotation Report - $ENVIRONMENT"
    local body="Key rotation completed at $(date)\n\n"
    body+="Environment: $ENVIRONMENT\n"
    body+="Rotated Keys: ${ROTATED_KEYS[*]}\n"
    body+="Failed Keys: ${FAILED_KEYS[*]}\n"
    body+="Skipped Keys: ${SKIPPED_KEYS[*]}\n"
    
    log_info "Rotation notification:"
    echo -e "$body"
    
    # In production, send actual notification
    if [ "$ENVIRONMENT" == "production" ] && [ "$DRY_RUN" != "true" ]; then
        # Send email notification (configure mail command)
        # echo "$body" | mail -s "$subject" security@ivanchat.com
        
        # Send Slack notification (configure webhook)
        # curl -X POST -H 'Content-type: application/json' \
        #      --data "{\"text\":\"$subject\n$body\"}" \
        #      YOUR_SLACK_WEBHOOK_URL
        
        log_info "Production notifications would be sent here"
    fi
}

# Rollback rotation
rollback_rotation() {
    log_error "Rolling back key rotation..."
    
    # Restore old keys
    for key_file in $(find "$KEY_DIR" -name "*.old.$TIMESTAMP"); do
        original_file="${key_file%.old.$TIMESTAMP}"
        mv "$key_file" "$original_file"
        log_info "Restored: $original_file"
    done
    
    # Restore environment file
    env_backup="$KEY_DIR/.env.$ENVIRONMENT.backup.$TIMESTAMP"
    if [ -f "$env_backup" ]; then
        mv "$env_backup" "$KEY_DIR/.env.$ENVIRONMENT"
        log_info "Restored environment file"
    fi
    
    log_warn "Rotation rolled back due to errors"
}

# Clean old backups
clean_old_backups() {
    log_info "Cleaning old backups..."
    
    if [ "$DRY_RUN" == "true" ]; then
        log_info "[DRY RUN] Would clean backups older than 90 days"
        return 0
    fi
    
    # Remove backups older than 90 days
    find "$BACKUP_DIR" -name "*.tar.gz.enc" -mtime +90 -delete
    find "$KEY_DIR" -name "*.old.*" -mtime +90 -delete
    
    log_success "Old backups cleaned"
}

# Generate rotation report
generate_report() {
    local report_file="$BACKUP_DIR/rotation_report_$TIMESTAMP.md"
    
    cat > "$report_file" << EOF
# Key Rotation Report

**Date:** $(date)  
**Environment:** $ENVIRONMENT  
**Timestamp:** $TIMESTAMP  
**Mode:** $([ "$DRY_RUN" == "true" ] && echo "DRY RUN" || echo "LIVE")

## Summary

- **Rotated Keys:** ${#ROTATED_KEYS[@]}
- **Failed Keys:** ${#FAILED_KEYS[@]}
- **Skipped Keys:** ${#SKIPPED_KEYS[@]}

## Details

### Rotated Keys
$(printf '%s\n' "${ROTATED_KEYS[@]}" | sed 's/^/- /')

### Failed Keys
$(printf '%s\n' "${FAILED_KEYS[@]}" | sed 's/^/- /')

### Skipped Keys
$(printf '%s\n' "${SKIPPED_KEYS[@]}" | sed 's/^/- /')

## Next Steps

1. Update application configuration with new keys
2. Restart services to load new keys
3. Monitor application logs for any issues
4. Test authentication and encryption functionality
5. Verify all services are operational

## Backup Location

Encrypted backup stored at:
\`$BACKUP_DIR/keys_pre_rotation_$TIMESTAMP.tar.gz.enc\`

## Important Notes

- Keep backup password secure
- Old keys retained with .old.$TIMESTAMP extension
- Environment file updated: .env.$ENVIRONMENT
- Next rotation due: $(date -d "+90 days" +%Y-%m-%d 2>/dev/null || date -v +90d +%Y-%m-%d)

---
*Generated by automated key rotation script*
EOF
    
    log_success "Report generated: $report_file"
}

# Print summary
print_summary() {
    echo ""
    echo "========================================"
    if [ ${#FAILED_KEYS[@]} -eq 0 ]; then
        echo -e "${GREEN}Key Rotation Complete!${NC}"
    else
        echo -e "${RED}Key Rotation Completed with Errors${NC}"
    fi
    echo "========================================"
    echo ""
    echo "Environment: $ENVIRONMENT"
    echo "Mode: $([ "$DRY_RUN" == "true" ] && echo "DRY RUN" || echo "LIVE")"
    echo ""
    echo "Results:"
    echo -e "  Rotated: ${GREEN}${#ROTATED_KEYS[@]}${NC} keys"
    echo -e "  Failed: ${RED}${#FAILED_KEYS[@]}${NC} keys"
    echo -e "  Skipped: ${YELLOW}${#SKIPPED_KEYS[@]}${NC} keys"
    echo ""
    
    if [ ${#ROTATED_KEYS[@]} -gt 0 ]; then
        echo "Rotated keys:"
        printf '  - %s\n' "${ROTATED_KEYS[@]}"
        echo ""
    fi
    
    if [ ${#FAILED_KEYS[@]} -gt 0 ]; then
        echo -e "${RED}Failed keys:${NC}"
        printf '  - %s\n' "${FAILED_KEYS[@]}"
        echo ""
    fi
    
    if [ "$DRY_RUN" != "true" ] && [ ${#ROTATED_KEYS[@]} -gt 0 ]; then
        echo -e "${YELLOW}IMPORTANT:${NC}"
        echo "  1. Update application configuration"
        echo "  2. Restart all services"
        echo "  3. Test functionality"
        echo "  4. Monitor logs for issues"
    fi
    
    echo ""
    echo "Log file: $ROTATION_LOG"
    echo ""
}

# Main execution
main() {
    echo "========================================"
    echo "Ivan Chat Secret Rotation"
    echo "========================================"
    echo ""
    
    # Initialize log
    mkdir -p "$(dirname "$ROTATION_LOG")"
    echo "=== Secret Rotation Started: $(date) ===" >> "$ROTATION_LOG"
    
    # Check for required tools
    command -v openssl >/dev/null 2>&1 || { log_error "openssl is required but not installed."; exit 1; }
    
    # Show mode
    if [ "$DRY_RUN" == "true" ]; then
        log_warn "Running in DRY RUN mode - no changes will be made"
    else
        log_info "Running in LIVE mode - keys will be rotated"
        
        if [ "$ENVIRONMENT" == "production" ]; then
            log_warn "Production environment selected!"
            read -p "Are you sure you want to rotate production keys? (yes/no): " confirm
            if [ "$confirm" != "yes" ]; then
                log_info "Rotation cancelled"
                exit 0
            fi
        fi
    fi
    
    # Create directories if needed
    mkdir -p "$KEY_DIR/encryption" "$KEY_DIR/jwt" "$KEY_DIR/api" "$BACKUP_DIR"
    
    # Execute rotation
    backup_keys
    
    # Rotate each key type
    rotate_aes_keys || true
    rotate_jwt_keys || true
    rotate_api_keys || true
    rotate_master_key || true
    rotate_session_secret || true
    rotate_db_encryption_key || true
    
    # Post-rotation tasks
    if [ "$DRY_RUN" != "true" ]; then
        if [ ${#FAILED_KEYS[@]} -eq 0 ]; then
            update_env_files
            verify_rotation
            clean_old_backups
        else
            rollback_rotation
        fi
    fi
    
    # Generate report and notify
    generate_report
    send_notification
    print_summary
    
    # Exit with error if any keys failed
    if [ ${#FAILED_KEYS[@]} -gt 0 ]; then
        exit 1
    fi
}

# Run main
main