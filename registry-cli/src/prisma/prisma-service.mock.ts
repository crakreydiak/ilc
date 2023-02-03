import { PrismaClient } from "./client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import prismaService from "./prisma.service";

jest.mock("./prisma.service", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaServiceMock);
});

export const prismaServiceMock =
  prismaService as unknown as DeepMockProxy<PrismaClient>;
