import { APP, APP_CHILD } from "@/constants/app";
import { APP_NAME } from "@/constants/app-name";
import { File } from "@/main/helper/file";

class Config extends File {
  config: Record<string, Record<string, any>>;

  constructor() {
    super();

    const isExist = this.isExist(APP.APP_CONFIG_FILE_NAME);

    if (!isExist) {
      this._write({
        [APP_NAME.MAIN]: {
          width: APP.APP_DEFAULT_WIDTH,
          height: APP.APP_DEFAULT_HEIGHT,
          x: APP.APP_DEFAULT_POSITION_X,
          y: APP.APP_DEFAULT_POSITION_Y,
        },
        [APP_NAME.BLUETOOTH]: {
          width: APP_CHILD.APP_CHILD_DEFAULT_WIDTH,
          height: APP_CHILD.APP_CHILD_DEFAULT_HEIGHT,
          x: APP_CHILD.APP_CHILD_DEFAULT_POSITION_X,
          y: APP_CHILD.APP_CHILD_DEFAULT_POSITION_Y,
        },
      });
    }

    this.config = this._read() ?? {};
  }

  _read(): Nullable<Record<string, Record<string, number>>> {
    const targetPath = this.getAppPath(APP.APP_CONFIG_FILE_NAME);

    const result = this.readFileSync(targetPath);

    return result ? JSON.parse(result) : null;
  }

  _write(data?: Record<string, any>) {
    if (!data) return;

    const targetPath = this.getAppPath(APP.APP_CONFIG_FILE_NAME);

    this.writeFileSync(targetPath, JSON.stringify(data));
  }

  save() {
    this._write(this.config);
  }

  get(name: string) {
    return this.config[name];
  }

  set(name: string, data?: Record<string, number>) {
    if (!data) return;

    this.config[name] = data;
  }
}

export default new Config();
