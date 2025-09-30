const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const tls = require('tls');
const forge = require('node-forge');

class CertificateManager {
  constructor() {
    this.certsDir = path.join(__dirname, '../../../security/ssl');
    this.keysDir = path.join(__dirname, '../../../security/keys');
    this.certCache = new Map();
    this.certRotationInterval = null;
    this.readFile = promisify(fs.readFile);
    this.writeFile = promisify(fs.writeFile);
  }

  // Initialize certificate manager
  async initialize() {
    try {
      // Ensure directories exist
      this.ensureDirectories();
      
      // Load existing certificates
      await this.loadCertificates();
      
      // Set up certificate monitoring
      this.startCertificateMonitoring();
      
      // Set up auto-rotation if enabled
      if (process.env.AUTO_ROTATE_CERTS === 'true') {
        this.startCertificateRotation();
      }

      console.log('Certificate Manager initialized');
    } catch (error) {
      console.error('Failed to initialize Certificate Manager:', error);
      throw error;
    }
  }

  // Ensure required directories exist
  ensureDirectories() {
    [this.certsDir, this.keysDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Load certificates from disk
  async loadCertificates() {
    try {
      const certFiles = fs.readdirSync(this.certsDir)
        .filter(file => file.endsWith('.crt') || file.endsWith('.pem'));

      for (const file of certFiles) {
        const certPath = path.join(this.certsDir, file);
        const cert = await this.readFile(certPath, 'utf8');
        const certInfo = this.parseCertificate(cert);
        
        this.certCache.set(file, {
          path: certPath,
          content: cert,
          info: certInfo,
          loadedAt: new Date()
        });
      }

      console.log(`Loaded ${this.certCache.size} certificates`);
    } catch (error) {
      console.error('Error loading certificates:', error);
      throw error;
    }
  }

  // Parse certificate to extract information
  parseCertificate(certPem) {
    try {
      const cert = forge.pki.certificateFromPem(certPem);
      
      return {
        subject: this.formatDN(cert.subject),
        issuer: this.formatDN(cert.issuer),
        serialNumber: cert.serialNumber,
        notBefore: cert.validity.notBefore,
        notAfter: cert.validity.notAfter,
        fingerprint: forge.md.sha256.create()
          .update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes())
          .digest().toHex(),
        publicKey: {
          algorithm: cert.publicKey.algorithm,
          bits: cert.publicKey.n ? cert.publicKey.n.bitLength() : null
        },
        extensions: cert.extensions.map(ext => ({
          id: ext.id,
          name: ext.name,
          critical: ext.critical
        })),
        isExpired: new Date() > cert.validity.notAfter,
        daysUntilExpiry: Math.floor(
          (cert.validity.notAfter - new Date()) / (1000 * 60 * 60 * 24)
        )
      };
    } catch (error) {
      console.error('Error parsing certificate:', error);
      return null;
    }
  }

  // Format Distinguished Name
  formatDN(dn) {
    const attributes = {};
    dn.attributes.forEach(attr => {
      attributes[attr.shortName || attr.name] = attr.value;
    });
    return attributes;
  }

  // Get certificate by name
  getCertificate(name) {
    return this.certCache.get(name);
  }

  // Get all certificates
  getAllCertificates() {
    return Array.from(this.certCache.entries()).map(([name, cert]) => ({
      name,
      ...cert.info,
      path: cert.path
    }));
  }

  // Get expiring certificates
  getExpiringCertificates(days = 30) {
    return this.getAllCertificates().filter(cert => 
      cert.daysUntilExpiry >= 0 && cert.daysUntilExpiry <= days
    );
  }

  // Get expired certificates
  getExpiredCertificates() {
    return this.getAllCertificates().filter(cert => cert.isExpired);
  }

  // Validate certificate chain
  async validateCertificateChain(certPath, caPath) {
    try {
      const cert = await this.readFile(certPath, 'utf8');
      const ca = await this.readFile(caPath, 'utf8');
      
      const certObj = forge.pki.certificateFromPem(cert);
      const caObj = forge.pki.certificateFromPem(ca);
      
      // Create CA store
      const caStore = forge.pki.createCaStore([caObj]);
      
      // Verify certificate
      const verified = forge.pki.verifyCertificateChain(caStore, [certObj]);
      
      return {
        valid: verified,
        certificate: this.formatDN(certObj.subject),
        issuer: this.formatDN(certObj.issuer)
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Monitor certificates for expiry
  startCertificateMonitoring() {
    // Check certificates daily
    setInterval(() => {
      this.checkCertificateExpiry();
    }, 24 * 60 * 60 * 1000);

    // Initial check
    this.checkCertificateExpiry();
  }

  // Check certificate expiry
  async checkCertificateExpiry() {
    console.log('Checking certificate expiry...');
    
    const expiringCerts = this.getExpiringCertificates(30);
    const expiredCerts = this.getExpiredCertificates();
    
    if (expiringCerts.length > 0) {
      console.warn(`Warning: ${expiringCerts.length} certificates expiring within 30 days:`);
      expiringCerts.forEach(cert => {
        console.warn(`  - ${cert.name}: expires in ${cert.daysUntilExpiry} days`);
      });
      
      // Send notifications
      await this.notifyCertificateExpiry(expiringCerts);
    }
    
    if (expiredCerts.length > 0) {
      console.error(`Error: ${expiredCerts.length} certificates have expired:`);
      expiredCerts.forEach(cert => {
        console.error(`  - ${cert.name}`);
      });
    }
  }

  // Notify about certificate expiry
  async notifyCertificateExpiry(certificates) {
    // Implement notification logic (email, Slack, etc.)
    // This is a placeholder for notification implementation
    const notification = {
      type: 'CERTIFICATE_EXPIRY_WARNING',
      timestamp: new Date(),
      certificates: certificates.map(cert => ({
        name: cert.name,
        daysUntilExpiry: cert.daysUntilExpiry,
        expiryDate: cert.notAfter
      }))
    };
    
    // Log to audit service
    console.log('Certificate expiry notification:', notification);
  }

  // Start automatic certificate rotation
  startCertificateRotation() {
    // Rotate certificates weekly
    this.certRotationInterval = setInterval(() => {
      this.rotateCertificates();
    }, 7 * 24 * 60 * 60 * 1000);
    
    console.log('Certificate auto-rotation enabled');
  }

  // Stop certificate rotation
  stopCertificateRotation() {
    if (this.certRotationInterval) {
      clearInterval(this.certRotationInterval);
      this.certRotationInterval = null;
      console.log('Certificate auto-rotation disabled');
    }
  }

  // Rotate certificates
  async rotateCertificates() {
    console.log('Starting certificate rotation...');
    
    const expiringCerts = this.getExpiringCertificates(30);
    
    for (const cert of expiringCerts) {
      try {
        await this.renewCertificate(cert.name);
        console.log(`Rotated certificate: ${cert.name}`);
      } catch (error) {
        console.error(`Failed to rotate certificate ${cert.name}:`, error);
      }
    }
  }

  // Renew a certificate
  async renewCertificate(certName) {
    // This is a placeholder for certificate renewal
    // In production, this would integrate with Let's Encrypt or your CA
    console.log(`Renewing certificate: ${certName}`);
    
    // Backup old certificate
    const oldCert = this.getCertificate(certName);
    if (oldCert) {
      const backupPath = path.join(
        this.certsDir, 
        `backup-${certName}-${Date.now()}`
      );
      await this.writeFile(backupPath, oldCert.content);
    }
    
    // Generate new certificate (placeholder)
    // In production, request from CA
    
    // Reload certificates
    await this.loadCertificates();
  }

  // Create certificate bundle
  async createCertificateBundle(certPaths, outputPath) {
    try {
      const bundle = [];
      
      for (const certPath of certPaths) {
        const cert = await this.readFile(certPath, 'utf8');
        bundle.push(cert);
      }
      
      await this.writeFile(outputPath, bundle.join('\n'));
      
      return {
        success: true,
        path: outputPath,
        certificates: certPaths.length
      };
    } catch (error) {
      console.error('Error creating certificate bundle:', error);
      throw error;
    }
  }

  // Extract certificate from P12/PFX
  async extractFromP12(p12Path, password, outputDir) {
    try {
      const p12Der = await this.readFile(p12Path);
      const p12Asn1 = forge.asn1.fromDer(p12Der.toString('binary'));
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
      
      // Extract certificates
      const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const certs = [];
      
      for (const certBag of Object.values(certBags.certBag)) {
        const cert = certBag.cert;
        if (cert) {
          certs.push(forge.pki.certificateToPem(cert));
        }
      }
      
      // Extract private key
      const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
      let privateKey = null;
      
      for (const keyBag of Object.values(keyBags.pkcs8ShroudedKeyBag)) {
        if (keyBag.key) {
          privateKey = forge.pki.privateKeyToPem(keyBag.key);
          break;
        }
      }
      
      // Save extracted files
      const certPath = path.join(outputDir, 'cert.pem');
      const keyPath = path.join(outputDir, 'key.pem');
      
      await this.writeFile(certPath, certs.join('\n'));
      if (privateKey) {
        await this.writeFile(keyPath, privateKey);
      }
      
      return {
        success: true,
        certPath,
        keyPath,
        certificates: certs.length
      };
    } catch (error) {
      console.error('Error extracting from P12:', error);
      throw error;
    }
  }

  // Get TLS context for server
  getTLSContext(certName = 'server.crt', keyName = 'server.key') {
    const certPath = path.join(this.certsDir, certName);
    const keyPath = path.join(this.certsDir, keyName);
    
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      throw new Error('Certificate or key not found');
    }
    
    return tls.createSecureContext({
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
      ciphers: [
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES128-SHA256',
        'ECDHE-RSA-AES256-SHA384'
      ].join(':'),
      honorCipherOrder: true,
      minVersion: 'TLSv1.2'
    });
  }

  // Verify certificate for hostname
  verifyCertificateForHostname(cert, hostname) {
    try {
      const certObj = forge.pki.certificateFromPem(cert);
      
      // Check Common Name
      const cn = certObj.subject.getField('CN');
      if (cn && cn.value === hostname) {
        return { valid: true };
      }
      
      // Check Subject Alternative Names
      const altNames = certObj.getExtension('subjectAltName');
      if (altNames) {
        for (const altName of altNames.altNames) {
          if (altName.value === hostname) {
            return { valid: true };
          }
        }
      }
      
      return { valid: false, reason: 'Hostname mismatch' };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Generate certificate fingerprint
  generateFingerprint(cert, algorithm = 'sha256') {
    try {
      const certObj = forge.pki.certificateFromPem(cert);
      const der = forge.asn1.toDer(forge.pki.certificateToAsn1(certObj)).getBytes();
      
      let md;
      switch (algorithm) {
        case 'sha1':
          md = forge.md.sha1.create();
          break;
        case 'sha256':
          md = forge.md.sha256.create();
          break;
        case 'sha512':
          md = forge.md.sha512.create();
          break;
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
      
      md.update(der);
      return md.digest().toHex();
    } catch (error) {
      console.error('Error generating fingerprint:', error);
      throw error;
    }
  }

  // Clean up manager
  async cleanup() {
    this.stopCertificateRotation();
    this.certCache.clear();
    console.log('Certificate Manager cleaned up');
  }
}

// Export singleton instance
module.exports = new CertificateManager();