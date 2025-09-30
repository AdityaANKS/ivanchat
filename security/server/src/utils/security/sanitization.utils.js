// D:\ivan\utils\SanitizationUtils.js
import validator from 'validator';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

class SanitizationUtils {
  constructor() {
    // Create DOMPurify instance for server-side sanitization
    const window = new JSDOM('').window;
    this.DOMPurify = createDOMPurify(window);

    // Default DOMPurify config (adjustable via sanitizeHTML options)
    this.domPurifyConfig = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false,
      SAFE_FOR_TEMPLATES: true
    };

    // Basic text-based protections
    this.sensitiveFields = new Set([
      'password','passwd','pwd','pass',
      'token','accesstoken','refreshtoken',
      'secret','apisecret','secretkey',
      'apikey','api_key','apitoken',
      'creditcard','cc','cardnumber','cvv','cvc',
      'ssn','socialsecurity','privatekey','private_key',
      'authorization','auth','cookie','session','sessionid'
    ]);
  }

  // ---------- HTML ----------
  sanitizeHTML(html, options = {}) {
    if (!html && html !== 0) return '';
    try {
      const config = { ...this.domPurifyConfig, ...options };
      return this.DOMPurify.sanitize(String(html), config);
    } catch (err) {
      console.error('HTML sanitization error:', err);
      return validator.escape(String(html));
    }
  }

  // ---------- Generic user input ----------
  sanitizeUserInput(input, type = 'text') {
    if (input === null || input === undefined) return '';

    let s = String(input);

    try {
      switch (type) {
        case 'text':
          // Escape HTML entities
          s = validator.escape(s);
          s = s.replace(/\0/g, '');
          break;

        case 'email':
          if (s.includes('@')) {
            const normalized = validator.normalizeEmail(s, {
              all_lowercase: true,
              gmail_remove_dots: true,
              gmail_remove_subaddress: false
            });
            s = normalized || s;
          }
          s = validator.escape(s);
          break;

        case 'url':
          s = s.trim();
          s = s.replace(/[<>"'\r\n]/g, '');
          if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) {
            s = 'https://' + s;
          }
          break;

        case 'number':
          s = s.replace(/[^0-9.\-+eE]/g, '');
          if (s === '' || Number.isNaN(Number(s))) s = '0';
          break;

        case 'alphanumeric':
          s = s.replace(/[^a-zA-Z0-9]/g, '');
          break;

        case 'username':
          s = s.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
          break;

        case 'filename':
          // remove directory traversal and unsafe chars, keep dot for extension
          s = s.replace(/\.\.+/g, '');
          s = s.replace(/[\/\\]/g, '');
          s = s.replace(/[^a-zA-Z0-9._-]/g, '');
          if (s.length > 255) s = s.slice(0, 255);
          break;

        case 'sql':
          s = this.sanitizeSQL(s);
          break;

        case 'json':
          s = this.sanitizeJSON(s);
          break;

        case 'phone':
          s = s.replace(/[^\d+\-\(\) \.]/g, '');
          break;

        case 'markdown':
          s = this.sanitizeMarkdown(s);
          break;

        default:
          s = validator.escape(s);
      }

      return s.trim();
    } catch (err) {
      console.error(`Sanitization error for type ${type}:`, err);
      return validator.escape(String(input)).trim();
    }
  }

  // ---------- SQL ----------
  sanitizeSQL(input) {
    if (!input) return '';
    try {
      let s = String(input);
      // Remove common SQL control tokens and comment markers
      s = s.replace(/(\-\-|\/*\*|\*\/|;)/g, ' ');
      // Remove dangerous keywords (simple approach)
      s = s.replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|CREATE|REPLACE|UNION|EXEC|EXECUTE)\b/gi, '');
      // Escape single quotes for SQL contexts
      s = s.replace(/'/g, "''");
      s = s.replace(/\0/g, '');
      return s.trim();
    } catch (err) {
      console.error('SQL sanitization error:', err);
      return '';
    }
  }

  // ---------- JSON ----------
  sanitizeJSON(jsonString) {
    if (!jsonString) return '{}';
    try {
      const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      const sanitizedObj = this.sanitizeObject(parsed);
      return JSON.stringify(sanitizedObj);
    } catch (err) {
      console.error('JSON sanitization error:', err);
      return '{}';
    }
  }

  // ---------- Recursive object sanitizer ----------
  sanitizeObject(obj, maxDepth = 10, currentDepth = 0) {
    try {
      if (currentDepth >= maxDepth) return null;
      if (obj === null || obj === undefined) return obj;
      if (typeof obj === 'string') return validator.escape(obj);
      if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
      if (obj instanceof Date) return obj.toISOString();
      if (Array.isArray(obj)) return obj.map(item => this.sanitizeObject(item, maxDepth, currentDepth + 1));
      if (typeof obj === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(obj)) {
          if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
          // sanitize key
          const safeKey = String(k).replace(/[^a-zA-Z0-9_]/g, '');
          if (!safeKey) continue;
          out[safeKey] = this.sanitizeObject(v, maxDepth, currentDepth + 1);
        }
        return out;
      }
      return null;
    } catch (err) {
      console.error('Object sanitization error:', err);
      return null;
    }
  }

  // ---------- File path ----------
  sanitizeFilePath(p) {
    if (!p) return '';
    try {
      let s = String(p);
      // remove nulls and control chars
      s = s.replace(/\0/g, '').replace(/[\x00-\x1f\x80-\x9f]/g, '');
      // remove ../ or ..\ patterns
      s = s.replace(/(\.\.\/|\.\.\\)/g, '');
      // strip drive letters like C:
      s = s.replace(/^[a-zA-Z]:/, '');
      // keep only safe chars for path (allow forward slash)
      s = s.replace(/[^a-zA-Z0-9._\-\/]/g, '');
      // normalize slashes
      s = s.replace(/\\+/g, '/');
      s = s.replace(/\/+/g, '/');
      s = s.replace(/\/$/, '');
      return s;
    } catch (err) {
      console.error('File path sanitization error:', err);
      return '';
    }
  }

  // ---------- MongoDB query sanitizer ----------
  sanitizeMongoQuery(query) {
    if (!query || typeof query !== 'object') return {};
    try {
      const dangerousOperators = new Set([
        '$where', '$function', '$accumulator', '$expr', '$jsonSchema', '$code'
      ]);

      const allowedOperators = new Set([
        '$eq','$ne','$gt','$gte','$lt','$lte',
        '$in','$nin','$and','$or','$not','$exists','$size'
      ]);

      const sanitizeValue = (value) => {
        if (value === null || value === undefined) return value;
        if (typeof value === 'string') return value.replace(/\$/g, '');
        if (Array.isArray(value)) return value.map(v => sanitizeValue(v));
        if (typeof value === 'object') return this.sanitizeMongoQuery(value);
        return value;
      };

      const out = {};
      for (const [k, v] of Object.entries(query)) {
        if (dangerousOperators.has(k)) continue;
        if (k.startsWith('$') && !allowedOperators.has(k)) continue;
        out[k] = sanitizeValue(v);
      }
      return out;
    } catch (err) {
      console.error('MongoDB query sanitization error:', err);
      return {};
    }
  }

  // ---------- Headers ----------
  sanitizeHeaders(headers) {
    if (!headers || typeof headers !== 'object') return {};
    try {
      const safe = {};
      for (const [k, v] of Object.entries(headers)) {
        const key = String(k).replace(/[^\w-]/g, '');
        if (!key) continue;
        let value = String(v).replace(/[\r\n]/g, '');
        value = value.replace(/\0/g, '');
        if (value.length > 8192) value = value.slice(0, 8192);
        safe[key] = value;
      }
      return safe;
    } catch (err) {
      console.error('Headers sanitization error:', err);
      return {};
    }
  }

  // ---------- Logging sanitization (redact secrets) ----------
  sanitizeForLogging(data) {
    if (!data) return data;
    const seen = new WeakSet();

    const sanitize = (obj, depth = 0) => {
      if (depth > 10) return '[MAX_DEPTH_EXCEEDED]';
      if (obj === null || obj === undefined) return obj;
      if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') return obj;
      if (obj instanceof Date) return obj.toISOString();
      if (Array.isArray(obj)) return obj.map(it => sanitize(it, depth + 1));
      if (typeof obj === 'object') {
        if (seen.has(obj)) return '[CYCLIC]';
        seen.add(obj);
        const out = {};
        for (const [k, v] of Object.entries(obj)) {
          const lower = k.toLowerCase();
          const isSensitive = Array.from(this.sensitiveFields).some(field => lower.includes(field));
          if (isSensitive) out[k] = '[REDACTED]';
          else out[k] = sanitize(v, depth + 1);
        }
        return out;
      }
      return '[UNKNOWN_TYPE]';
    };

    try {
      return sanitize(data);
    } catch (err) {
      console.error('Logging sanitization error:', err);
      return '[SANITIZATION_ERROR]';
    }
  }

  // ---------- Error message sanitization ----------
  sanitizeErrorMessage(error) {
    if (!error) return 'An error occurred';
    try {
      let message = String(error.message || error);
      message = message.split('\n')[0]; // only first line
      // Remove Unix-style paths
      message = message.replace(/(?:\/[\w\-\.\/]+)+/g, '[PATH]');
      // Remove Windows-style paths
      message = message.replace(/[A-Za-z]:\\[^\s]*/g, '[PATH]');
      // Remove IP addresses
      message = message.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP]');
      // Remove emails
      message = message.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[EMAIL]');
      // Replace long base64-like strings
      message = message.replace(/\b[A-Za-z0-9+/=]{20,}\b/g, '[DATA]');
      if (message.length > 500) message = message.slice(0, 497) + '...';
      return message;
    } catch (err) {
      console.error('Error message sanitization failed:', err);
      return 'An error occurred';
    }
  }

  // ---------- Markdown sanitization ----------
  sanitizeMarkdown(markdown) {
    if (!markdown) return '';
    try {
      let s = String(markdown);
      // Remove HTML tags
      s = s.replace(/<[^>]*>/g, '');
      // Remove dangerous link protocols from markdown links: [text](javascript:...), [text](data:...), [text](vbscript:...)
      s = s.replace(/\[([^\]]+)\]\((?:javascript|data|vbscript):[^\)]*\)/gi, '[$1]');
      // Also remove inline javascript: or data: in parentheses or angle brackets
      s = s.replace(/javascript:[^\s)]+/gi, '[REMOVED]');
      s = s.replace(/data:[^\s)]+/gi, '[REMOVED]');
      // Limit length
      if (s.length > 50000) s = s.slice(0, 50000);
      return s;
    } catch (err) {
      console.error('Markdown sanitization error:', err);
      return '';
    }
  }

  // ---------- CSV ----------
  sanitizeCSV(csvData) {
    if (!csvData) return '';
    try {
      let s = String(csvData);
      // Prevent formula injection: prefix = + - @ with a single quote at start of each line
      s = s.replace(/(^|\r?\n)([=+\-@])/g, "$1'$2");
      s = s.replace(/\0/g, '');
      return s;
    } catch (err) {
      console.error('CSV sanitization error:', err);
      return '';
    }
  }
}

// Export instance (singleton)
const instance = new SanitizationUtils();
export default instance;
export { SanitizationUtils };
