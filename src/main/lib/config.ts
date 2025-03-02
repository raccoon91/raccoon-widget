import { APP } from "@/constants/app";
import { APP_CHILD } from "@/constants/app-child";
import { File } from "./file";

class Config extends File {
  config: Record<string, Record<string, any>>;

  constructor() {
    super();

    const isExist = this.isExist(APP.APP_CONFIG_FILE_NAME);

    if (!isExist) {
      this._write({
        parent: {
          width: APP.APP_DEFAULT_WIDTH,
          height: APP.APP_DEFAULT_HEIGHT,
          x: APP.APP_DEFAULT_POSITION_X,
          y: APP.APP_DEFAULT_POSITION_Y,
        },
        child: {},
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

  get() {
    return this.config["parent"];
  }

  set(data?: Record<string, number>) {
    if (!data) return;

    this.config["parent"] = data;
  }

  getChild(path: string) {
    return (
      this.config.child?.[path] ?? {
        width: APP_CHILD.APP_CHILD_DEFAULT_WIDTH,
        height: APP_CHILD.APP_CHILD_DEFAULT_HEIGHT,
        x: APP_CHILD.APP_CHILD_DEFAULT_POSITION_X,
        y: APP_CHILD.APP_CHILD_DEFAULT_POSITION_Y,
      }
    );
  }

  setChild(path: string, data?: Record<string, number>) {
    if (!data) return;

    this.config.child[path] = data;
  }
}

export default new Config();
