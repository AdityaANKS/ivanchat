const vm = require('vm');
const { Worker } = require('worker_threads');
const Docker = require('dockerode');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { EventEmitter } = require('events');
const Redis = require('ioredis');
const sanitize = require('sanitize-filename');

// Initialize Docker and Redis
const docker = new Docker();
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  keyPrefix: 'sandbox:'
});

// Sandbox configuration
const SANDBOX_CONFIG = {
  maxExecutionTime: 5000, // 5 seconds
  maxMemory: 50 * 1024 * 1024, // 50MB
  maxOutputSize: 1024 * 1024, // 1MB
  allowedModules: [
    'lodash',
    'moment',
    'axios',
    'cheerio',
    'mathjs'
  ],
  blockedAPIs: [
    'process',
    'child_process',
    'fs',
    'net',
    'http',
    'https',
    'cluster',
    'os',
    'v8',
    'vm'
  ]
};

class SandboxRunner extends EventEmitter {
  constructor() {
    super();
    this.sandboxes = new Map();
    this.workers = new Map();
    this.dockerContainers = new Map();
    this.executionQueue = [];
    this.isProcessing = false;
    
    this.initializeSandbox();
  }

  async initializeSandbox() {
    // Create sandbox directory
    this.sandboxDir = path.join(process.cwd(), 'sandbox');
    await fs.mkdir(this.sandboxDir, { recursive: true });
    
    // Pull sandbox Docker image if configured
    if (process.env.USE_DOCKER_SANDBOX === 'true') {
      await this.initializeDockerSandbox();
    }
    
    // Start queue processor
    this.startQueueProcessor();
    
    console.log('Sandbox Runner initialized');
  }

  // ========================
  // Code Execution
  // ========================

  /**
   * Execute user code in sandbox
   */
  async execute(code, context = {}, options = {}) {
    const executionId = crypto.randomBytes(16).toString('hex');
    
    try {
      // Validate code
      this.validateCode(code);
      
      // Add to execution queue
      const execution = {
        id: executionId,
        code,
        context,
        options: { ...SANDBOX_CONFIG, ...options },
        timestamp: Date.now()
      };
      
      return await this.queueExecution(execution);
    } catch (error) {
      this.emit('execution:error', {
        executionId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Queue code execution
   */
  async queueExecution(execution) {
    return new Promise((resolve, reject) => {
      execution.callback = { resolve, reject };
      this.executionQueue.push(execution);
      
      // Store in Redis for tracking
      redisClient.setex(
        `execution:${execution.id}`,
        300,
        JSON.stringify({
          status: 'queued',
          timestamp: execution.timestamp
        })
      );
      
      // Process queue if not already processing
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process execution queue
   */
  async processQueue() {
    if (this.executionQueue.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    const execution = this.executionQueue.shift();
    
    try {
      const result = await this.runInSandbox(execution);
      execution.callback.resolve(result);
    } catch (error) {
      execution.callback.reject(error);
    }
    
    // Process next item
    setImmediate(() => this.processQueue());
  }

  /**
   * Run code in appropriate sandbox
   */
  async runInSandbox(execution) {
    const { code, context, options, id } = execution;
    
    // Update status
    await redisClient.setex(
      `execution:${id}`,
      300,
      JSON.stringify({
        status: 'running',
        startTime: Date.now()
      })
    );
    
    let result;
    
    // Choose sandbox type based on configuration
    if (process.env.USE_DOCKER_SANDBOX === 'true') {
      result = await this.runInDocker(code, context, options, id);
    } else if (options.useWorker) {
      result = await this.runInWorker(code, context, options, id);
    } else {
      result = await this.runInVM(code, context, options, id);
    }
    
    // Store result
    await redisClient.setex(
      `execution:${id}:result`,
      3600,
      JSON.stringify(result)
    );
    
    // Emit execution complete event
    this.emit('execution:complete', {
      executionId: id,
      result,
      duration: Date.now() - execution.timestamp
    });
    
    return result;
  }

  // ========================
  // VM Sandbox
  // ========================

  /**
   * Run code in Node.js VM
   */
  async runInVM(code, context, options, executionId) {
    const startTime = Date.now();
    const timeout = options.maxExecutionTime;
    
    // Create sandbox context
    const sandbox = this.createVMSandbox(context);
    
    // Wrap code in async function
    const wrappedCode = `
      (async () => {
        const __startTime = Date.now();
        const __maxTime = ${timeout};
        const __checkTimeout = () => {
          if (Date.now() - __startTime > __maxTime) {
            throw new Error('Execution timeout');
          }
        };
        
        // User code
        ${this.instrumentCode(code)}
      })()
    `;
    
    // Create VM context
    const vmContext = vm.createContext(sandbox);
    
    // Compile script
    const script = new vm.Script(wrappedCode, {
      filename: `sandbox-${executionId}.js`,
      timeout,
      displayErrors: true
    });
    
    try {
      // Execute with timeout
      const result = await Promise.race([
        script.runInContext(vmContext, {
          timeout,
          breakOnSigint: true
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Execution timeout')), timeout)
        )
      ]);
      
      return {
        success: true,
        result: this.sanitizeOutput(result),
        executionTime: Date.now() - startTime,
        memoryUsed: process.memoryUsage().heapUsed
      };
    } catch (error) {
      return {
        success: false,
        error: this.sanitizeError(error),
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Create VM sandbox context
   */
  createVMSandbox(userContext = {}) {
    const sandbox = {
      console: this.createSafeConsole(),
      Math: Math,
      Date: Date,
      JSON: JSON,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      RegExp: RegExp,
      Promise: Promise,
      setTimeout: undefined, // Disabled
      setInterval: undefined, // Disabled
      setImmediate: undefined, // Disabled
      require: this.createSafeRequire(),
      
      // Custom APIs
      bot: this.createBotAPI(),
      storage: this.createStorageAPI(),
      http: this.createHTTPAPI(),
      
      // User context
      ...this.sanitizeContext(userContext)
    };
    
    // Freeze prototypes to prevent tampering
    Object.freeze(sandbox.Object.prototype);
    Object.freeze(sandbox.Array.prototype);
    Object.freeze(sandbox.Function.prototype);
    
    return sandbox;
  }

  // ========================
  // Worker Thread Sandbox
  // ========================

  /**
   * Run code in Worker Thread
   */
  async runInWorker(code, context, options, executionId) {
    const workerPath = path.join(__dirname, 'sandbox-worker.js');
    
    // Create worker
    const worker = new Worker(workerPath, {
      workerData: {
        code,
        context,
        options,
        executionId
      },
      resourceLimits: {
        maxOldGenerationSizeMb: options.maxMemory / (1024 * 1024),
        maxYoungGenerationSizeMb: options.maxMemory / (1024 * 1024) / 2
      }
    });
    
    // Store worker reference
    this.workers.set(executionId, worker);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        worker.terminate();
        this.workers.delete(executionId);
        reject(new Error('Worker execution timeout'));
      }, options.maxExecutionTime);
      
      worker.on('message', (result) => {
        clearTimeout(timeout);
        this.workers.delete(executionId);
        resolve(result);
      });
      
      worker.on('error', (error) => {
        clearTimeout(timeout);
        this.workers.delete(executionId);
        reject(error);
      });
      
      worker.on('exit', (code) => {
        clearTimeout(timeout);
        this.workers.delete(executionId);
        if (code !== 0) {
          reject(new Error(`Worker exited with code ${code}`));
        }
      });
    });
  }

  // ========================
  // Docker Sandbox
  // ========================

  /**
   * Initialize Docker sandbox environment
   */
  async initializeDockerSandbox() {
    try {
      // Build or pull sandbox image
      const imageName = 'ivan-sandbox:latest';
      
      // Check if image exists
      const images = await docker.listImages();
      const imageExists = images.some(img => 
        img.RepoTags && img.RepoTags.includes(imageName)
      );
      
      if (!imageExists) {
        console.log('Building Docker sandbox image...');
        await this.buildDockerImage();
      }
      
      this.dockerImageReady = true;
    } catch (error) {
      console.error('Failed to initialize Docker sandbox:', error);
      this.dockerImageReady = false;
    }
  }

  /**
   * Build Docker sandbox image
   */
  async buildDockerImage() {
    const dockerfilePath = path.join(__dirname, 'Dockerfile.sandbox');
    
    const dockerfileContent = `
FROM node:16-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /sandbox
RUN npm install lodash moment axios cheerio mathjs
RUN adduser -D -s /bin/sh sandbox
USER sandbox
CMD ["node", "sandbox.js"]
    `;
    
    await fs.writeFile(dockerfilePath, dockerfileContent);
    
    const stream = await docker.buildImage({
      context: __dirname,
      src: ['Dockerfile.sandbox']
    }, {
      t: 'ivan-sandbox:latest'
    });
    
    return new Promise((resolve, reject) => {
      docker.modem.followProgress(stream, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  /**
   * Run code in Docker container
   */
  async runInDocker(code, context, options, executionId) {
    if (!this.dockerImageReady) {
      throw new Error('Docker sandbox not available');
    }
    
    const startTime = Date.now();
    
    // Create container
    const container = await docker.createContainer({
      Image: 'ivan-sandbox:latest',
      Cmd: ['node', '-e', code],
      WorkingDir: '/sandbox',
      AttachStdout: true,
      AttachStderr: true,
      NetworkMode: 'none', // No network access
      HostConfig: {
        Memory: options.maxMemory,
        CpuQuota: 50000, // 50% CPU
        AutoRemove: true,
        ReadonlyRootfs: true,
        SecurityOpt: ['no-new-privileges'],
        CapDrop: ['ALL']
      },
      Env: Object.entries(context).map(([k, v]) => `${k}=${v}`)
    });
    
    this.dockerContainers.set(executionId, container);
    
    try {
      // Start container
      const stream = await container.attach({ stream: true, stdout: true, stderr: true });
      await container.start();
      
      // Collect output
      let output = '';
      let error = '';
      
      stream.on('data', (chunk) => {
        const data = chunk.toString();
        if (data.length + output.length > options.maxOutputSize) {
          container.kill();
          throw new Error('Output size limit exceeded');
        }
        output += data;
      });
      
      // Wait for completion or timeout
      const result = await Promise.race([
        container.wait(),
        new Promise((_, reject) => 
          setTimeout(() => {
            container.kill();
            reject(new Error('Execution timeout'));
          }, options.maxExecutionTime)
        )
      ]);
      
      this.dockerContainers.delete(executionId);
      
      return {
        success: result.StatusCode === 0,
        result: output,
        error: result.StatusCode !== 0 ? error : undefined,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      // Clean up container
      try {
        await container.kill();
        await container.remove();
      } catch (e) {
        // Container may already be removed
      }
      
      this.dockerContainers.delete(executionId);
      
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }

  // ========================
  // Code Analysis & Security
  // ========================

  /**
   * Validate code before execution
   */
  validateCode(code) {
    // Check for blocked keywords
    const blockedPatterns = [
      /eval\s*KATEX_INLINE_OPEN/gi,
      /Function\s*KATEX_INLINE_OPEN/gi,
      /require\s*KATEX_INLINE_OPEN\s*['"]child_process['"]\s*KATEX_INLINE_CLOSE/gi,
      /require\s*KATEX_INLINE_OPEN\s*['"]fs['"]\s*KATEX_INLINE_CLOSE/gi,
      /process\.\w+/gi,
      /global\.\w+/gi,
      /__proto__/gi,
      /constructor\.\w+/gi
    ];
    
    for (const pattern of blockedPatterns) {
      if (pattern.test(code)) {
        throw new Error(`Blocked pattern detected: ${pattern}`);
      }
    }
    
    // Check code length
    if (code.length > 10000) {
      throw new Error('Code exceeds maximum length');
    }
    
    // Basic syntax check
    try {
      new Function(code);
    } catch (error) {
      throw new Error(`Syntax error: ${error.message}`);
    }
  }

  /**
   * Instrument code for monitoring
   */
  instrumentCode(code) {
    // Add timeout checks to loops
    code = code.replace(/while\s*KATEX_INLINE_OPEN/g, 'while (__checkTimeout(), ');
    code = code.replace(/for\s*KATEX_INLINE_OPEN/g, 'for (__checkTimeout(); ');
    
    // Add memory checks
    const memoryCheck = `
      if (process.memoryUsage().heapUsed > ${SANDBOX_CONFIG.maxMemory}) {
        throw new Error('Memory limit exceeded');
      }
    `;
    
    // Insert memory checks after function declarations
    code = code.replace(/function\s+\w+\s*KATEX_INLINE_OPEN[^)]*KATEX_INLINE_CLOSE\s*{/g, (match) => 
      match + memoryCheck
    );
    
    return code;
  }

  // ========================
  // Safe APIs
  // ========================

  /**
   * Create safe console object
   */
  createSafeConsole() {
    const logs = [];
    const maxLogs = 100;
    
    const safeLog = (level) => (...args) => {
      if (logs.length >= maxLogs) {
        logs.shift();
      }
      
      const message = args.map(arg => {
        try {
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        } catch (e) {
          return '[Object]';
        }
      }).join(' ');
      
      logs.push({
        level,
        message: message.substring(0, 1000),
        timestamp: Date.now()
      });
      
      return message;
    };
    
    return {
      log: safeLog('log'),
      info: safeLog('info'),
      warn: safeLog('warn'),
      error: safeLog('error'),
      debug: safeLog('debug'),
      getLogs: () => [...logs]
    };
  }

  /**
   * Create safe require function
   */
  createSafeRequire() {
    const allowedModules = {
      lodash: require('lodash'),
      moment: require('moment'),
      mathjs: require('mathjs')
    };
    
    return (moduleName) => {
      if (!SANDBOX_CONFIG.allowedModules.includes(moduleName)) {
        throw new Error(`Module '${moduleName}' is not allowed`);
      }
      
      return allowedModules[moduleName];
    };
  }

  /**
   * Create bot API for sandbox
   */
  createBotAPI() {
    return {
      sendMessage: async (channelId, content) => {
        // Validate and queue message
        if (!channelId || !content) {
          throw new Error('Invalid message parameters');
        }
        
        await redisClient.lpush('bot:messages:queue', JSON.stringify({
          channelId,
          content: String(content).substring(0, 2000),
          timestamp: Date.now()
        }));
        
        return { queued: true };
      },
      
      getData: async (key) => {
        // Safe data retrieval
        const safeKey = sanitize(key);
        return await redisClient.get(`bot:data:${safeKey}`);
      },
      
      setData: async (key, value) => {
        // Safe data storage
        const safeKey = sanitize(key);
        const safeValue = JSON.stringify(value);
        
        if (safeValue.length > 10000) {
          throw new Error('Data too large');
        }
        
        await redisClient.setex(
          `bot:data:${safeKey}`,
          86400, // 24 hours
          safeValue
        );
        
        return { stored: true };
      },
      
      schedule: async (cronExpression, taskId) => {
        // Schedule task (validated externally)
        return { scheduled: false, reason: 'Not implemented in sandbox' };
      }
    };
  }

  /**
   * Create storage API for sandbox
   */
  createStorageAPI() {
    return {
      get: async (key) => {
        const safeKey = sanitize(key);
        const value = await redisClient.get(`sandbox:storage:${safeKey}`);
        return value ? JSON.parse(value) : null;
      },
      
      set: async (key, value, ttl = 3600) => {
        const safeKey = sanitize(key);
        const safeValue = JSON.stringify(value);
        
        if (safeValue.length > 1000) {
          throw new Error('Value too large for storage');
        }
        
        await redisClient.setex(
          `sandbox:storage:${safeKey}`,
          Math.min(ttl, 86400),
          safeValue
        );
        
        return true;
      },
      
      delete: async (key) => {
        const safeKey = sanitize(key);
        await redisClient.del(`sandbox:storage:${safeKey}`);
        return true;
      },
      
      list: async (pattern = '*') => {
        const safePattern = sanitize(pattern);
        const keys = await redisClient.keys(`sandbox:storage:${safePattern}`);
        return keys.map(k => k.replace('sandbox:storage:', ''));
      }
    };
  }

  /**
   * Create HTTP API for sandbox
   */
  createHTTPAPI() {
    const axios = require('axios');
    const allowedDomains = [
      'api.github.com',
      'api.weather.com',
      'jsonplaceholder.typicode.com'
    ];
    
    return {
      get: async (url, options = {}) => {
        const urlObj = new URL(url);
        
        if (!allowedDomains.includes(urlObj.hostname)) {
          throw new Error(`Domain ${urlObj.hostname} is not allowed`);
        }
        
        const response = await axios.get(url, {
          timeout: 5000,
          maxRedirects: 2,
          ...options
        });
        
        return response.data;
      }
    };
  }

  // ========================
  // Utility Methods
  // ========================

  /**
   * Sanitize user context
   */
  sanitizeContext(context) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(context)) {
      // Only allow primitive types and simple objects
      if (typeof value === 'string' || 
          typeof value === 'number' || 
          typeof value === 'boolean' ||
          (typeof value === 'object' && value !== null && !Array.isArray(value))) {
        sanitized[sanitize(key)] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * Sanitize output
   */
  sanitizeOutput(output) {
    if (output === undefined) return undefined;
    if (output === null) return null;
    
    // Limit output size
    const str = typeof output === 'string' ? output : JSON.stringify(output);
    if (str.length > SANDBOX_CONFIG.maxOutputSize) {
      return str.substring(0, SANDBOX_CONFIG.maxOutputSize) + '... (truncated)';
    }
    
    return output;
  }

  /**
   * Sanitize error messages
   */
  sanitizeError(error) {
    return {
      message: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }

  // ========================
  // Cleanup & Management
  // ========================

  /**
   * Clean up resources
   */
  async cleanup() {
    // Terminate all workers
    for (const [id, worker] of this.workers) {
      worker.terminate();
    }
    this.workers.clear();
    
    // Stop all Docker containers
    for (const [id, container] of this.dockerContainers) {
      try {
        await container.kill();
        await container.remove();
      } catch (e) {
        // Container may already be removed
      }
    }
    this.dockerContainers.clear();
    
    // Clear execution queue
    this.executionQueue = [];
  }

  /**
   * Get execution status
   */
  async getExecutionStatus(executionId) {
    const status = await redisClient.get(`execution:${executionId}`);
    const result = await redisClient.get(`execution:${executionId}:result`);
    
    return {
      status: status ? JSON.parse(status) : null,
      result: result ? JSON.parse(result) : null
    };
  }

  /**
   * Start queue processor
   */
  startQueueProcessor() {
    setInterval(() => {
      if (!this.isProcessing && this.executionQueue.length > 0) {
        this.processQueue();
      }
    }, 100);
  }
}

// Create singleton instance
const sandboxRunner = new SandboxRunner();

module.exports = sandboxRunner;