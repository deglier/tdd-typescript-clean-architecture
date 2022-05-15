import { SavePurchases } from "@/domain/usecases";
import { CacheStore } from "@/data/protocols/cache";

export class LocalLoadPurchases implements SavePurchases {
  private readonly key = "purchases";
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly timestamp: Date
  ) {}

  async save(purchases: SavePurchases.Params[]): Promise<void> {
    this.cacheStore.replace(this.key, {
      timestamp: this.timestamp,
      value: purchases,
    });
  }
  async loadAll(): Promise<void> {
    this.cacheStore.fetch(this.key);
  }
}
