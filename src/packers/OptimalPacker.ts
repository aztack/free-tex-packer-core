import { OptimalPackerMethod } from "../types";
import Packer from "./Packer";

const METHOD = {
  Automatic: OptimalPackerMethod.AUTOMATIC,
};

export default class OptimalPacker extends Packer {
  constructor(width: number, height: number, allowRotate: boolean = false) {
    super();
  }

  pack(data: any, method: string) {
    throw new Error('OptimalPacker is a dummy and cannot be used directly');
  }

  static get type() {
    return "OptimalPacker";
  }

  static get defaultMethod() {
    return METHOD.Automatic;
  }

  static get methods() {
    return METHOD;
  }

  static getMethodProps(id: string = '') {
    switch (id) {
      case METHOD.Automatic:
        return { name: "Automatic", description: "" };
      default:
        throw new Error("Unknown method " + id);
    }
  }

  static getMethodByType(type: string): OptimalPackerMethod {
    type = type.toLowerCase();

    let keys = Object.keys(METHOD);

    for (let name of keys) {
      if (type === name.toLowerCase()) return METHOD[name];
    }

    return null;
  }
}