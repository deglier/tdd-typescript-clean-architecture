import { LocalLoadPurchases } from "@/data/usecases";
import { CacheStoreSpy, mockPurchases } from "@/data/tests";

type SutTypes = {
  sut: LocalLoadPurchases;
  cacheStore: CacheStoreSpy;
};
const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timestamp);
  return {
    sut,
    cacheStore,
  };
};

describe("LocalLoadPurchases", () => {
  it("Should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.actions).toEqual([]);
  });
  it("Should return empty list if load fails", async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateFetchError();
    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ]);
    expect(cacheStore.deleteKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });
  it("Should return a list of purchases if is less than 3 days old", async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);
    timestamp.setDate(currentDate.getDate() - 3);
    timestamp.setSeconds(currentDate.getSeconds() + 1);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };

    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(purchases).toEqual(cacheStore.fetchResult.value);
    expect(cacheStore.fetchKey).toBe("purchases");
  });
  it("Should return a empty list if is cache is more than 3 days old", async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);
    timestamp.setDate(currentDate.getDate() - 3);
    timestamp.setSeconds(currentDate.getSeconds() - 1);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };

    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(cacheStore.deleteKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });
  it("Should return an empty list if cache is3 days old", async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);
    timestamp.setDate(currentDate.getDate() - 3);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };

    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(cacheStore.deleteKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });
  it("Should return a list of purchases if is empty", async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);
    timestamp.setDate(currentDate.getDate() - 3);
    timestamp.setSeconds(currentDate.getSeconds() + 1);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: [],
    };

    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });
});
