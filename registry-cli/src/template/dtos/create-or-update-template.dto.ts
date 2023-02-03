import { ITemplateDto } from "./template.dto";

export interface ICreateOrUpdateTemplateDto
  extends Omit<ITemplateDto, "slots"> {}
