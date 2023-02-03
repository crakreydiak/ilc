import { IApp } from "../interfaces/app.interface";

export interface IGetAppByNameDto extends Pick<IApp, "name"> {}
