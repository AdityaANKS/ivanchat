#!/bin/bash

# Security audit script for Ivan Chat
# Performs comprehensive security checks

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_ROOT="../.."
REPORT_DIR="$PROJECT_ROOT/security/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$REPORT_DIR/security_audit_$TIMESTAMP.md"

# Counters
CRITICAL_COUNT=0
HIGH_COUNT=0
MEDIUM_COUNT=0
LOW_COUNT=0
PASS_COUNT=0

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASS_COUNT++))
}

log_critical() {
    echo -e "${RED}[CRITICAL]${NC} $1"
    ((CRITICAL_COUNT++))
}

log_high() {
    echo -e "${RED}[HIGH]${NC} $1"
    ((HIGH_COUNT++))
}

log_medium() {
    echo -e "${YELLOW}[MEDIUM]${NC} $1"
    ((MEDIUM_COUNT++))
}

log_low() {
    echo -e "${YELLOW}[LOW]${NC} $1"
    ((LOW_COUNT++))
}

# Initialize report
init_report() {
    mkdir -p "$REPORT_DIR"
    
    cat > "$REPORT_FILE" << EOF
# Security Audit Report
**Date:** $(date)
**Project:** Ivan Chat

## Executive Summary

This report contains the results of an automated security audit.

---

## Audit Results

EOF
}

# Check dependencies
check_dependencies() {
    log_info "Checking for vulnerable dependencies..."
    echo "### Dependency Vulnerabilities" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # NPM audit
    if command -v npm &> /dev/null; then
        log_info "Running npm audit..."
        cd "$PROJECT_ROOT"
        
        npm_audit=$(npm audit --json 2>/dev/null || true)
        vulnerabilities=$(echo "$npm_audit" | jq '.metadata.vulnerabilities' 2>/dev/null || echo "{}")
        
        critical=$(echo "$vulnerabilities" | jq '.critical // 0')
        high=$(echo "$vulnerabilities" | jq '.high // 0')
        medium=$(echo "$vulnerabilities" | jq '.medium // 0')
        low=$(echo "$vulnerabilities" | jq '.low // 0')
        
        if [ "$critical" -gt 0 ]; then
            log_critical "Found $critical critical npm vulnerabilities"
            echo "- **CRITICAL:** $critical critical vulnerabilities found" >> "$REPORT_FILE"
        fi
        
        if [ "$high" -gt 0 ]; then
            log_high "Found $high high npm vulnerabilities"
            echo "- **HIGH:** $high high vulnerabilities found" >> "$REPORT_FILE"
        fi
        
        if [ "$medium" -gt 0 ]; then
            log_medium "Found $medium medium npm vulnerabilities"
            echo "- **MEDIUM:** $medium medium vulnerabilities found" >> "$REPORT_FILE"
        fi
        
        if [ "$low" -gt 0 ]; then
            log_low "Found $low low npm vulnerabilities"
            echo "- **LOW:** $low low vulnerabilities found" >> "$REPORT_FILE"
        fi
        
        if [ "$critical" -eq 0 ] && [ "$high" -eq 0 ] && [ "$medium" -eq 0 ] && [ "$low" -eq 0 ]; then
            log_pass "No npm vulnerabilities found"
            echo "- **PASS:** No npm vulnerabilities found" >> "$REPORT_FILE"
        fi
    fi
    
    echo "" >> "$REPORT_FILE"
}

# Check for hardcoded secrets
check_secrets() {
    log_info "Checking for hardcoded secrets..."
    echo "### Hardcoded Secrets" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # Patterns to search for
    patterns=(
        "password.*=.*['\"].*['\"]"
        "api[_-]?key.*=.*['\"].*['\"]"
        "secret.*=.*['\"].*['\"]"
        "token.*=.*['\"].*['\"]"
        "private[_-]?key.*=.*['\"].*['\"]"
    )
    
    found_secrets=false
    
    for pattern in "${patterns[@]}"; do
        results=$(grep -r -i --include="*.js" --include="*.ts" --include="*.json" \
                 --exclude-dir=node_modules --exclude-dir=.git \
                 -E "$pattern" "$PROJECT_ROOT" 2>/dev/null || true)
        
        if [ -n "$results" ]; then
            log_high "Found potential hardcoded secrets matching pattern: $pattern"
            echo "- **HIGH:** Found potential secrets matching: $pattern" >> "$REPORT_FILE"
            found_secrets=true
        fi
    done
    
    if [ "$found_secrets" = false ]; then
        log_pass "No hardcoded secrets found"
        echo "- **PASS:** No hardcoded secrets detected" >> "$REPORT_FILE"
    fi
    
    echo "" >> "$REPORT_FILE"
}

# Check SSL/TLS configuration
check_ssl() {
    log_info "Checking SSL/TLS configuration..."
    echo "### SSL/TLS Configuration" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # Check for SSL certificates
    if [ -d "$PROJECT_ROOT/security/ssl" ]; then
        cert_count=$(find "$PROJECT_ROOT/security/ssl" -name "*.crt" -o -name "*.pem" | wc -l)
        
        if [ "$cert_count" -gt 0 ]; then
            log_info "Found $cert_count SSL certificate(s)"
            echo "- Found $cert_count SSL certificate(s)" >> "$REPORT_FILE"
            
            # Check certificate expiration
            for cert in $(find "$PROJECT_ROOT/security/ssl" -name "*.crt" -o -name "*.pem"); do
                if openssl x509 -in "$cert" -noout -checkend 86400 2>/dev/null; then
                    log_pass "Certificate $cert is valid"
                else
                    log_high "Certificate $cert is expired or expiring soon"
                    echo "- **HIGH:** Certificate expired or expiring: $cert" >> "$REPORT_FILE"
                fi
            done
        else
            log_medium "No SSL certificates found"
            echo "- **MEDIUM:** No SSL certificates found" >> "$REPORT_FILE"
        fi
    fi
    
    echo "" >> "$REPORT_FILE"
}

# Check file permissions
check_permissions() {
    log_info "Checking file permissions..."
    echo "### File Permissions" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # Check for world-writable files
    world_writable=$(find "$PROJECT_ROOT" -type f -perm -002 \
                     -not -path "*/node_modules/*" \
                     -not -path "*/.git/*" 2>/dev/null || true)
    
    if [ -n "$world_writable" ]; then
        log_high "Found world-writable files"
        echo "- **HIGH:** Found world-writable files" >> "$REPORT_FILE"
        echo "$world_writable" | head -5 >> "$REPORT_FILE"
    else
        log_pass "No world-writable files found"
        echo "- **PASS:** No world-writable files found" >> "$REPORT_FILE"
    fi
    
    # Check key file permissions
    if [ -d "$PROJECT_ROOT/security/keys" ]; then
        insecure_keys=$(find "$PROJECT_ROOT/security/keys" -type f \
                        ! -perm 600 ! -perm 400 ! -perm 444 2>/dev/null || true)
        
        if [ -n "$insecure_keys" ]; then
            log_critical "Found keys with insecure permissions"
            echo "- **CRITICAL:** Found keys with insecure permissions" >> "$REPORT_FILE"
        else
            log_pass "Key files have secure permissions"
            echo "- **PASS:** Key files have secure permissions" >> "$REPORT_FILE"
        fi
    fi
    
    echo "" >> "$REPORT_FILE"
}

# Check security headers
check_headers() {
    log_info "Checking security headers configuration..."
    echo "### Security Headers" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # Check for security middleware
    headers_to_check=(
        "helmet"
        "cors"
        "csp"
        "hsts"
        "x-frame-options"
        "x-content-type-options"
        "x-xss-protection"
    )
    
    for header in "${headers_to_check[@]}"; do
        if grep -r -q "$header" "$PROJECT_ROOT/server" 2>/dev/null; then
            log_pass "Found configuration for $header"
            echo "- **PASS:** $header configured" >> "$REPORT_FILE"
        else
            log_medium "No configuration found for $header"
            echo "- **MEDIUM:** $header not configured" >> "$REPORT_FILE"
        fi
    done
    
    echo "" >> "$REPORT_FILE"
}

# Check authentication
check_authentication() {
    log_info "Checking authentication configuration..."
    echo "### Authentication" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # Check for password hashing
    if grep -r -q "bcrypt\|argon2\|scrypt" "$PROJECT_ROOT/server" 2>/dev/null; then
        log_pass "Secure password hashing found"
        echo "- **PASS:** Secure password hashing implemented" >> "$REPORT_FILE"
    else
        log_critical "No secure password hashing found"
        echo "- **CRITICAL:** No secure password hashing found" >> "$REPORT_FILE"
    fi
    
    # Check for JWT implementation
    if grep -r -q "jsonwebtoken\|jwt" "$PROJECT_ROOT/server" 2>/dev/null; then
        log_pass "JWT authentication found"
        echo "- **PASS:** JWT authentication implemented" >> "$REPORT_FILE"
    else
        log_medium "No JWT implementation found"
        echo "- **MEDIUM:** No JWT implementation found" >> "$REPORT_FILE"
    fi
    
    # Check for rate limiting
    if grep -r -q "rate-limit\|express-rate-limit" "$PROJECT_ROOT/server" 2>/dev/null; then
        log_pass "Rate limiting found"
        echo "- **PASS:** Rate limiting implemented" >> "$REPORT_FILE"
    else
        log_high "No rate limiting found"
        echo "- **HIGH:** No rate limiting found" >> "$REPORT_FILE"
    fi
    
    echo "" >> "$REPORT_FILE"
}

# Check encryption
check_encryption() {
    log_info "Checking encryption implementation..."
    echo "### Encryption" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # Check for encryption libraries
    if grep -r -q "crypto\|cryptojs\|node-forge" "$PROJECT_ROOT" 2>/dev/null; then
        log_pass "Encryption libraries found"
        echo "- **PASS:** Encryption libraries in use" >> "$REPORT_FILE"
    else
        log_high "No encryption libraries found"
        echo "- **HIGH:** No encryption libraries found" >> "$REPORT_FILE"
    fi
    
    # Check for E2E encryption
    if grep -r -q "e2e\|end-to-end" "$PROJECT_ROOT/server" 2>/dev/null; then
        log_pass "End-to-end encryption implementation found"
        echo "- **PASS:** E2E encryption implemented" >> "$REPORT_FILE"
    else
        log_medium "No E2E encryption found"
        echo "- **MEDIUM:** No E2E encryption found" >> "$REPORT_FILE"
    fi
    
    echo "" >> "$REPORT_FILE"
}

# Check for common vulnerabilities
check_vulnerabilities() {
    log_info "Checking for common vulnerabilities..."
    echo "### Common Vulnerabilities" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # SQL Injection
    if grep -r -q "SELECT.*\+\|INSERT.*\+\|UPDATE.*\+\|DELETE.*\+" "$PROJECT_ROOT" 2>/dev/null; then
        log_high "Potential SQL injection vulnerability"
        echo "- **HIGH:** Potential SQL injection points found" >> "$REPORT_FILE"
    else
        log_pass "No obvious SQL injection vulnerabilities"
        echo "- **PASS:** No obvious SQL injection vulnerabilities" >> "$REPORT_FILE"
    fi
    
    # XSS
    if grep -r -q "innerHTML\|document.write\|eval(" "$PROJECT_ROOT/client" 2>/dev/null; then
        log_medium "Potential XSS vulnerability"
        echo "- **MEDIUM:** Potential XSS vulnerabilities found" >> "$REPORT_FILE"
    else
        log_pass "No obvious XSS vulnerabilities"
        echo "- **PASS:** No obvious XSS vulnerabilities" >> "$REPORT_FILE"
    fi
    
    echo "" >> "$REPORT_FILE"
}

# Generate summary
generate_summary() {
    echo "## Summary" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "- **Critical Issues:** $CRITICAL_COUNT" >> "$REPORT_FILE"
    echo "- **High Issues:** $HIGH_COUNT" >> "$REPORT_FILE"
    echo "- **Medium Issues:** $MEDIUM_COUNT" >> "$REPORT_FILE"
    echo "- **Low Issues:** $LOW_COUNT" >> "$REPORT_FILE"
    echo "- **Passed Checks:** $PASS_COUNT" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # Calculate score
    total_checks=$((CRITICAL_COUNT + HIGH_COUNT + MEDIUM_COUNT + LOW_COUNT + PASS_COUNT))
    if [ $total_checks -gt 0 ]; then
        score=$((PASS_COUNT * 100 / total_checks))
        echo "**Security Score:** $score/100" >> "$REPORT_FILE"
    fi
    
    echo "" >> "$REPORT_FILE"
    echo "## Recommendations" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    if [ $CRITICAL_COUNT -gt 0 ]; then
        echo "1. **Immediately address all critical issues**" >> "$REPORT_FILE"
    fi
    
    if [ $HIGH_COUNT -gt 0 ]; then
        echo "2. **Fix high-priority issues within 24 hours**" >> "$REPORT_FILE"
    fi
    
    if [ $MEDIUM_COUNT -gt 0 ]; then
        echo "3. **Plan to address medium issues in next sprint**" >> "$REPORT_FILE"
    fi
    
    echo "" >> "$REPORT_FILE"
    echo "---" >> "$REPORT_FILE"
    echo "*Generated by automated security audit script*" >> "$REPORT_FILE"
}

# Print results
print_results() {
    echo ""
    echo "========================================"
    echo -e "${GREEN}Security Audit Complete!${NC}"
    echo "========================================"
    echo ""
    echo "Results:"
    echo -e "  Critical Issues: ${RED}$CRITICAL_COUNT${NC}"
    echo -e "  High Issues: ${RED}$HIGH_COUNT${NC}"
    echo -e "  Medium Issues: ${YELLOW}$MEDIUM_COUNT${NC}"
    echo -e "  Low Issues: ${YELLOW}$LOW_COUNT${NC}"
    echo -e "  Passed Checks: ${GREEN}$PASS_COUNT${NC}"
    echo ""
    echo "Full report saved to: $REPORT_FILE"
    echo ""
    
    if [ $CRITICAL_COUNT -gt 0 ] || [ $HIGH_COUNT -gt 0 ]; then
        echo -e "${RED}ACTION REQUIRED: Critical or high-priority issues found!${NC}"
        exit 1
    fi
}

# Main execution
main() {
    echo "========================================"
    echo "Ivan Chat Security Audit"
    echo "========================================"
    echo ""
    
    init_report
    check_dependencies
    check_secrets
    check_ssl
    check_permissions
    check_headers
    check_authentication
    check_encryption
    check_vulnerabilities
    generate_summary
    print_results
}

# Run main
main