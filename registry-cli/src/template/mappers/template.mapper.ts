import { Template } from "../template";
import { ITemplateDto } from "../dtos/template.dto";
import {
  ITemplate,
  IPersistanceTemplate,
} from "../interfaces/template.interface";

export class TemplateMapper {
  static createTemplate(template: ITemplate): Template {
    const { name, content } = template;
    return Template.create({ name, content });
  }

  static createDto(template: Template): ITemplateDto {
    return {
      name: template.name,
      slots: template.slots,
      content: template.content,
    };
  }

  static createPersistence(template: Template): IPersistanceTemplate {
    return {
      name: template.name,
      content: template.content,
    };
  }
}
