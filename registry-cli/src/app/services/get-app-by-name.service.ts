import { IAppDto } from "../dtos/app.dto";
import { IGetAppByNameDto } from "../dtos/get-app-by-name.dto";
import { AppMapper } from "../mappers/app.mapper";
import { IAppReaderRepository } from "../repos/app.repository";

export class GetAppByNameService {
  constructor(private readonly appRepository: IAppReaderRepository) {}

  async execute(getAppByNameDto: IGetAppByNameDto): Promise<IAppDto> {
    const app = await this.appRepository.getAppByName(getAppByNameDto.name);
    if (!app) {
      throw new Error("App not found");
    }

    const appDto = AppMapper.createDto(app);
    return appDto;
  }
}
