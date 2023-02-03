import commander from "commander";

import { getAppCommand } from "./get-app.command";
import { initAppCommand } from "./init-app.command";
import { pushAppCommand } from "./push-app.command";

const appCommand = new commander.Command("app");

appCommand
  .description("An application for managing CFA apps/renderers/microfrontends")
  .addCommand(getAppCommand)
  .addCommand(pushAppCommand)
  .addCommand(initAppCommand);

export { appCommand };
