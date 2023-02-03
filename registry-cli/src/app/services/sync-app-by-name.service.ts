import { IGetAppByNameDto } from "../dtos/get-app-by-name.dto";
import {
  IAppReaderRepository,
  IAppWriterRepository,
} from "../repos/app.repository";

export class SyncAppByNameService {
  constructor(
    private readonly readerAppRepository: IAppReaderRepository,
    private readonly writerAppRepository: IAppWriterRepository
  ) {}

  async execute(getAppByNameDto: IGetAppByNameDto): Promise<void> {
    const { name } = getAppByNameDto;
    const app = await this.readerAppRepository.getAppByName(name);
    if (!app) {
      throw new Error("App not found");
    }

    await this.writerAppRepository.upsertApp(app);
  }
}
