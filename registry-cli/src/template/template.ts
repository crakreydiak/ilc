export interface ITemplateOpts {
  name: string;
  content: string;
}

export class Template {
  private constructor(private readonly opts: ITemplateOpts) {}

  get name(): string {
    return this.opts.name;
  }

  get content(): string {
    return this.opts.content;
  }

  get slots(): string[] {
    if (!this.content) {
      return [];
    }

    const SLOT_REGEX = /<ilc-slot\s+id="(.+)"\s*\/?>/gm;
    return [...this.content.matchAll(SLOT_REGEX)].map(([, id]) => id);
  }

  static create(opts: ITemplateOpts): Template {
    const template = new Template(opts);
    return template;
  }
}
