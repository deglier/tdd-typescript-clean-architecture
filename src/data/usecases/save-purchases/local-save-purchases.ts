import { SavePurchases } from "@/domain";
import { CacheStore } from "@/data/protocols/cache";

export class LocalSavePurchases implements SavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}
  async save(purchases: SavePurchases.Params[]): Promise<void> {
    this.cacheStore.delete("purchases");
    this.cacheStore.insert("purchases", purchases);
  }
}
