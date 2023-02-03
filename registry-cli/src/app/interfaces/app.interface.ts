export type { apps as IPersistenceApp } from "../../prisma/client";

export enum AppKind {
  regular = "regular",
  primary = "primary",
}

export interface IApp {
  ssr: { src: string; timeout: number };
  name: string;
  spaBundle: string;

  kind?: AppKind;
  props?: Record<string, unknown>;
  ssrProps?: Record<string, unknown>;
  dependencies?: Record<string, string>;
}
