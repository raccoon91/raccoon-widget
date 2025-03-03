import { createWriteStream, WriteStream } from "fs";

import { APP } from "@/constants/app";
import { File } from "@/main/helper/file";

class Log extends File {
  logStream: WriteStream;

  constructor() {
    super();

    const paths = this.getAppPath(APP.APP_LOG_FILE_NAME);

    this.logStream = createWriteStream(paths, { flags: "a" });

    const timestamp = new Date().toISOString();

    this.logStream.write(`[${timestamp}] [LOG START]\n`);
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

    this.logStream.write(`[${timestamp}] [LOG FINISH]\n\n`);

    this.logStream.end();
  }
}

export default new Log();
