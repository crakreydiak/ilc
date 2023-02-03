import { TemplateMapper } from "../mappers/template.mapper";
import { ITemplateRepository } from "../repos/template.repository";
import { ICreateOrUpdateTemplateDto } from "../dtos/create-or-update-template.dto";

export class CreateOrUpdateTemplateService {
  constructor(private readonly templateRepository: ITemplateRepository) {}

  async execute(createOrUpdateDto: ICreateOrUpdateTemplateDto): Promise<void> {
    await this.templateRepository.createOrUpdateTemplate(
      TemplateMapper.createTemplate({
        name: createOrUpdateDto.name,
        content: createOrUpdateDto.content,
      })
    );
  }
}
