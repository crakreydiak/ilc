import commander from "commander";

import prismaService from "../../prisma";

import { PrismaTemplateRepository } from "../repos/prisma-template.repository";
import { FileSystemTemplateRepository } from "../repos/fs-template.repository";
import { TransferTemplatesService } from "../services/transfer-templates.service";

const publishTemplatesCommand = new commander.Command("publish");

publishTemplatesCommand
  .description("Publish all templates from the local fs to the registry")
  .action(async () => {
    const getterRepository = new FileSystemTemplateRepository();
    const writerRepository = new PrismaTemplateRepository(prismaService);

    const transferTemplatesService = new TransferTemplatesService(
      getterRepository,
      writerRepository
    );

    try {
      await transferTemplatesService.execute();
      console.log("Templates published successfully");
    } catch (err) {
      console.error("PublishTemplatesCommand failed");
      console.error(err);
      throw err;
    }
  })
  .hook("postAction", async () => {
    await prismaService.$disconnect();
  });

export { publishTemplatesCommand };
