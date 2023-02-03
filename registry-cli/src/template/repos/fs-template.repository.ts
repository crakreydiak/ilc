import process from "process";

import { FileUtils } from "../../utils/file.utils";

import { Template } from "../template";
import { TemplateMapper } from "../mappers/template.mapper";
import { ITemplateRepository } from "./template.repository";

export class FileSystemTemplateRepository implements ITemplateRepository {
  private static HTML_TEMPLATE_PATTERN = "**/*.template.html";

  async getAllTemplates(): Promise<Template[]> {
    const files = FileUtils.getFilesFromDir(
      FileSystemTemplateRepository.HTML_TEMPLATE_PATTERN,
      process.cwd()
    );

    const tasks = files.map(
      async (filePath: string): Promise<Template | undefined> => {
        try {
          const templateName = FileUtils.getFileNameWithoutExtension(filePath);
          const [name] = templateName.split(".");
          const content = await FileUtils.getFileContent(filePath);
          return TemplateMapper.createTemplate({ name, content });
        } catch (err) {
          console.error("FileSystemTemplateRepository");
          console.error(err);
          return undefined;
        }
      }
    );

    const templates = await Promise.all(tasks);
    return templates.filter(Boolean) as Template[];
  }

  async createOrUpdateTemplate(template: Template): Promise<void> {
    const cwd = process.cwd();
    const filename = FileUtils.createFilePath(
      cwd,
      `${template.name}.template.html`
    );
    await FileUtils.createFile(filename, template.content);
    return;
  }
}
