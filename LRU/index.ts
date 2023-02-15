class LRU {
  private size: number
  private cache: Map<string, any>
  constructor(size: number) {
    this.size = size
    this.cache = new Map()
  }

  get(key: string) {
    if (!this.cache.has(key)) return -1
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  put(key: string, value: any) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
    else if (this.cache.size === this.size) {
      const first = this.cache.keys().next().value
      this.cache.delete(first)
    }
    this.cache.set(key, value)
  }
}
