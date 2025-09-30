const crypto = require('crypto');
const { EventEmitter } = require('events');

class AuditService extends EventEmitter {
  constructor(config, database) {
    super();
    this.config = config;
    this.db = database;
    this.queue = [];
    this.processing = false;
  }

  async logEvent(event) {
    const auditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventType: event.type,
      severity: event.severity || 'info',
      userId: event.userId,
      sessionId: event.sessionId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      resource: event.resource,
      action: event.action,
      result: event.result,
      metadata: event.metadata || {},
      hash: null
    };

    // Create integrity hash
    auditEntry.hash = this.createHash(auditEntry);

    // Add to queue
    this.queue.push(auditEntry);
    
    // Emit event for real-time monitoring
    this.emit('audit', auditEntry);

    // Process queue
    if (!this.processing) {
      this.processQueue();
    }

    return auditEntry.id;
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const batch = this.queue.splice(0, 100); // Process in batches

    try {
      await this.db.collection('audit_logs').insertMany(batch);
      
      // Check for critical events
      batch.forEach(entry => {
        if (entry.severity === 'critical') {
          this.handleCriticalEvent(entry);
        }
      });
    } catch (error) {
      console.error('Failed to write audit logs:', error);
      // Re-queue failed entries
      this.queue.unshift(...batch);
    }

    // Continue processing
    setTimeout(() => this.processQueue(), 1000);
  }

  createHash(entry) {
    const data = JSON.stringify({
      timestamp: entry.timestamp,
      eventType: entry.eventType,
      userId: entry.userId,
      action: entry.action,
      result: entry.result
    });
    
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async verifyIntegrity(entryId) {
    const entry = await this.db.collection('audit_logs').findOne({ id: entryId });
    
    if (!entry) {
      return { valid: false, error: 'Entry not found' };
    }

    const calculatedHash = this.createHash(entry);
    const valid = calculatedHash === entry.hash;

    return {
      valid,
      error: valid ? null : 'Integrity check failed'
    };
  }

  async queryLogs(filters) {
    const query = {};
    
    if (filters.userId) query.userId = filters.userId;
    if (filters.eventType) query.eventType = filters.eventType;
    if (filters.severity) query.severity = filters.severity;
    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
      if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
    }

    const logs = await this.db.collection('audit_logs')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(filters.limit || 100)
      .toArray();

    return logs;
  }

  async generateReport(startDate, endDate, options = {}) {
    const logs = await this.queryLogs({ startDate, endDate });
    
    const report = {
      period: { start: startDate, end: endDate },
      totalEvents: logs.length,
      eventTypes: {},
      severityBreakdown: {},
      topUsers: {},
      suspiciousActivities: [],
      generated: new Date()
    };

    logs.forEach(log => {
      // Event type statistics
      report.eventTypes[log.eventType] = (report.eventTypes[log.eventType] || 0) + 1;
      
      // Severity breakdown
      report.severityBreakdown[log.severity] = (report.severityBreakdown[log.severity] || 0) + 1;
      
      // Top users
      if (log.userId) {
        report.topUsers[log.userId] = (report.topUsers[log.userId] || 0) + 1;
      }
      
      // Detect suspicious activities
      if (this.isSuspicious(log)) {
        report.suspiciousActivities.push(log);
      }
    });

    // Sort top users
    report.topUsers = Object.entries(report.topUsers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

    return report;
  }

  isSuspicious(log) {
    const suspiciousPatterns = [
      { type: 'auth.failed', threshold: 5 },
      { type: 'permission.denied', threshold: 10 },
      { type: 'data.export', threshold: 100 },
      { type: 'admin.action', severity: 'warning' }
    ];

    return suspiciousPatterns.some(pattern => 
      log.eventType === pattern.type && 
      (pattern.severity ? log.severity === pattern.severity : true)
    );
  }

  handleCriticalEvent(event) {
    // Send alerts for critical events
    this.emit('critical', event);
    
    // Log to separate critical events store
    this.db.collection('critical_events').insertOne({
      ...event,
      handled: false,
      handledAt: null
    });
    
    // Trigger notifications
    if (this.config.notifications?.enabled) {
      this.sendNotification(event);
    }
  }

  async sendNotification(event) {
    // Implementation depends on notification service
    console.error('CRITICAL SECURITY EVENT:', event);
  }

  async cleanup() {
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - this.config.audit.retention);

    const result = await this.db.collection('audit_logs').deleteMany({
      timestamp: { $lt: retentionDate }
    });

    return {
      deleted: result.deletedCount,
      retentionDate
    };
  }
}

module.exports = AuditService;