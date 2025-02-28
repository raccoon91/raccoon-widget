import { APP } from "@/constants/app";
import { File } from "./file";

class Storage extends File {
  storage: Record<string, any> = {};
  session: Record<string, any> = {};

  constructor() {
    super();

    const isExist = this.isExist(APP.APP_STORAGE_FILE_NAME);

    if (!isExist) this._write({});

    this.storage = this._read();
  }

  _read() {
    const targetPath = this.getAppPath(APP.APP_STORAGE_FILE_NAME);

    const result = this.readFileSync(targetPath);

    return result ? JSON.parse(result) : null;
  }

  _write(data?: Record<string, any>) {
    if (!data) return;

    const targetPath = this.getAppPath(APP.APP_STORAGE_FILE_NAME);

    this.writeFileSync(targetPath, JSON.stringify(data));
  }

  save() {
    this._write(this.storage);
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
}

export default new Storage();
