import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

class RedisClient {
  constructor() {
    this.client = null;
    this.subscriber = null;
    this.publisher = null;
    this.isConnected = false;
  }

  connect() {
    const config = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    };

    // Main client
    this.client = new Redis(config);
    
    // Pub/Sub clients
    this.publisher = new Redis(config);
    this.subscriber = new Redis(config);

    // Event handlers
    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      logger.error('Redis client error:', error);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      logger.warn('Redis client connection closed');
      this.isConnected = false;
    });

    this.publisher.on('connect', () => {
      logger.info('Redis publisher connected');
    });

    this.subscriber.on('connect', () => {
      logger.info('Redis subscriber connected');
    });

    return this;
  }

  // Cache operations
  async get(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serialized);
      } else {
        await this.client.set(key, serialized);
      }
      return true;
    } catch (error) {
      logger.error('Redis set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis delete error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      logger.error('Redis exists error:', error);
      return false;
    }
  }

  async expire(key, ttl) {
    try {
      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error('Redis expire error:', error);
      return false;
    }
  }

  // List operations
  async lpush(key, value) {
    try {
      const serialized = JSON.stringify(value);
      await this.client.lpush(key, serialized);
      return true;
    } catch (error) {
      logger.error('Redis lpush error:', error);
      return false;
    }
  }

  async lrange(key, start = 0, stop = -1) {
    try {
      const values = await this.client.lrange(key, start, stop);
      return values.map(v => JSON.parse(v));
    } catch (error) {
      logger.error('Redis lrange error:', error);
      return [];
    }
  }

  // Set operations
  async sadd(key, member) {
    try {
      await this.client.sadd(key, member);
      return true;
    } catch (error) {
      logger.error('Redis sadd error:', error);
      return false;
    }
  }

  async srem(key, member) {
    try {
      await this.client.srem(key, member);
      return true;
    } catch (error) {
      logger.error('Redis srem error:', error);
      return false;
    }
  }

  async smembers(key) {
    try {
      const members = await this.client.smembers(key);
      return members;
    } catch (error) {
      logger.error('Redis smembers error:', error);
      return [];
    }
  }

  async sismember(key, member) {
    try {
      const isMember = await this.client.sismember(key, member);
      return isMember === 1;
    } catch (error) {
      logger.error('Redis sismember error:', error);
      return false;
    }
  }

  // Hash operations
  async hset(key, field, value) {
    try {
      const serialized = JSON.stringify(value);
      await this.client.hset(key, field, serialized);
      return true;
    } catch (error) {
      logger.error('Redis hset error:', error);
      return false;
    }
  }

  async hget(key, field) {
    try {
      const value = await this.client.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis hget error:', error);
      return null;
    }
  }

  async hgetall(key) {
    try {
      const hash = await this.client.hgetall(key);
      const result = {};
      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value);
      }
      return result;
    } catch (error) {
      logger.error('Redis hgetall error:', error);
      return {};
    }
  }

  // Sorted set operations
  async zadd(key, score, member) {
    try {
      await this.client.zadd(key, score, member);
      return true;
    } catch (error) {
      logger.error('Redis zadd error:', error);
      return false;
    }
  }

  async zrange(key, start = 0, stop = -1, withScores = false) {
    try {
      if (withScores) {
        return await this.client.zrange(key, start, stop, 'WITHSCORES');
      }
      return await this.client.zrange(key, start, stop);
    } catch (error) {
      logger.error('Redis zrange error:', error);
      return [];
    }
  }

  async zrevrange(key, start = 0, stop = -1, withScores = false) {
    try {
      if (withScores) {
        return await this.client.zrevrange(key, start, stop, 'WITHSCORES');
      }
      return await this.client.zrevrange(key, start, stop);
    } catch (error) {
      logger.error('Redis zrevrange error:', error);
      return [];
    }
  }

  // Pub/Sub operations
  async publish(channel, message) {
    try {
      const serialized = JSON.stringify(message);
      await this.publisher.publish(channel, serialized);
      return true;
    } catch (error) {
      logger.error('Redis publish error:', error);
      return false;
    }
  }

  async subscribe(channel, callback) {
    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on('message', (ch, message) => {
        if (ch === channel) {
          const parsed = JSON.parse(message);
          callback(parsed);
        }
      });
      return true;
    } catch (error) {
      logger.error('Redis subscribe error:', error);
      return false;
    }
  }

  async unsubscribe(channel) {
    try {
      await this.subscriber.unsubscribe(channel);
      return true;
    } catch (error) {
      logger.error('Redis unsubscribe error:', error);
      return false;
    }
  }

  // Clean up
  async disconnect() {
    await this.client.quit();
    await this.publisher.quit();
    await this.subscriber.quit();
    this.isConnected = false;
    logger.info('Redis clients disconnected');
  }
}

// Create singleton instance
const redisClient = new RedisClient().connect();

export default redisClient;