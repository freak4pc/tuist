import fs from "fs";
import { Step } from "../step";
import { hasFile } from "lib/utils/checks";
import { getDevelopmentPath } from "lib/utils/paths";

export class CreateDevelopmentFolder extends Step {
  developmentFolder: string;

  constructor() {
    super();

    this.developmentFolder = getDevelopmentPath();
  }

  async installCheck() {
    if (!hasFile(this.developmentFolder)) {
      return {
        valid: false,
        reason: `Development folder ${this.developmentFolder} does not exist`,
      };
    }
    return {
      valid: true,
      reason: `Development folder exists at ${this.developmentFolder}`,
    };
  }

  name() {
    return "Create Development Folder";
  }

  async installStep() {
    fs.mkdirSync(this.developmentFolder);
  }
}
