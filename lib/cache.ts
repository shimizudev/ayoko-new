class Cache<K, V> {
  private cache: Map<K, { value: V; timestamp: number }>;
  private timeout: number;

  constructor(timeout: number) {
    this.cache = new Map();
    this.timeout = timeout;
  }

  set(key: K, value: V): void {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < this.timeout) {
      return item.value;
    }
    this.cache.delete(key);
    return undefined;
  }
}

export default Cache
