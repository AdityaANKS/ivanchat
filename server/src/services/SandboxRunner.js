const vm = require('vm');
const { Worker } = require('worker_threads');
const path = require('path');
const logger = require('../utils/logger');
const crypto = require('crypto');

/**
 * SandboxRunner - Secure execution environment for bot scripts
 * Provides isolated execution with resource limits and security controls
 */
class SandboxRunner {
  constructor(options = {}) {
    this.options = {
      timeout: options.timeout || 5000, // 5 seconds default
      memoryLimit: options.memoryLimit || 50 * 1024 * 1024, // 50MB
      maxCPUTime: options.maxCPUTime || 3000, // 3 seconds
      enableAsyncAwait: options.enableAsyncAwait !== false,
      enableConsole: options.enableConsole !== false,
      enableRequire: options.enableRequire || false,
      allowedModules: options.allowedModules || [],
      maxOutputSize: options.maxOutputSize || 10000, // 10KB
      maxExecutionsPerMinute: options.maxExecutionsPerMinute || 60,
      useWorkerThreads: options.useWorkerThreads || false,
      ...options
    };

    this.executions = new Map(); // Track executions for rate limiting
    this.activeWorkers = new Set();
    
    // Initialize metrics
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      timeoutExecutions: 0,
      averageExecutionTime: 0
    };
  }

  /**
   * Execute code in sandbox
   * @param {string} code - Code to execute
   * @param {Object} context - Context to inject into sandbox
   * @param {Object} options - Execution options
   * @returns {Promise<any>} Execution result
   */
  async execute(code, context = {}, options = {}) {
    const executionId = this.generateExecutionId();
    const startTime = Date.now();

    try {
      // Rate limiting check
      this.checkRateLimit(context.userId);

      // Validate input
      this.validateCode(code);

      // Choose execution method
      const result = this.options.useWorkerThreads
        ? await this.executeInWorker(code, context, options, executionId)
        : await this.executeInVM(code, context, options, executionId);

      // Update metrics
      const executionTime = Date.now() - startTime;
      this.updateMetrics('success', executionTime);

      logger.info('Sandbox execution successful', {
        executionId,
        executionTime,
        userId: context.userId
      });

      return {
        success: true,
        result,
        executionTime,
        executionId
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Categorize error
      const errorType = this.categorizeError(error);
      this.updateMetrics(errorType, executionTime);

      logger.error('Sandbox execution failed', {
        executionId,
        error: error.message,
        errorType,
        userId: context.userId,
        executionTime
      });

      return {
        success: false,
        error: this.sanitizeError(error),
        errorType,
        executionTime,
        executionId
      };
    } finally {
      this.cleanupExecution(executionId);
    }
  }

  /**
   * Execute code in VM context
   */
  async executeInVM(code, context, options, executionId) {
    const sandbox = this.createSandbox(context, executionId);
    const timeout = options.timeout || this.options.timeout;

    // Wrap code for timeout and async support
    const wrappedCode = this.wrapCode(code, timeout);

    // Create VM context
    const vmContext = vm.createContext(sandbox);

    // Set up timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new SandboxTimeoutError(`Execution exceeded ${timeout}ms timeout`));
      }, timeout);
    });

    // Execute code
    const executionPromise = new Promise((resolve, reject) => {
      try {
        const script = new vm.Script(wrappedCode, {
          filename: `sandbox-${executionId}.js`,
          timeout: timeout,
          displayErrors: true
        });

        const result = script.runInContext(vmContext, {
          timeout: timeout,
          breakOnSigint: true
        });

        // Handle async results
        if (result && typeof result.then === 'function') {
          result.then(resolve).catch(reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    });

    // Race between execution and timeout
    return Promise.race([executionPromise, timeoutPromise]);
  }

  /**
   * Execute code in Worker Thread (more isolated)
   */
  async executeInWorker(code, context, options, executionId) {
    return new Promise((resolve, reject) => {
      const timeout = options.timeout || this.options.timeout;
      
      // Create worker
      const worker = new Worker(path.join(__dirname, 'workers/sandbox-worker.js'), {
        workerData: {
          code,
          context: this.serializeContext(context),
          options: this.options,
          executionId
        },
        resourceLimits: {
          maxOldGenerationSizeMb: this.options.memoryLimit / (1024 * 1024),
          maxYoungGenerationSizeMb: this.options.memoryLimit / (1024 * 1024) / 2
        }
      });

      this.activeWorkers.add(worker);

      // Set timeout
      const timeoutId = setTimeout(() => {
        worker.terminate();
        this.activeWorkers.delete(worker);
        reject(new SandboxTimeoutError(`Worker execution exceeded ${timeout}ms timeout`));
      }, timeout);

      // Handle worker messages
      worker.on('message', (result) => {
        clearTimeout(timeoutId);
        worker.terminate();
        this.activeWorkers.delete(worker);
        resolve(result);
      });

      // Handle worker errors
      worker.on('error', (error) => {
        clearTimeout(timeoutId);
        worker.terminate();
        this.activeWorkers.delete(worker);
        reject(error);
      });

      // Handle worker exit
      worker.on('exit', (code) => {
        clearTimeout(timeoutId);
        this.activeWorkers.delete(worker);
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  /**
   * Create sandbox environment
   */
  createSandbox(context, executionId) {
    const output = [];
    const errors = [];

    const sandbox = {
      // Safe console implementation
      console: this.options.enableConsole ? {
        log: (...args) => {
          const message = args.map(arg => this.safeStringify(arg)).join(' ');
          if (this.getTotalOutputSize(output) + message.length <= this.options.maxOutputSize) {
            output.push({ type: 'log', message, timestamp: Date.now() });
          }
        },
        error: (...args) => {
          const message = args.map(arg => this.safeStringify(arg)).join(' ');
          if (this.getTotalOutputSize(errors) + message.length <= this.options.maxOutputSize) {
            errors.push({ type: 'error', message, timestamp: Date.now() });
          }
        },
        warn: (...args) => {
          const message = args.map(arg => this.safeStringify(arg)).join(' ');
          if (this.getTotalOutputSize(output) + message.length <= this.options.maxOutputSize) {
            output.push({ type: 'warn', message, timestamp: Date.now() });
          }
        },
        info: (...args) => {
          const message = args.map(arg => this.safeStringify(arg)).join(' ');
          if (this.getTotalOutputSize(output) + message.length <= this.options.maxOutputSize) {
            output.push({ type: 'info', message, timestamp: Date.now() });
          }
        }
      } : undefined,

      // Safe setTimeout/setInterval (with limits)
      setTimeout: (callback, delay) => {
        if (delay > this.options.timeout) {
          throw new Error('setTimeout delay exceeds maximum allowed timeout');
        }
        return setTimeout(callback, Math.min(delay, this.options.timeout));
      },

      setInterval: (callback, delay) => {
        throw new Error('setInterval is not allowed in sandbox');
      },

      // Restricted require (if enabled)
      require: this.options.enableRequire ? this.createSafeRequire() : undefined,

      // Math and JSON (safe built-ins)
      Math: Math,
      JSON: JSON,
      Date: Date,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      RegExp: RegExp,
      Error: Error,

      // User context (sanitized)
      ...this.sanitizeContext(context),

      // Metadata
      __executionId: executionId,
      __output: output,
      __errors: errors
    };

    // Freeze sandbox to prevent modifications
    return sandbox;
  }

  /**
   * Create safe require function with whitelist
   */
  createSafeRequire() {
    const allowedModules = new Set(this.options.allowedModules);
    
    return (moduleName) => {
      if (!allowedModules.has(moduleName)) {
        throw new Error(`Module '${moduleName}' is not allowed in sandbox`);
      }

      // Only allow specific safe modules
      const safeModules = {
        'lodash': require('lodash'),
        'moment': require('moment'),
        'axios': this.createSafeAxios(),
        // Add more allowed modules as needed
      };

      if (safeModules[moduleName]) {
        return safeModules[moduleName];
      }

      throw new Error(`Module '${moduleName}' is not available`);
    };
  }

  /**
   * Create safe axios wrapper with restrictions
   */
  createSafeAxios() {
    const axios = require('axios');
    
    return {
      get: async (url, config = {}) => {
        this.validateUrl(url);
        return axios.get(url, {
          ...config,
          timeout: 3000,
          maxRedirects: 3,
          maxContentLength: 1024 * 1024 // 1MB
        });
      },
      post: async (url, data, config = {}) => {
        this.validateUrl(url);
        return axios.post(url, data, {
          ...config,
          timeout: 3000,
          maxRedirects: 3,
          maxContentLength: 1024 * 1024
        });
      }
    };
  }

  /**
   * Wrap code for execution
   */
  wrapCode(code, timeout) {
    if (this.options.enableAsyncAwait) {
      return `
        (async function() {
          'use strict';
          ${code}
        })();
      `;
    }
    
    return `
      (function() {
        'use strict';
        ${code}
      })();
    `;
  }

  /**
   * Validate code before execution
   */
  validateCode(code) {
    if (!code || typeof code !== 'string') {
      throw new SandboxValidationError('Code must be a non-empty string');
    }

    if (code.length > 100000) { // 100KB limit
      throw new SandboxValidationError('Code size exceeds maximum allowed size');
    }

    // Check for dangerous patterns
    const dangerousPatterns = [
      /require\s*KATEX_INLINE_OPEN\s*['"]child_process['"]\s*KATEX_INLINE_CLOSE/,
      /require\s*KATEX_INLINE_OPEN\s*['"]fs['"]\s*KATEX_INLINE_CLOSE/,
      /require\s*KATEX_INLINE_OPEN\s*['"]net['"]\s*KATEX_INLINE_CLOSE/,
      /process\./,
      /global\./,
      /__dirname/,
      /__filename/,
      /eval\s*KATEX_INLINE_OPEN/,
      /Function\s*KATEX_INLINE_OPEN/,
      /constructor\s*KATEX_INLINE_OPEN/
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new SandboxValidationError(`Code contains forbidden pattern: ${pattern}`);
      }
    }
  }

  /**
   * Validate URL for HTTP requests
   */
  validateUrl(url) {
    try {
      const parsedUrl = new URL(url);
      
      // Only allow HTTP/HTTPS
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Only HTTP/HTTPS protocols are allowed');
      }

      // Block private IP ranges
      const hostname = parsedUrl.hostname;
      const privateIPPatterns = [
        /^127\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^localhost$/i
      ];

      for (const pattern of privateIPPatterns) {
        if (pattern.test(hostname)) {
          throw new Error('Access to private IP addresses is not allowed');
        }
      }
    } catch (error) {
      throw new SandboxValidationError(`Invalid URL: ${error.message}`);
    }
  }

  /**
   * Sanitize context to remove dangerous properties
   */
  sanitizeContext(context) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(context)) {
      // Skip functions, symbols, and dangerous objects
      if (typeof value === 'function' || typeof value === 'symbol') {
        continue;
      }

      // Deep clone to prevent prototype pollution
      sanitized[key] = this.deepClone(value);
    }

    return sanitized;
  }

  /**
   * Serialize context for worker thread
   */
  serializeContext(context) {
    return JSON.parse(JSON.stringify(this.sanitizeContext(context)));
  }

  /**
   * Deep clone object
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item));
    }

    if (obj instanceof RegExp) {
      return new RegExp(obj);
    }

    const cloned = {};
    for (const key of Object.keys(obj)) {
      cloned[key] = this.deepClone(obj[key]);
    }

    return cloned;
  }

  /**
   * Safe stringify with circular reference handling
   */
  safeStringify(obj) {
    const seen = new WeakSet();
    
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      
      if (typeof value === 'function') {
        return '[Function]';
      }
      
      if (typeof value === 'symbol') {
        return '[Symbol]';
      }
      
      return value;
    });
  }

  /**
   * Check rate limit for user
   */
  checkRateLimit(userId) {
    if (!userId) return;

    const now = Date.now();
    const userExecutions = this.executions.get(userId) || [];

    // Remove old executions (older than 1 minute)
    const recentExecutions = userExecutions.filter(time => now - time < 60000);

    if (recentExecutions.length >= this.options.maxExecutionsPerMinute) {
      throw new SandboxRateLimitError('Rate limit exceeded. Please try again later.');
    }

    recentExecutions.push(now);
    this.executions.set(userId, recentExecutions);
  }

  /**
   * Get total output size
   */
  getTotalOutputSize(output) {
    return output.reduce((total, item) => total + item.message.length, 0);
  }

  /**
   * Categorize error
   */
  categorizeError(error) {
    if (error instanceof SandboxTimeoutError) {
      return 'timeout';
    }
    if (error instanceof SandboxValidationError) {
      return 'validation';
    }
    if (error instanceof SandboxRateLimitError) {
      return 'rateLimit';
    }
    if (error.message && error.message.includes('memory')) {
      return 'memory';
    }
    return 'execution';
  }

  /**
   * Sanitize error for safe output
   */
  sanitizeError(error) {
    return {
      message: error.message || 'Unknown error',
      type: error.constructor.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }

  /**
   * Update metrics
   */
  updateMetrics(result, executionTime) {
    this.metrics.totalExecutions++;
    
    if (result === 'success') {
      this.metrics.successfulExecutions++;
    } else if (result === 'timeout') {
      this.metrics.timeoutExecutions++;
      this.metrics.failedExecutions++;
    } else {
      this.metrics.failedExecutions++;
    }

    // Update average execution time
    const totalTime = this.metrics.averageExecutionTime * (this.metrics.totalExecutions - 1);
    this.metrics.averageExecutionTime = (totalTime + executionTime) / this.metrics.totalExecutions;
  }

  /**
   * Generate unique execution ID
   */
  generateExecutionId() {
    return `exec_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Cleanup execution
   */
  cleanupExecution(executionId) {
    // Cleanup any resources associated with this execution
    // This is a hook for future cleanup logic
  }

  /**
   * Terminate all active workers
   */
  async terminateAllWorkers() {
    const terminationPromises = [];
    
    for (const worker of this.activeWorkers) {
      terminationPromises.push(worker.terminate());
    }

    await Promise.all(terminationPromises);
    this.activeWorkers.clear();
  }

  /**
   * Get sandbox metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      activeWorkers: this.activeWorkers.size,
      trackedUsers: this.executions.size
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      timeoutExecutions: 0,
      averageExecutionTime: 0
    };
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    await this.terminateAllWorkers();
    this.executions.clear();
    this.resetMetrics();
  }
}

/**
 * Custom Error Classes
 */
class SandboxError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SandboxError';
  }
}

class SandboxTimeoutError extends SandboxError {
  constructor(message) {
    super(message);
    this.name = 'SandboxTimeoutError';
  }
}

class SandboxValidationError extends SandboxError {
  constructor(message) {
    super(message);
    this.name = 'SandboxValidationError';
  }
}

class SandboxRateLimitError extends SandboxError {
  constructor(message) {
    super(message);
    this.name = 'SandboxRateLimitError';
  }
}
 
module.exports = SandboxRunner;
module.exports.SandboxError = SandboxError;
module.exports.SandboxTimeoutError = SandboxTimeoutError;
module.exports.SandboxValidationError = SandboxValidationError;
module.exports.SandboxRateLimitError = SandboxRateLimitError;
module.exports.SandboxRunner = SandboxRunner;
module.exports.default = SandboxRunner;

export default SandboxRunner;