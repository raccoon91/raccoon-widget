import { resolve } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { app } from "electron";

import { APP } from "@/constants/app";

export class File {
  homePath: string;

  constructor() {
    this.homePath = app.getPath("home");

    const isExist = this.isExist();

    if (!isExist) this.makeDirectory();
  }

  getAppPath(path?: string) {
    const paths = [this.homePath, APP.APP_NAME, path].filter((path) => !!path) as string[];

    return resolve(...paths);
  }

  isExist(path?: string) {
    const targetPath = this.getAppPath(path);

    return existsSync(targetPath);
  }

  makeDirectory(path?: string) {
    const targetPath = this.getAppPath(path);

    mkdirSync(targetPath);
  }

  readFileSync(path: string) {
    return readFileSync(path, { encoding: "utf-8" });
  }

  writeFileSync(path: string, data = "") {
    writeFileSync(path, data, "utf-8");
  }
}
