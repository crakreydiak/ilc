import path from "path";
import fs from "fs-extra";
import globby from "globby";

export class FileUtils {
  static async getFileContent(filename: string): Promise<string> {
    const content = await fs.readFile(filename, "utf-8");
    return content;
  }

  static async checkPathExistence(filename: string): Promise<boolean> {
    const check = await fs.pathExists(filename);
    return check;
  }

  static createFilePath(...chunks: string[]): string {
    return path.join(...chunks);
  }

  static async createFile(filename: string, content?: unknown): Promise<void> {
    await fs.ensureFile(filename);

    if (!!content) {
      await fs.writeFile(filename, content);
    }
    return;
  }

  static getFilesFromDir(pattern: string, dir?: string): string[] {
    return globby.sync(pattern, { cwd: dir || process.cwd(), gitignore: true });
  }

  static getFileNameWithoutExtension(filename: string): string {
    return path.basename(filename, path.extname(filename));
  }
}
