import { prismaServiceMock } from "../../../prisma/prisma-service.mock";
import { TemplateMapper } from "../../mappers/template.mapper";
import { PrismaTemplateRepository } from "../prisma-template.repository";

describe("PrismaTemplateRepository", () => {
  let prismaRepository: PrismaTemplateRepository;

  beforeEach(() => {
    prismaRepository = new PrismaTemplateRepository(prismaServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all templates from db", async () => {
    const templates = [{ name: "name", content: "content" }];
    prismaServiceMock.templates.findMany.mockResolvedValue(templates);

    const result = await prismaRepository.getAllTemplates();
    expect(result).toHaveLength(templates.length);

    const [template] = result;
    const [dbTemplate] = templates;
    expect(template.name).toBe(dbTemplate.name);
    expect(template.content).toBe(dbTemplate.content);
  });

  it("should create or update the template in db", async () => {
    const template = TemplateMapper.createTemplate({
      name: "name",
      content: "content",
    });

    await prismaRepository.createOrUpdateTemplate(template);

    expect(prismaServiceMock.templates.upsert).toBeCalled();
    expect(prismaServiceMock.templates.upsert).toBeCalledTimes(1);
    expect(prismaServiceMock.templates.upsert).toBeCalledWith({
      where: { name: template.name },
      create: { name: template.name, content: template.content },
      update: { name: template.name, content: template.content },
    });
  });
});
