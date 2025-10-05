#!/bin/bash
# scripts/setup.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_NAME="ivanchat"
REQUIRED_NODE_VERSION="18"
REQUIRED_NPM_VERSION="9"

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║                   IvanChat Setup Script                     ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_step() {
    echo -e "\n${BLUE}▶${NC} $1"
}

# Check system requirements
check_requirements() {
    log_step "Checking system requirements..."
    
    # Check Node.js
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
        if [ "$NODE_VERSION" -ge "$REQUIRED_NODE_VERSION" ]; then
            log_info "Node.js version $(node -v) is installed"
        else
            log_error "Node.js version $REQUIRED_NODE_VERSION or higher is required"
            exit 1
        fi
    else
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm -v | cut -d. -f1)
        if [ "$NPM_VERSION" -ge "$REQUIRED_NPM_VERSION" ]; then
            log_info "npm version $(npm -v) is installed"
        else
            log_warn "npm version $REQUIRED_NPM_VERSION or higher is recommended"
        fi
    else
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check Docker
    if command -v docker >/dev/null 2>&1; then
        log_info "Docker version $(docker --version | cut -d' ' -f3 | sed 's/,//') is installed"
    else
        log_warn "Docker is not installed (required for containerized deployment)"
    fi
    
    # Check Docker Compose
    if command -v docker-compose >/dev/null 2>&1; then
        log_info "Docker Compose version $(docker-compose --version | cut -d' ' -f4) is installed"
    else
        log_warn "Docker Compose is not installed (required for local development)"
    fi
    
    # Check Git
    if command -v git >/dev/null 2>&1; then
        log_info "Git version $(git --version | cut -d' ' -f3) is installed"
    else
        log_error "Git is not installed"
        exit 1
    fi
}

# Create project structure
create_structure() {
    log_step "Creating project structure..."
    
    # Create main directories
    directories=(
        "server/src/config"
        "server/src/models"
        "server/src/routes"
        "server/src/controllers"
        "server/src/middleware"
        "server/src/services"
        "server/src/socket"
        "server/src/utils"
        "server/tests"
        "client/src/components"
        "client/src/pages"
        "client/src/contexts"
        "client/src/hooks"
        "client/src/services"
        "client/src/utils"
        "client/src/styles"
        "client/src/assets"
        "mobile/src"
        "desktop/src"
        "shared/types"
        "shared/utils"
        "infrastructure/terraform"
        "infrastructure/kubernetes"
        "infrastructure/helm"
        "monitoring"
        "scripts"
        "docs"
        "security/ssl"
        "security/keys"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        log_info "Created directory: $dir"
    done
}

# Install dependencies
install_dependencies() {
    log_step "Installing dependencies..."
    
    # Install root dependencies
    log_info "Installing root dependencies..."
    npm install
    
    # Install server dependencies
    log_info "Installing server dependencies..."
    cd server && npm install && cd ..
    
    # Install client dependencies
    log_info "Installing client dependencies..."
    cd client && npm install && cd ..
    
    log_info "All dependencies installed successfully"
}

# Setup environment files
setup_environment() {
    log_step "Setting up environment files..."
    
    # Create .env file from example
    if [ -f ".env.example" ]; then
        cp .env.example .env
        log_info "Created .env file from .env.example"
    else
        log_warn ".env.example not found, creating default .env file"
        cat > .env <<EOF
# Environment
NODE_ENV=development

# Server
PORT=5000
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/ivanchat
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# Client
CLIENT_URL=http://localhost:3000

# AWS (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=

# OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email (Optional)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
EOF
        log_info "Created default .env file"
    fi
    
    # Create server .env
    cp server/.env.example server/.env 2>/dev/null || log_warn "Server .env.example not found"
    
    # Create client .env
    cp client/.env.example client/.env 2>/dev/null || log_warn "Client .env.example not found"
}

# Generate SSL certificates for development
generate_certificates() {
    log_step "Generating SSL certificates for development..."
    
    CERT_DIR="security/ssl"
    
    # Generate private key
    openssl genrsa -out "$CERT_DIR/key.pem" 2048 2>/dev/null
    
    # Generate certificate signing request
    openssl req -new -key "$CERT_DIR/key.pem" -out "$CERT_DIR/csr.pem" -subj "/C=US/ST=State/L=City/O=IvanChat/CN=localhost" 2>/dev/null
    
    # Generate self-signed certificate
    openssl x509 -req -days 365 -in "$CERT_DIR/csr.pem" -signkey "$CERT_DIR/key.pem" -out "$CERT_DIR/cert.pem" 2>/dev/null
    
    # Clean up CSR
    rm "$CERT_DIR/csr.pem"
    
    log_info "SSL certificates generated in $CERT_DIR/"
}

# Setup Docker environment
setup_docker() {
    log_step "Setting up Docker environment..."
    
    # Create Docker network
    docker network create ivanchat-network 2>/dev/null || log_warn "Docker network already exists"
    
    # Pull required images
    log_info "Pulling Docker images..."
    docker pull mongo:6.0
    docker pull redis:7-alpine
    docker pull nginx:alpine
    
    log_info "Docker environment setup completed"
}

# Initialize database
initialize_database() {
    log_step "Initializing database..."
    
    # Start MongoDB container
    docker run -d \
        --name ivanchat-mongodb-temp \
        --network ivanchat-network \
        -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=password \
        mongo:6.0 >/dev/null 2>&1
    
    # Wait for MongoDB to start
    sleep 5
    
    # Create database and user
    docker exec ivanchat-mongodb-temp mongosh --eval "
        use admin;
        db.auth('admin', 'password');
        use ivanchat;
        db.createUser({
            user: 'ivanchat',
            pwd: 'ivanchat_password',
            roles: [{ role: 'readWrite', db: 'ivanchat' }]
        });
    " >/dev/null 2>&1
    
    # Stop and remove temporary container
    docker stop ivanchat-mongodb-temp >/dev/null 2>&1
    docker rm ivanchat-mongodb-temp >/dev/null 2>&1
    
    log_info "Database initialized"
}

# Setup Git hooks
setup_git_hooks() {
    log_step "Setting up Git hooks..."
    
    # Create pre-commit hook
    cat > .git/hooks/pre-commit <<'EOF'
#!/bin/bash
# Run linting before commit
npm run lint
EOF
    
    chmod +x .git/hooks/pre-commit
    
    # Create commit-msg hook
    cat > .git/hooks/commit-msg <<'EOF'
#!/bin/bash
# Validate commit message format
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(KATEX_INLINE_OPEN.+KATEX_INLINE_CLOSE)?: .{1,50}'
if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format!"
    echo "Format: type(scope): subject"
    echo "Example: feat(auth): add OAuth2 login"
    exit 1
fi
EOF
    
    chmod +x .git/hooks/commit-msg
    
    log_info "Git hooks configured"
}

# Create initial documentation
create_documentation() {
    log_step "Creating initial documentation..."
    
    # Create API documentation template
    cat > docs/API.md <<'EOF'
# IvanChat API Documentation

## Authentication

### POST /api/auth/register
Register a new user.

### POST /api/auth/login
Login with email and password.

## Users

### GET /api/users/profile
Get current user profile.

### PUT /api/users/profile
Update user profile.

## Messages

### GET /api/messages/:channelId
Get messages for a channel.

### POST /api/messages
Send a new message.
EOF
    
    # Create setup documentation
    cat > docs/SETUP.md <<'EOF'
# IvanChat Setup Guide

## Prerequisites
- Node.js 18+
- npm 9+
- Docker and Docker Compose
- MongoDB 6.0+
- Redis 7+

## Installation
1. Clone the repository
2. Run `./scripts/setup.sh`
3. Configure environment variables
4. Start the application with `docker-compose up`

## Development
- Backend: `npm run dev:server`
- Frontend: `npm run dev:client`
- Mobile: `npm run dev:mobile`
- Desktop: `npm run dev:desktop`
EOF
    
    log_info "Documentation created"
}

# Final setup summary
print_summary() {
    echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    Setup Completed Successfully!             ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Review and update the .env file with your configuration"
    echo "2. Start the development environment: docker-compose up"
    echo "3. Access the application at http://localhost:3000"
    echo "4. Access the API at http://localhost:5000"
    echo
    echo -e "${BLUE}Useful commands:${NC}"
    echo "• Start development: npm run dev"
    echo "• Run tests: npm test"
    echo "• Build for production: npm run build"
    echo "• Deploy: npm run deploy"
    echo
    echo -e "${GREEN}Happy coding! 🚀${NC}"
}

# Main execution
main() {
    print_header
    
    check_requirements
    create_structure
    install_dependencies
    setup_environment
    generate_certificates
    setup_docker
    initialize_database
    setup_git_hooks
    create_documentation
    
    print_summary
}

# Run main function
main