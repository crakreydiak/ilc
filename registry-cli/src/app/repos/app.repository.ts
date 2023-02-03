import { App } from "../app";

export interface IAppWriterRepository {
  upsertApp(app: App): Promise<void>;
}

export interface IAppReaderRepository {
  getAppByName(name: string): Promise<App | null>;
}
