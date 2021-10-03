import { DateTime } from "luxon";

export abstract class BaseModel<T extends BaseModel<T>> {
  protected abstract serializeProcess(data:{ [P in keyof T]: T[P] }):{ [P in keyof T]: any }
  protected abstract deserializeProcess(data:{ [P in keyof T]?: any }):{ [P in keyof T]: T[P] }

  public serialize(): object {
    return this.serializeProcess(this as unknown as T);

  }

  public deserialize(data: { [P in keyof T]?: any }) {
    const processedData = this.deserializeProcess(data);

    for (const [key, value] of Object.entries(processedData)) {
      this[key] = value;
    }
    return this
  }
}