import { PrismaService } from "../../prisma";

import { App } from "../app";
import { AppMapper } from "../mappers/app.mapper";
import { IAppWriterRepository, IAppReaderRepository } from "./app.repository";

export class PrismaAppRepository
  implements IAppWriterRepository, IAppReaderRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async getAppByName(name: string): Promise<App | null> {
    const app = await this.prismaService.apps.findUnique({ where: { name } });
    if (!app) {
      return null;
    }

    const copy = JSON.parse(JSON.stringify(app));
    return AppMapper.createApp(copy);
  }

  async upsertApp(app: App): Promise<void> {
    const nextApp = AppMapper.createPersistence(app);
    const copy = JSON.parse(JSON.stringify(nextApp));
    await this.prismaService.apps.upsert({
      where: { name: app.name },
      create: copy,
      update: copy,
    });
  }
}
