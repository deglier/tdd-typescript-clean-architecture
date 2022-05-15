import { SavePurchases } from "@/domain/usecases";
import { CacheStore } from "@/data/protocols/cache";

export class LocalSavePurchases implements SavePurchases {
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly timestamp: Date
  ) {}

  async save(purchases: SavePurchases.Params[]): Promise<void> {
    this.cacheStore.replace("purchases", {
      timestamp: this.timestamp,
      value: purchases,
    });
  }
}
