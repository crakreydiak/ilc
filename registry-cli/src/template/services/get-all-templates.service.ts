import { ITemplateDto } from "../dtos/template.dto";
import { TemplateMapper } from "../mappers/template.mapper";
import { ITemplateRepository } from "../repos/template.repository";

export class GetAllTemplatesService {
  constructor(private readonly templateRepository: ITemplateRepository) {}

  async execute(): Promise<ITemplateDto[]> {
    const templates = await this.templateRepository.getAllTemplates();
    return templates.map((template) => TemplateMapper.createDto(template));
  }
}
