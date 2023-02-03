import commander from "commander";

import prismaService from "../../prisma";

import { PrismaTemplateRepository } from "../repos/prisma-template.repository";
import { FileSystemTemplateRepository } from "../repos/fs-template.repository";

import { TransferTemplatesService } from "../services/transfer-templates.service";

const pullTemplatesCommand = new commander.Command("pull");

pullTemplatesCommand
  .description("Pulls all templates from the registry db to the local fs")
  .action(async () => {
    const getterRepository = new PrismaTemplateRepository(prismaService);
    const writerRepository = new FileSystemTemplateRepository();

    const transferTemplatesService = new TransferTemplatesService(
      getterRepository,
      writerRepository
    );

    try {
      await transferTemplatesService.execute();
      console.log("Templates pulled successfully");
    } catch (err) {
      console.error("PullTemplatesCommand failed");
      console.error(err);
      throw err;
    }
  })
  .hook("postAction", async () => {
    await prismaService.$disconnect();
  });

export { pullTemplatesCommand };
