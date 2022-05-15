import { SavePurchases } from "@/domain/usecases";
import faker from "@faker-js/faker";
export const mockPurchases = (): SavePurchases.Params[] => [
  {
    id: faker.datatype.uuid(),
    date: faker.date.recent(),
    value: faker.datatype.number(),
  },
];
