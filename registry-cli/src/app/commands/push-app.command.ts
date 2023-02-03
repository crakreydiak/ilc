import commander from "commander";

import prismaService from "../../prisma";

import { PrismaAppRepository } from "../repos/prisma-app.repository";
import { FileSystemAppRepository } from "../repos/fs-app.repository";
import { SyncAppByNameService } from "../services/sync-app-by-name.service";

const pushAppCommand = new commander.Command("push")
  .description("push app config to the registry db")
  .requiredOption("-n, --name <app>", "application name/target")
  .action(async (options) => {
    const { name } = options;

    const fsAppRepository = new FileSystemAppRepository();
    const prismaAppRepository = new PrismaAppRepository(prismaService);

    const syncAppByNameService = new SyncAppByNameService(
      fsAppRepository,
      prismaAppRepository
    );

    try {
      await syncAppByNameService.execute({ name });
      console.log("Synced");
    } catch (err) {
      console.error("PushAppCommand failed");
      console.error(err, { name });
      throw err;
    }
  })
  .hook("postAction", async () => {
    await prismaService.$disconnect();
  });

export { pushAppCommand };
