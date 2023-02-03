import process from "process";
import commander from "commander";

import { appCommand } from "./app/commands/app.command";
import { templateCommand } from "./template/commands/template.command";

const cli = new commander.Command();

cli
  .version("1.0.0")
  .description("CLI for managing CFA registry db")
  .addCommand(appCommand)
  .addCommand(templateCommand);

cli.parse(process.argv);
