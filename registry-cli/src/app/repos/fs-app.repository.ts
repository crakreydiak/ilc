import path from "path";
import { cosmiconfig } from "cosmiconfig";

import { FileUtils } from "../../utils/file.utils";

import { App } from "../app";
import { AppMapper } from "../mappers/app.mapper";
import { IAppReaderRepository, IAppWriterRepository } from "./app.repository";

export class FileSystemAppRepository
  implements IAppWriterRepository, IAppReaderRepository
{
  private readonly explorer = cosmiconfig("microfrontend", {
    searchPlaces: [".microfrontend.config.js"],
  });

  private static readonly fileName = ".microfrontend.config.js";
  private static readonly filePath = path.join(
    process.cwd(),
    FileSystemAppRepository.fileName
  );

  async getAppByName(name: string): Promise<App | null> {
    const result = await this.explorer.load(FileSystemAppRepository.filePath);
    if (!result || result?.isEmpty || !result?.config) {
      return null;
    }

    const targets = Object.keys(result?.config);
    if (!targets.length || !targets.includes(name)) {
      return null;
    }

    return AppMapper.createApp(result?.config[name]);
  }

  async upsertApp(app: App): Promise<void> {
    let config = { development: AppMapper.createPersistence(app) };
    const result = await this.explorer.search(FileSystemAppRepository.filePath);

    if (result && !result?.isEmpty && Object.keys(result?.config).length) {
      config = { ...config, ...result?.config };
    }

    const stringifiedConfig = JSON.stringify(config, null, 2);
    const template = `module.exports = ${stringifiedConfig}`;

    await FileUtils.createFile(FileSystemAppRepository.filePath, template);
  }
}
