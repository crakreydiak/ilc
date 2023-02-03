import { IApp, AppKind } from "./interfaces/app.interface";

export class App {
  private constructor(private readonly opts: IApp) {}

  get ssr() {
    return this.opts.ssr;
  }

  get name(): string {
    return this.opts.name;
  }

  get kind(): AppKind {
    return this.opts.kind || AppKind.regular;
  }

  get props(): Record<string, unknown> {
    return this.opts.props || {};
  }

  get ssrProps(): Record<string, unknown> {
    return this.opts.ssrProps || {};
  }

  get cssBundle(): string {
    return "";
  }

  get spaBundle(): string {
    return this.opts.spaBundle;
  }

  get dependencies(): Record<string, string> {
    return this.opts.dependencies || {};
  }

  static create(opts: IApp): App {
    const { ssrProps, props, ...rest } = opts;

    const options: IApp = {
      props: {
        micro: true,
        ...props,
      },
      ssrProps: {
        micro: true,
        ...ssrProps,
      },
      ...rest,
    };

    if (!options.name) {
      throw new Error("App missing name");
    }

    if (!options?.ssr?.src) {
      throw new Error("App missing ssr src path");
    }

    const app = new App(options);
    return app;
  }
}
