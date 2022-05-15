import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain/usecases";

export class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deleteKey: string;
  insertKey: string;
  insertValues: SavePurchases.Params[] = [];
  delete(key: string): void {
    this.deleteCallsCount++;
    this.deleteKey = key;
  }
  insert(key: string, values: any): void {
    this.insertCallsCount++;
    this.insertKey = key;
    this.insertValues = values;
  }
  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
      throw new Error();
    });
  }
  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
      throw new Error();
    });
  }
}
