import { AppMapper } from "../mappers/app.mapper";
import { IAppWriterRepository } from "../repos/app.repository";
import { ICreateOrUpdateAppDto } from "../dtos/create-or-update-app.dto";

export class CreateOrUpdateAppService {
  constructor(private readonly appRepository: IAppWriterRepository) {}

  async execute(createOrUpdateDto: ICreateOrUpdateAppDto): Promise<void> {
    const app = AppMapper.createApp(createOrUpdateDto);
    await this.appRepository.upsertApp(app);
  }
}
