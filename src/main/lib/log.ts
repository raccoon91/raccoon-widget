import { resolve } from "path";
import { createWriteStream, existsSync, mkdirSync, WriteStream } from "fs";
import { app } from "electron";

import { APP } from "@/constants/app";

class Log {
  homePath: string;
  logStream: WriteStream;

  constructor() {
    this.homePath = app.getPath("home");

    const isExist = this.isExist();

    if (!isExist) this.makeDirectory();

    const paths = resolve(this.homePath, APP.APP_NAME, APP.APP_LOG_FILE_NAME);

    this.logStream = createWriteStream(paths, { flags: "a" });

    const timestamp = new Date().toISOString();

    this.logStream.write(`[${timestamp}] [APP OPENED]\n`);
  }

  info(message: unknown) {
    const timestamp = new Date().toISOString();

    this.logStream.write(`[${timestamp}] [INFO] ${message}\n`);

    if (message instanceof Error) {
      this.logStream.write(`[${timestamp}] [INFO] ${message.stack}\n`);
    }
  }

  warn(message: unknown) {
    const timestamp = new Date().toISOString();

    this.logStream.write(`[${timestamp}] [WARN] ${message}\n`);

    if (message instanceof Error) {
      this.logStream.write(`[${timestamp}] [WARN] ${message.stack}\n`);
    }
  }

  error(message: unknown) {
    const timestamp = new Date().toISOString();

    this.logStream.write(`[${timestamp}] [ERROR] ${message}\n`);

    if (message instanceof Error) {
      this.logStream.write(`[${timestamp}] [ERROR] ${message.stack}\n`);
    }
  }

  end() {
    const timestamp = new Date().toISOString();

    this.logStream.write(`[${timestamp}] [APP CLOSED]\n\n`);

    this.logStream.end();
  }

  isExist() {
    const path = resolve(this.homePath, APP.APP_NAME);

    return existsSync(path);
  }

  makeDirectory() {
    const path = resolve(this.homePath, APP.APP_NAME);

    mkdirSync(path);
  }
}

export default new Log();
