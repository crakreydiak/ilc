import { ITemplateRepository } from "../repos/template.repository";

type GetterRepository = Pick<ITemplateRepository, "getAllTemplates">;
type WriterRepository = Pick<ITemplateRepository, "createOrUpdateTemplate">;

export class TransferTemplatesService {
  constructor(
    private readonly getterTemplateRepository: GetterRepository,
    private readonly writerTemplateRepository: WriterRepository
  ) {}

  async execute(): Promise<void> {
    const templates = await this.getterTemplateRepository.getAllTemplates();

    const tasks = templates.map(async (template) => {
      try {
        await this.writerTemplateRepository.createOrUpdateTemplate(template);
      } catch (err) {
        console.error("TransferTemplatesService");
        console.error(err);
        console.error(`${template.name} failed writing task`);
      }
    });

    await Promise.all(tasks);
  }
}
