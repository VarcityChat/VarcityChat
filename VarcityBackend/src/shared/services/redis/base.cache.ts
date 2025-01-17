import { config } from '@root/config';
import { Redis } from 'ioredis';
import { redisConnection } from './redis.connection';
import Logger from 'bunyan';

export abstract class BaseCache {
  protected client: Redis;
  log: Logger;

  constructor(cacheName: string) {
    this.log = config.createLogger(cacheName);
    this.client = redisConnection.getClient();
  }
}
