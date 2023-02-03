import { Template } from "../template";

export interface ITemplateRepository {
  getAllTemplates(): Promise<Template[]>;
  createOrUpdateTemplate(template: Template): Promise<void>;
}
