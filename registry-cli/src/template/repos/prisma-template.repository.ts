import { PrismaService } from "../../prisma";

import { Template } from "../template";
import { TemplateMapper } from "../mappers/template.mapper";
import { ITemplateRepository } from "./template.repository";

export class PrismaTemplateRepository implements ITemplateRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllTemplates(): Promise<Template[]> {
    const templates = await this.prismaService.templates.findMany();
    return templates.map((template) => TemplateMapper.createTemplate(template));
  }

  async createOrUpdateTemplate(template: Template): Promise<void> {
    const nextTemplate = TemplateMapper.createPersistence(template);
    await this.prismaService.templates.upsert({
      where: { name: nextTemplate.name },
      create: { ...nextTemplate },
      update: { ...nextTemplate },
    });
  }
}
