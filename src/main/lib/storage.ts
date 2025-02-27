import { resolve } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { app } from "electron";

import { APP } from "@/constants/app";

class Storage {
  homePath: string;
  storage: Record<string, any> = {};
  session: Record<string, any> = {};

  constructor() {
    this.homePath = app.getPath("home");

    this.init();

    const stringStorage = this.readFile();

    this.storage = JSON.parse(stringStorage);
  }

  getStorage() {
    return this.storage;
  }

  setStorage(data: any) {
    this.storage = data;
  }

  getSession() {
    return this.session;
  }

  setSession(data: any) {
    this.session = data;
  }

  save() {
    this.writeFile(JSON.stringify(this.storage));
  }

  init() {
    const appPath = resolve(this.homePath, APP.APP_NAME);

    const isDirExist = existsSync(appPath);

    if (!isDirExist) {
      const path = resolve(this.homePath, APP.APP_NAME);

      mkdirSync(path);
    }

    const storagePath = resolve(this.homePath, APP.APP_NAME, APP.APP_STORAGE_FILE_NAME);

    const isStorageExist = existsSync(storagePath);

    if (!isStorageExist) {
      this.writeFile(JSON.stringify({}));
    }
  }

  readFile() {
    const path = resolve(this.homePath, APP.APP_NAME, APP.APP_STORAGE_FILE_NAME);

    return readFileSync(path, { encoding: "utf-8" });
  }

  writeFile(data: string) {
    const path = resolve(this.homePath, APP.APP_NAME, APP.APP_STORAGE_FILE_NAME);

    writeFileSync(path, data, "utf-8");
  }
}

export default new Storage();
