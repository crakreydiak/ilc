import commander from "commander";

import prismaService from "../../prisma";

import { PrismaAppRepository } from "../repos/prisma-app.repository";
import { GetAppByNameService } from "../services/get-app-by-name.service";

const getAppCommand = new commander.Command("get")
  .description("Show current application state in the registry")
  .requiredOption(
    "-n, --name <app>",
    "application name to search for in the registry"
  )
  .action(async (options) => {
    const { name } = options;

    const appRepository = new PrismaAppRepository(prismaService);
    const getAppByNameService = new GetAppByNameService(appRepository);

    try {
      const app = await getAppByNameService.execute({ name });
      console.log(JSON.stringify(app, null, 2));
    } catch (err) {
      console.error("GetAppCommand failed");
      console.error(err, { name });
      throw err;
    }
  })
  .hook("postAction", async () => {
    await prismaService.$disconnect();
  });

export { getAppCommand };
