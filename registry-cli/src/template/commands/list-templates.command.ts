import commander from "commander";

import prismaService from "../../prisma";

import { ITemplateRepository } from "../repos/template.repository";
import { PrismaTemplateRepository } from "../repos/prisma-template.repository";
import { FileSystemTemplateRepository } from "../repos/fs-template.repository";

import { GetAllTemplatesService } from "../services/get-all-templates.service";

const listAllTemplatesCommand = new commander.Command("list");

listAllTemplatesCommand
  .description("Lists all templates")
  .option("-l, --local", "list templates from the local fs", true)
  .option("-r, --registry", "list templates from the registry", false)
  .action(async (options) => {
    const { local, registry } = options;

    let templateRepository: ITemplateRepository;

    if (registry) {
      templateRepository = new PrismaTemplateRepository(prismaService);
    } else if (local) {
      templateRepository = new FileSystemTemplateRepository();
    } else {
      throw new Error("Not supported option");
    }

    const getAllTemplatesService = new GetAllTemplatesService(
      templateRepository
    );

    try {
      const templates = await getAllTemplatesService.execute();
      console.log(templates);
    } catch (err) {
      console.error("ListAllTemplatesCommand failed");
      console.error(err);
      throw err;
    }
  })
  .hook("postAction", async () => {
    await prismaService.$disconnect();
  });

export { listAllTemplatesCommand };
