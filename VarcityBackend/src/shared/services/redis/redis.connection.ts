import Logger from 'bunyan';
import { Redis } from 'ioredis';
import { config } from '@root/config';

const log: Logger = config.createLogger('redisConnection');

class RedisConnection {
  private static instance: RedisConnection;
  private client: Redis | null = null;

  private constructor() {}

  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }
    return RedisConnection.instance;
  }

  public connect(): Redis {
    if (!this.client) {
      this.client = new Redis(`${config.REDIS_HOST}`);
      this.client.on('connect', () => log.info('Redis Connected'));
      this.client.on('error', (err) => log.error('Redis Client Error', err));
    }
    return this.client;
  }

  public getClient(): Redis {
    if (!this.client) {
      return this.connect();
    }
    return this.client;
  }

  public async closeConnection() {
    if (this.client) {
      await this.client?.quit();
    }
  }
}

export const redisConnection = RedisConnection.getInstance();
