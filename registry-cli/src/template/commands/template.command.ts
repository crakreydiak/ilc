import commander from "commander";

import { pullTemplatesCommand } from "./pull-templates.command";
import { listAllTemplatesCommand } from "./list-templates.command";
import { publishTemplatesCommand } from "./publish-templates.command";

const templateCommand = new commander.Command("template");

templateCommand
  .description("An application for managing the CFA templates")
  .addCommand(pullTemplatesCommand)
  .addCommand(listAllTemplatesCommand)
  .addCommand(publishTemplatesCommand);

export { templateCommand };
