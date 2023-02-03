import { App } from "../app";
import { IApp } from "../interfaces/app.interface";
import { IAppDto } from "../dtos/app.dto";
import { IPersistenceApp } from "../interfaces/app.interface";

export class AppMapper {
  static createDto(app: App): IAppDto {
    return {
      ssr: app.ssr,
      kind: app.kind,
      name: app.name,
      props: app.props,
      ssrProps: app.ssrProps,
      spaBundle: app.spaBundle,
      dependencies: app.dependencies,
    };
  }

  static createApp(app: IApp): App {
    return App.create(app);
  }

  static createPersistence(app: App): Partial<IPersistenceApp> {
    return {
      name: app.name,
      spaBundle: app.spaBundle,
      cssBundle: app.cssBundle,
      dependencies: app.dependencies,
      ssr: app.ssr,
      kind: app.kind,
      props: app.props as { [prop: string]: any },
      ssrProps: app.ssrProps as { [ssrProp: string]: any },
    };
  }
}
