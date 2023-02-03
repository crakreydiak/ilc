import { ITemplate } from "../interfaces/template.interface";

export interface ITemplateDto extends Readonly<ITemplate> {
  readonly slots: string[];
}
