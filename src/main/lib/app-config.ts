import { resolve } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { app } from "electron";

import { APP } from "@/constants/app";

class AppConfig {
  homePath: string;

  constructor() {
    this.homePath = app.getPath("home");

    const isExist = this.isExist();

    console.log("app config is exist", isExist);

    if (isExist) return;

    this.makeDirectory();

    this.writeFile(
      APP.APP_CONFIG_FILE_NAME,
      JSON.stringify({
        width: APP.APP_DEFAULT_WIDTH,
        height: APP.APP_DEFAULT_HEIGHT,
        x: APP.APP_DEFAULT_POSITION_X,
        y: APP.APP_DEFAULT_POSITION_Y,
      }),
    );
  }

  isExist(path?: string) {
    const paths = [this.homePath, APP.APP_NAME, path].filter((path) => !!path) as string[];

    const targetPath = resolve(...paths);

    return existsSync(targetPath);
  }

  makeDirectory(path?: string) {
    const paths = [this.homePath, APP.APP_NAME, path].filter((path) => !!path) as string[];

    const targetPath = resolve(...paths);

    mkdirSync(targetPath);
  }

  readFile(path?: string) {
    if (!path) return null;

    const targetPath = resolve(this.homePath, APP.APP_NAME, path);

    return readFileSync(targetPath, { encoding: "utf-8" });
  }

  writeFile(path?: string, data?: string | null) {
    if (!path || !data) return;

    const targetPath = resolve(this.homePath, APP.APP_NAME, path);

    writeFileSync(targetPath, data, "utf-8");
  }
}

export default new AppConfig();
