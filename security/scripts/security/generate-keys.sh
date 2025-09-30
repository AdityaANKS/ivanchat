#!/bin/bash

# Generate encryption keys for Ivan Chat
# Usage: ./generate-keys.sh [environment]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-development}
KEY_DIR="../../security/keys"
BACKUP_DIR="../../security/keys/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

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

# Create directories
create_directories() {
    log_info "Creating key directories..."
    mkdir -p "$KEY_DIR/encryption"
    mkdir -p "$KEY_DIR/jwt"
    mkdir -p "$KEY_DIR/api"
    mkdir -p "$KEY_DIR/ssh"
    mkdir -p "$BACKUP_DIR"
    
    # Set permissions
    chmod 700 "$KEY_DIR"
    chmod 700 "$BACKUP_DIR"
}

# Backup existing keys
backup_keys() {
    if [ -n "$(ls -A $KEY_DIR 2>/dev/null)" ]; then
        log_info "Backing up existing keys..."
        tar -czf "$BACKUP_DIR/keys_backup_$TIMESTAMP.tar.gz" -C "$KEY_DIR" .
        log_info "Backup created: keys_backup_$TIMESTAMP.tar.gz"
    fi
}

# Generate AES encryption key
generate_aes_key() {
    log_info "Generating AES-256 encryption key..."
    openssl rand -base64 32 > "$KEY_DIR/encryption/aes_key.txt"
    chmod 400 "$KEY_DIR/encryption/aes_key.txt"
}

# Generate RSA key pair for JWT
generate_jwt_keys() {
    log_info "Generating RSA key pair for JWT..."
    
    # Generate private key
    openssl genrsa -out "$KEY_DIR/jwt/private.pem" 4096
    
    # Generate public key
    openssl rsa -in "$KEY_DIR/jwt/private.pem" -pubout -out "$KEY_DIR/jwt/public.pem"
    
    # Set permissions
    chmod 400 "$KEY_DIR/jwt/private.pem"
    chmod 444 "$KEY_DIR/jwt/public.pem"
}

# Generate API keys
generate_api_keys() {
    log_info "Generating API keys..."
    
    # Generate random API key
    openssl rand -hex 32 > "$KEY_DIR/api/api_key.txt"
    
    # Generate API secret
    openssl rand -hex 64 > "$KEY_DIR/api/api_secret.txt"
    
    # Set permissions
    chmod 400 "$KEY_DIR/api/"*.txt
}

# Generate SSH keys
generate_ssh_keys() {
    log_info "Generating SSH keys..."
    
    # Generate Ed25519 SSH key (recommended)
    ssh-keygen -t ed25519 -f "$KEY_DIR/ssh/id_ed25519" -N "" -C "ivan-chat-$ENVIRONMENT"
    
    # Generate RSA SSH key (fallback)
    ssh-keygen -t rsa -b 4096 -f "$KEY_DIR/ssh/id_rsa" -N "" -C "ivan-chat-$ENVIRONMENT"
    
    # Set permissions
    chmod 400 "$KEY_DIR/ssh/id_"*
    chmod 444 "$KEY_DIR/ssh/"*.pub
}

# Generate Diffie-Hellman parameters
generate_dhparam() {
    log_info "Generating Diffie-Hellman parameters (this may take a while)..."
    openssl dhparam -out "$KEY_DIR/encryption/dhparam.pem" 2048
    chmod 444 "$KEY_DIR/encryption/dhparam.pem"
}

# Generate master key
generate_master_key() {
    log_info "Generating master encryption key..."
    openssl rand -hex 64 > "$KEY_DIR/encryption/master.key"
    chmod 400 "$KEY_DIR/encryption/master.key"
}

# Generate session secret
generate_session_secret() {
    log_info "Generating session secret..."
    openssl rand -base64 64 > "$KEY_DIR/encryption/session_secret.txt"
    chmod 400 "$KEY_DIR/encryption/session_secret.txt"
}

# Generate HMAC key
generate_hmac_key() {
    log_info "Generating HMAC key..."
    openssl rand -hex 64 > "$KEY_DIR/encryption/hmac_key.txt"
    chmod 400 "$KEY_DIR/encryption/hmac_key.txt"
}

# Create environment file
create_env_file() {
    log_info "Creating environment variables file..."
    
    cat > "$KEY_DIR/.env.$ENVIRONMENT" << EOF
# Auto-generated environment variables for $ENVIRONMENT
# Generated: $(date)

# Encryption Keys
ENCRYPTION_KEY=$(cat "$KEY_DIR/encryption/aes_key.txt")
MASTER_KEY=$(cat "$KEY_DIR/encryption/master.key")
SESSION_SECRET=$(cat "$KEY_DIR/encryption/session_secret.txt")
HMAC_KEY=$(cat "$KEY_DIR/encryption/hmac_key.txt")

# JWT Keys
JWT_PRIVATE_KEY_PATH=$KEY_DIR/jwt/private.pem
JWT_PUBLIC_KEY_PATH=$KEY_DIR/jwt/public.pem

# API Keys
API_KEY=$(cat "$KEY_DIR/api/api_key.txt")
API_SECRET=$(cat "$KEY_DIR/api/api_secret.txt")

# SSH Keys
SSH_PRIVATE_KEY_PATH=$KEY_DIR/ssh/id_ed25519
SSH_PUBLIC_KEY_PATH=$KEY_DIR/ssh/id_ed25519.pub
EOF
    
    chmod 400 "$KEY_DIR/.env.$ENVIRONMENT"
    
    log_info "Environment file created: .env.$ENVIRONMENT"
}

# Verify keys
verify_keys() {
    log_info "Verifying generated keys..."
    
    # Verify RSA keys
    openssl rsa -in "$KEY_DIR/jwt/private.pem" -check -noout
    
    # Verify key files exist
    local required_files=(
        "$KEY_DIR/encryption/aes_key.txt"
        "$KEY_DIR/encryption/master.key"
        "$KEY_DIR/jwt/private.pem"
        "$KEY_DIR/jwt/public.pem"
        "$KEY_DIR/api/api_key.txt"
        "$KEY_DIR/api/api_secret.txt"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "Missing required file: $file"
            exit 1
        fi
    done
    
    log_info "All keys verified successfully"
}

# Print summary
print_summary() {
    echo ""
    echo "========================================"
    echo -e "${GREEN}Key Generation Complete!${NC}"
    echo "========================================"
    echo ""
    echo "Generated keys for environment: $ENVIRONMENT"
    echo ""
    echo "Key locations:"
    echo "  - Encryption keys: $KEY_DIR/encryption/"
    echo "  - JWT keys: $KEY_DIR/jwt/"
    echo "  - API keys: $KEY_DIR/api/"
    echo "  - SSH keys: $KEY_DIR/ssh/"
    echo ""
    echo "Environment file: $KEY_DIR/.env.$ENVIRONMENT"
    echo ""
    echo -e "${YELLOW}IMPORTANT:${NC}"
    echo "  1. Keep these keys secure and never commit them to version control"
    echo "  2. Backup keys have been created in: $BACKUP_DIR"
    echo "  3. Set appropriate file permissions for production use"
    echo "  4. Rotate keys regularly according to your security policy"
    echo ""
}

# Main execution
main() {
    echo "========================================"
    echo "Ivan Chat Security Key Generator"
    echo "Environment: $ENVIRONMENT"
    echo "========================================"
    echo ""
    
    # Check for required tools
    command -v openssl >/dev/null 2>&1 || { log_error "openssl is required but not installed."; exit 1; }
    command -v ssh-keygen >/dev/null 2>&1 || { log_error "ssh-keygen is required but not installed."; exit 1; }
    
    # Confirm before proceeding
    if [ "$ENVIRONMENT" == "production" ]; then
        log_warn "You are generating keys for PRODUCTION environment!"
        read -p "Are you sure you want to continue? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            log_info "Key generation cancelled"
            exit 0
        fi
    fi
    
    # Execute key generation
    create_directories
    backup_keys
    generate_aes_key
    generate_jwt_keys
    generate_api_keys
    generate_ssh_keys
    generate_dhparam
    generate_master_key
    generate_session_secret
    generate_hmac_key
    create_env_file
    verify_keys
    print_summary
}

# Run main function
main