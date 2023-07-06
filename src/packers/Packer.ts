const METHOD = {
  Default: "Default",
};

class Packer {
  constructor() { }

  pack(data: any, method: string) {
    throw new Error("Abstract method. Override it.");
  }

  static get type() {
    return "Default";
  }

  static get defaultMethod() {
    return METHOD.Default;
  }

  static get methods(): Record<string, string> {
    return METHOD;
  }

  static getMethodProps(id: string) {
    return { name: "Default", description: "Default placement" };
  }
}

export default Packer;
