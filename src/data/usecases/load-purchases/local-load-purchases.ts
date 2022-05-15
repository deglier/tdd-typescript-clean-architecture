import { LoadPurchases, SavePurchases } from "@/domain/usecases";
import { CachePolice, CacheStore } from "@/data/protocols/cache";

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  private readonly key = "purchases";
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly currentDate: Date
  ) {}

  async save(purchases: SavePurchases.Params[]): Promise<void> {
    this.cacheStore.replace(this.key, {
      timestamp: this.currentDate,
      value: purchases,
    });
  }
  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = this.cacheStore.fetch(this.key);
      const maxAge = new Date(cache.timestamp);
      maxAge.setDate(maxAge.getDate() + 3);
      if (CachePolice.validate(cache.timestamp, this.currentDate)) {
        return cache.value;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }
  validate(): void {
    try {
      const cache = this.cacheStore.fetch(this.key);
      if (!CachePolice.validate(cache.timestamp, this.currentDate)) {
        throw new Error();
      }
    } catch (error) {
      this.cacheStore.delete(this.key);
    }
  }
}
