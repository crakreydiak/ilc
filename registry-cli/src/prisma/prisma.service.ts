import { PrismaClient } from "./client";

export class PrismaService extends PrismaClient {}

const prismaService = new PrismaService();
export default prismaService;
