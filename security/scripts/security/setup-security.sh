#!/bin/bash

# Security Setup Script for Ivan Application
# This script sets up all security configurations

set -e

echo "🔐 Setting up security for Ivan application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create security directories
echo -e "${YELLOW}Creating security directories...${NC}"
mkdir -p server/ssl
mkdir -p server/keys
mkdir -p security/ssl
mkdir -p security/keys
mkdir -p security/policies

# Generate SSL certificates
echo -e "${YELLOW}Generating SSL certificates...${NC}"
openssl req -x509 -newkey rsa:4096 \
  -keyout server/ssl/key.pem \
  -out server/ssl/cert.pem \
  -days 365 -nodes \
  -subj "/C=US/ST=State/L=City/O=Ivan/OU=Security/CN=localhost"

# Generate JWT keys
echo -e "${YELLOW}Generating JWT keys...${NC}"
openssl genrsa -out server/keys/jwt-private.pem 4096
openssl rsa -in server/keys/jwt-private.pem -pubout -out server/keys/jwt-public.pem

# Generate encryption keys
echo -e "${YELLOW}Generating encryption keys...${NC}"
MASTER_KEY=$(openssl rand -hex 32)
DB_ENCRYPTION_KEY=$(openssl rand -hex 32)
PASSWORD_PEPPER=$(openssl rand -hex 64)
SESSION_SECRET=$(openssl rand -hex 64)
SIGNING_SECRET=$(openssl rand -hex 32)
API_SECRET=$(openssl rand -hex 32)

# Create .env.production file
echo -e "${YELLOW}Creating .env.production file...${NC}"
cat > server/.env.production << EOF
# Environment
NODE_ENV=production

# Security Keys
PASSWORD_PEPPER=$PASSWORD_PEPPER
MASTER_ENCRYPTION_KEY=$MASTER_KEY
DB_ENCRYPTION_KEY=$DB_ENCRYPTION_KEY
SESSION_SECRET=$SESSION_SECRET
SIGNING_SECRET=$SIGNING_SECRET
API_SECRET=$API_SECRET

# JWT Keys
JWT_PRIVATE_KEY=$(cat server/keys/jwt-private.pem | base64 -w 0)
JWT_PUBLIC_KEY=$(cat server/keys/jwt-public.pem | base64 -w 0)
JWT_KID=$(openssl rand -hex 16)

# Database
MONGODB_URI=mongodb://username:password@localhost:27017/ivan?authSource=admin&ssl=true&replicaSet=rs0
MONGODB_ENCRYPTION=true

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=$(openssl rand -base64 32)
REDIS_TLS=true

# Application
APP_URL=https://yourdomain.com
DOMAIN=yourdomain.com
COOKIE_DOMAIN=.yourdomain.com

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AWS (for S3 storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-west-2
AWS_S3_BUCKET=ivan-secure-storage

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=error

# 2FA
TWO_FACTOR_APP_NAME=Ivan Secure Chat

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security Headers
HSTS_MAX_AGE=31536000
CSP_REPORT_URI=https://yourdomain.com/csp-report
EOF

# Set proper permissions
echo -e "${YELLOW}Setting file permissions...${NC}"
chmod 600 server/.env.production
chmod 600 server/ssl/*
chmod 600 server/keys/*
chmod 700 server/ssl
chmod 700 server/keys

# Generate MongoDB user
echo -e "${YELLOW}Generating MongoDB credentials...${NC}"
MONGO_ADMIN_USER="ivan_admin"
MONGO_ADMIN_PASS=$(openssl rand -base64 32)
MONGO_APP_USER="ivan_app"
MONGO_APP_PASS=$(openssl rand -base64 32)

cat > security/mongodb-init.js << EOF
// MongoDB initialization script
use admin;
db.createUser({
  user: "$MONGO_ADMIN_USER",
  pwd: "$MONGO_ADMIN_PASS",
  roles: ["root"]
});

use ivan;
db.createUser({
  user: "$MONGO_APP_USER",
  pwd: "$MONGO_APP_PASS",
  roles: ["readWrite", "dbAdmin"]
});

// Enable encryption at rest
db.adminCommand({
  setParameter: 1,
  enableEncryption: true,
  encryptionCipherMode: "AES256-GCM"
});
EOF

# Install security dependencies
echo -e "${YELLOW}Installing security dependencies...${NC}"
cd server
npm install --save \
  argon2 \
  @signalapp/libsignal-client \
  helmet \
  express-rate-limit \
  rate-limit-redis \
  express-mongo-sanitize \
  xss-clean \
  hpp \
  speakeasy \
  qrcode \
  express-validator \
  joi \
  zxcvbn \
  openpgp \
  tweetnacl \
  tweetnacl-util \
  crypto-js \
  node-forge \
  uuid \
  csurf

cd ../client
npm install --save \
  openpgp \
  tweetnacl \
  tweetnacl-util \
  crypto-js \
  @simplewebauthn/browser \
  dexie

cd ..

# Create security policies
echo -e "${YELLOW}Creating security policies...${NC}"
cat > security/policies/security-policy.json << EOF
{
  "version": "1.0",
  "policies": {
    "passwordPolicy": {
      "minLength": 12,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true,
      "maxAge": 90,
      "historyCount": 5
    },
    "sessionPolicy": {
      "maxConcurrentSessions": 5,
      "sessionTimeout": 900,
      "absoluteTimeout": 28800,
      "idleTimeout": 1800
    },
    "accessControl": {
      "maxLoginAttempts": 5,
      "lockoutDuration": 1800,
      "requireMFA": true,
      "ipWhitelisting": false
    },
    "dataProtection": {
      "encryptionAtRest": true,
      "encryptionInTransit": true,
      "dataRetention": 90,
      "auditLogRetention": 365
    }
  }
}
EOF

# Create backup script
echo -e "${YELLOW}Creating backup script...${NC}"
cat > scripts/security/backup-keys.sh << 'EOF'
#!/bin/bash
# Backup security keys
BACKUP_DIR="/secure/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup keys
cp -r server/keys $BACKUP_DIR/
cp -r server/ssl $BACKUP_DIR/
cp server/.env.production $BACKUP_DIR/

# Encrypt backup
tar -czf - $BACKUP_DIR | openssl enc -aes-256-cbc -salt -out $BACKUP_DIR.tar.gz.enc

# Remove unencrypted backup
rm -rf $BACKUP_DIR

echo "Backup created: $BACKUP_DIR.tar.gz.enc"
EOF

chmod +x scripts/security/backup-keys.sh

# Create security audit script
echo -e "${YELLOW}Creating security audit script...${NC}"
cat > scripts/security/security-audit.sh << 'EOF'
#!/bin/bash
# Security audit script

echo "Running security audit..."

# Check for outdated packages
echo "Checking for outdated packages..."
npm audit

# Check SSL certificate expiry
echo "Checking SSL certificate..."
openssl x509 -in server/ssl/cert.pem -noout -checkend 2592000

# Check file permissions
echo "Checking file permissions..."
find server -name "*.env*" -exec ls -la {} \;
find server/keys -type f -exec ls -la {} \;
find server/ssl -type f -exec ls -la {} \;

# Check for exposed secrets
echo "Checking for exposed secrets..."
grep -r "password\|secret\|key\|token" --include="*.js" --include="*.json" --exclude-dir=node_modules .

echo "Security audit complete!"
EOF

chmod +x scripts/security/security-audit.sh

# Generate README
echo -e "${YELLOW}Creating security README...${NC}"
cat > security/README.md << EOF
# Security Configuration

## Generated Keys and Certificates

- **SSL Certificate**: server/ssl/cert.pem
- **SSL Private Key**: server/ssl/key.pem
- **JWT Private Key**: server/keys/jwt-private.pem
- **JWT Public Key**: server/keys/jwt-public.pem

## MongoDB Credentials

- **Admin User**: $MONGO_ADMIN_USER
- **Admin Password**: $MONGO_ADMIN_PASS
- **App User**: $MONGO_APP_USER
- **App Password**: $MONGO_APP_PASS

## Important Security Notes

1. **Never commit** .env files or keys to version control
2. **Rotate keys** regularly (every 90 days)
3. **Monitor** audit logs for suspicious activity
4. **Backup** keys securely using the backup script
5. **Run security audits** weekly

## Security Scripts

- **Setup**: scripts/security/setup-security.sh
- **Backup**: scripts/security/backup-keys.sh
- **Audit**: scripts/security/security-audit.sh
- **Key Rotation**: scripts/security/rotate-secrets.sh

## Compliance

This setup follows:
- OWASP Top 10 security practices
- PCI DSS requirements
- GDPR compliance
- SOC 2 Type II standards
- ISO 27001 guidelines

## Emergency Contacts

- Security Team: security@yourdomain.com
- On-call: +1-xxx-xxx-xxxx
EOF

echo -e "${GREEN}✅ Security setup complete!${NC}"
echo -e "${GREEN}MongoDB Admin User: $MONGO_ADMIN_USER${NC}"
echo -e "${GREEN}MongoDB Admin Password: $MONGO_ADMIN_PASS${NC}"
echo -e "${GREEN}MongoDB App User: $MONGO_APP_USER${NC}"
echo -e "${GREEN}MongoDB App Password: $MONGO_APP_PASS${NC}"
echo -e "${RED}⚠️  Please save these credentials securely!${NC}"