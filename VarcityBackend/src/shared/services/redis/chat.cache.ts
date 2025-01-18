import { BaseCache } from './base.cache';

const CACHE_NAME = 'ChatCache';

export class ChatCache extends BaseCache {
  constructor() {
    super(CACHE_NAME);
  }
}
