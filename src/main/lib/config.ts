import { APP } from "@/constants/app";
import { File } from "./file";

class Config extends File {
  constructor() {
    super();

    const isExist = this.isExist(APP.APP_CONFIG_FILE_NAME);

    if (isExist) return;

    this.write({
      width: APP.APP_DEFAULT_WIDTH,
      height: APP.APP_DEFAULT_HEIGHT,
      x: APP.APP_DEFAULT_POSITION_X,
      y: APP.APP_DEFAULT_POSITION_Y,
    });
  }

  read(): Record<string, number> | null {
    const targetPath = this.getAppPath(APP.APP_CONFIG_FILE_NAME);

    const result = this.readFileSync(targetPath);

    return result ? JSON.parse(result) : null;
  }

  write(data?: Record<string, number>) {
    if (!data) return;

    const targetPath = this.getAppPath(APP.APP_CONFIG_FILE_NAME);

    this.writeFileSync(targetPath, JSON.stringify(data));
  }
}

export default new Config();
