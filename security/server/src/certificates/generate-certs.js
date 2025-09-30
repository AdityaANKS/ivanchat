const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

class CertificateGenerator {
  constructor() {
    this.certsDir = path.join(__dirname, '../../../security/ssl');
    this.keysDir = path.join(__dirname, '../../../security/keys');
    this.ensureDirectories();
  }

  // Ensure certificate directories exist
  ensureDirectories() {
    const dirs = [this.certsDir, this.keysDir];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
  }

  // Generate self-signed SSL certificate for development
  generateSelfSignedCert(options = {}) {
    const {
      commonName = 'localhost',
      countryName = 'US',
      stateName = 'State',
      localityName = 'City',
      organizationName = 'DevChat',
      organizationalUnitName = 'Development',
      emailAddress = 'admin@localhost',
      days = 365,
      keySize = 4096
    } = options;

    const certPath = path.join(this.certsDir, 'server.crt');
    const keyPath = path.join(this.certsDir, 'server.key');
    const csrPath = path.join(this.certsDir, 'server.csr');

    try {
      console.log('Generating self-signed SSL certificate...');

      // Generate private key
      execSync(`openssl genrsa -out ${keyPath} ${keySize}`);
      console.log('✓ Private key generated');

      // Create certificate signing request
      const subj = `/C=${countryName}/ST=${stateName}/L=${localityName}/O=${organizationName}/OU=${organizationalUnitName}/CN=${commonName}/emailAddress=${emailAddress}`;
      execSync(`openssl req -new -key ${keyPath} -out ${csrPath} -subj "${subj}"`);
      console.log('✓ Certificate signing request created');

      // Generate self-signed certificate
      execSync(`openssl x509 -req -days ${days} -in ${csrPath} -signkey ${keyPath} -out ${certPath}`);
      console.log('✓ Self-signed certificate generated');

      // Set appropriate permissions
      fs.chmodSync(keyPath, '600');
      fs.chmodSync(certPath, '644');

      // Clean up CSR
      fs.unlinkSync(csrPath);

      return {
        success: true,
        certPath,
        keyPath,
        expiresIn: `${days} days`
      };
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  }

  // Generate certificate with Subject Alternative Names (SAN)
  generateCertWithSAN(options = {}) {
    const {
      domains = ['localhost', '127.0.0.1', '::1'],
      ...certOptions
    } = options;

    const configPath = path.join(this.certsDir, 'openssl.cnf');
    const certPath = path.join(this.certsDir, 'server-san.crt');
    const keyPath = path.join(this.certsDir, 'server-san.key');

    try {
      // Create OpenSSL config with SAN
      const config = this.createOpenSSLConfig(domains);
      fs.writeFileSync(configPath, config);

      console.log('Generating certificate with SAN...');

      // Generate private key
      execSync(`openssl genrsa -out ${keyPath} 4096`);

      // Generate certificate with SAN
      execSync(`openssl req -new -x509 -days 365 -key ${keyPath} -out ${certPath} -config ${configPath}`);

      // Clean up config
      fs.unlinkSync(configPath);

      console.log('✓ Certificate with SAN generated');

      return {
        success: true,
        certPath,
        keyPath,
        domains
      };
    } catch (error) {
      console.error('Error generating certificate with SAN:', error);
      throw error;
    }
  }

  // Create OpenSSL configuration
  createOpenSSLConfig(domains) {
    const altNames = domains.map((domain, index) => {
      if (this.isIP(domain)) {
        return `IP.${index + 1} = ${domain}`;
      }
      return `DNS.${index + 1} = ${domain}`;
    }).join('\n');

    return `
[req]
default_bits = 4096
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C = US
ST = State
L = City
O = SecureChat
OU = Development
CN = localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
${altNames}
`;
  }

  // Generate Diffie-Hellman parameters
  generateDHParams(bits = 2048) {
    const dhParamPath = path.join(this.certsDir, 'dhparam.pem');

    try {
      console.log(`Generating ${bits}-bit DH parameters (this may take a while)...`);
      
      execSync(`openssl dhparam -out ${dhParamPath} ${bits}`);
      
      console.log('✓ DH parameters generated');

      return {
        success: true,
        path: dhParamPath,
        bits
      };
    } catch (error) {
      console.error('Error generating DH parameters:', error);
      throw error;
    }
  }

  // Generate Let's Encrypt certificate (requires certbot)
  async generateLetsEncryptCert(options = {}) {
    const {
      domain,
      email,
      webroot = '/var/www/certbot',
      staging = false
    } = options;

    if (!domain || !email) {
      throw new Error('Domain and email are required for Let\'s Encrypt');
    }

    try {
      console.log('Generating Let\'s Encrypt certificate...');

      const stagingFlag = staging ? '--staging' : '';
      const command = `certbot certonly --webroot -w ${webroot} -d ${domain} --email ${email} --agree-tos --non-interactive ${stagingFlag}`;

      execSync(command);

      const certPath = `/etc/letsencrypt/live/${domain}/fullchain.pem`;
      const keyPath = `/etc/letsencrypt/live/${domain}/privkey.pem`;

      console.log('✓ Let\'s Encrypt certificate generated');

      return {
        success: true,
        certPath,
        keyPath,
        domain
      };
    } catch (error) {
      console.error('Error generating Let\'s Encrypt certificate:', error);
      throw error;
    }
  }

  // Generate client certificates for mutual TLS
  generateClientCert(clientId, options = {}) {
    const {
      days = 365,
      caKeyPath = path.join(this.certsDir, 'ca.key'),
      caCertPath = path.join(this.certsDir, 'ca.crt')
    } = options;

    const clientKeyPath = path.join(this.certsDir, `client-${clientId}.key`);
    const clientCertPath = path.join(this.certsDir, `client-${clientId}.crt`);
    const clientCsrPath = path.join(this.certsDir, `client-${clientId}.csr`);

    try {
      console.log(`Generating client certificate for ${clientId}...`);

      // Generate client private key
      execSync(`openssl genrsa -out ${clientKeyPath} 4096`);

      // Create client certificate signing request
      const subj = `/C=US/ST=State/L=City/O=SecureChat/CN=${clientId}`;
      execSync(`openssl req -new -key ${clientKeyPath} -out ${clientCsrPath} -subj "${subj}"`);

      // Sign client certificate with CA
      execSync(`openssl x509 -req -days ${days} -in ${clientCsrPath} -CA ${caCertPath} -CAkey ${caKeyPath} -CAcreateserial -out ${clientCertPath}`);

      // Clean up CSR
      fs.unlinkSync(clientCsrPath);

      console.log('✓ Client certificate generated');

      return {
        success: true,
        keyPath: clientKeyPath,
        certPath: clientCertPath,
        clientId
      };
    } catch (error) {
      console.error('Error generating client certificate:', error);
      throw error;
    }
  }

  // Generate Certificate Authority (CA)
  generateCA(options = {}) {
    const {
      commonName = 'SecureChat CA',
      days = 3650,
      keySize = 4096
    } = options;

    const caKeyPath = path.join(this.certsDir, 'ca.key');
    const caCertPath = path.join(this.certsDir, 'ca.crt');

    try {
      console.log('Generating Certificate Authority...');

      // Generate CA private key
      execSync(`openssl genrsa -out ${caKeyPath} ${keySize}`);

      // Generate CA certificate
      const subj = `/C=US/ST=State/L=City/O=SecureChat/CN=${commonName}`;
      execSync(`openssl req -new -x509 -days ${days} -key ${caKeyPath} -out ${caCertPath} -subj "${subj}"`);

      // Set appropriate permissions
      fs.chmodSync(caKeyPath, '600');

      console.log('✓ Certificate Authority generated');

      return {
        success: true,
        keyPath: caKeyPath,
        certPath: caCertPath
      };
    } catch (error) {
      console.error('Error generating CA:', error);
      throw error;
    }
  }

  // Verify certificate
  verifyCertificate(certPath, caPath = null) {
    try {
      let command = `openssl x509 -in ${certPath} -text -noout`;
      
      if (caPath) {
        command = `openssl verify -CAfile ${caPath} ${certPath}`;
      }

      const result = execSync(command, { encoding: 'utf8' });
      
      return {
        valid: true,
        details: result
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Get certificate information
  getCertificateInfo(certPath) {
    try {
      const cert = fs.readFileSync(certPath, 'utf8');
      
      // Get expiry date
      const expiryResult = execSync(
        `openssl x509 -in ${certPath} -noout -enddate`,
        { encoding: 'utf8' }
      );
      
      // Get subject
      const subjectResult = execSync(
        `openssl x509 -in ${certPath} -noout -subject`,
        { encoding: 'utf8' }
      );
      
      // Get issuer
      const issuerResult = execSync(
        `openssl x509 -in ${certPath} -noout -issuer`,
        { encoding: 'utf8' }
      );
      
      // Get fingerprint
      const fingerprintResult = execSync(
        `openssl x509 -in ${certPath} -noout -fingerprint -sha256`,
        { encoding: 'utf8' }
      );

      return {
        expiry: expiryResult.trim(),
        subject: subjectResult.trim(),
        issuer: issuerResult.trim(),
        fingerprint: fingerprintResult.trim(),
        path: certPath
      };
    } catch (error) {
      console.error('Error getting certificate info:', error);
      throw error;
    }
  }

  // Convert certificate formats
  convertCertFormat(inputPath, outputPath, fromFormat, toFormat) {
    try {
      let command;

      if (fromFormat === 'pem' && toFormat === 'der') {
        command = `openssl x509 -in ${inputPath} -outform der -out ${outputPath}`;
      } else if (fromFormat === 'der' && toFormat === 'pem') {
        command = `openssl x509 -in ${inputPath} -inform der -outform pem -out ${outputPath}`;
      } else if (fromFormat === 'pem' && toFormat === 'p12') {
        const keyPath = inputPath.replace('.crt', '.key');
        command = `openssl pkcs12 -export -out ${outputPath} -inkey ${keyPath} -in ${inputPath} -passout pass:changeit`;
      } else {
        throw new Error(`Unsupported conversion: ${fromFormat} to ${toFormat}`);
      }

      execSync(command);

      return {
        success: true,
        outputPath
      };
    } catch (error) {
      console.error('Error converting certificate format:', error);
      throw error;
    }
  }

  // Check if string is IP address
  isIP(str) {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
    
    return ipv4Regex.test(str) || ipv6Regex.test(str);
  }

  // Clean expired certificates
  cleanExpiredCerts() {
    const files = fs.readdirSync(this.certsDir);
    const cleaned = [];

    files.forEach(file => {
      if (file.endsWith('.crt') || file.endsWith('.pem')) {
        const certPath = path.join(this.certsDir, file);
        
        try {
          const result = execSync(
            `openssl x509 -in ${certPath} -noout -checkend 0`,
            { encoding: 'utf8' }
          );
          
          if (result.includes('will expire')) {
            fs.unlinkSync(certPath);
            cleaned.push(file);
          }
        } catch (error) {
          // Certificate has expired
          fs.unlinkSync(certPath);
          cleaned.push(file);
        }
      }
    });

    return {
      cleaned,
      count: cleaned.length
    };
  }
}

// Export singleton instance
module.exports = new CertificateGenerator();

// CLI interface
if (require.main === module) {
  const generator = new CertificateGenerator();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'self-signed':
      generator.generateSelfSignedCert();
      break;
    case 'san':
      const domains = args.slice(1);
      generator.generateCertWithSAN({ domains });
      break;
    case 'dhparam':
      const bits = args[1] || 2048;
      generator.generateDHParams(parseInt(bits));
      break;
    case 'ca':
      generator.generateCA();
      break;
    case 'client':
      const clientId = args[1] || 'client1';
      generator.generateClientCert(clientId);
      break;
    case 'clean':
      const result = generator.cleanExpiredCerts();
      console.log(`Cleaned ${result.count} expired certificates`);
      break;
    default:
      console.log(`
Certificate Generator Usage:
  node generate-certs.js self-signed     Generate self-signed certificate
  node generate-certs.js san [domains]   Generate certificate with SAN
  node generate-certs.js dhparam [bits]  Generate DH parameters
  node generate-certs.js ca              Generate Certificate Authority
  node generate-certs.js client [id]     Generate client certificate
  node generate-certs.js clean           Clean expired certificates
      `);
  }
}