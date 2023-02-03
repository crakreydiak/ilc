import { templates as IPersistanceTemplate } from "../../prisma/client";
export { IPersistanceTemplate };

export interface ITemplate {
  name: string;
  content: string;
}
