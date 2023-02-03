import commander from "commander";

import { ICreateOrUpdateAppDto } from "../dtos/create-or-update-app.dto";

import { FileSystemAppRepository } from "../repos/fs-app.repository";
import { CreateOrUpdateAppService } from "../services/create-or-update.app.service";

const initAppCommand = new commander.Command("init")
  .description("create init app config file")
  .requiredOption("-n, --name <app>", "application name")
  .action(async (options) => {
    const { name } = options;

    const fsAppRepository = new FileSystemAppRepository();

    const createOrUpdateAppService = new CreateOrUpdateAppService(
      fsAppRepository
    );

    const dto: ICreateOrUpdateAppDto = {
      name,
      ssr: { src: "http://localhost:3000", timeout: 1000 },
      spaBundle: "http://localhost:3000/static/js/main.js",
      dependencies: {},
    };

    try {
      await createOrUpdateAppService.execute(dto);
      console.log("Microfrontend meta info initialized");
    } catch (err) {
      console.error("InitAppCommand failed");
      console.error(err, { dto });
      throw err;
    }
  });

export { initAppCommand };
