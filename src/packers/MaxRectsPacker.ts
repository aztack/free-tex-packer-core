import { MaxRectsPacker as MaxRectsPackerEngine, PACKING_LOGIC } from "maxrects-packer";
import Packer from "./Packer";

/**
 * MaxRectsPacker packer method
 *
 * @see TexturePackerOptions.packerMethod
 */
export enum MaxRectsPackerMethod {
  SMART = 'Smart',
  SQUARE = 'Square',
  SMART_SQUARE = 'SmartSquare',
  SMART_AREA = 'SmartArea',
  SQUARE_AREA = 'SquareArea',
  SMART_SQUARE_AREA = 'SmartSquareArea'
}

const METHOD = {
  Smart: MaxRectsPackerMethod.SMART,
  SmartArea: MaxRectsPackerMethod.SMART_AREA,
  Square: MaxRectsPackerMethod.SQUARE,
  SquareArea: MaxRectsPackerMethod.SQUARE_AREA,
  SmartSquare: MaxRectsPackerMethod.SMART_SQUARE,
  SmartSquareArea: MaxRectsPackerMethod.SMART_SQUARE_AREA
};

export default class MaxRectsPacker extends Packer {
  binWidth: number;
  binHeight: number;
  allowRotate: boolean;

  constructor(width: number, height: number, allowRotate: boolean = false) {
    super();
    this.binWidth = width;
    this.binHeight = height;
    this.allowRotate = allowRotate;
  }

  pack(data: any, method: string) {
    let options = {
      smart: method === METHOD.Smart || method === METHOD.SmartArea || method === METHOD.SmartSquare || method === METHOD.SmartSquareArea,
      pot: false,
      square: method === METHOD.Square || method === METHOD.SquareArea || method === METHOD.SmartSquare || method === METHOD.SmartSquareArea,
      allowRotation: this.allowRotate,
      logic: method === METHOD.Smart || method === METHOD.Square || method === METHOD.SmartSquare ? PACKING_LOGIC.MAX_EDGE : PACKING_LOGIC.MAX_AREA,
    };

    let packer = new MaxRectsPackerEngine(this.binWidth, this.binHeight, 0, options);

    let input: { width: number; height: number; data: any }[] = [];

    for (let item of data) {
      input.push({ width: item.frame.w, height: item.frame.h, data: item });
    }

    // @ts-ignore
    packer.addArray(input);

    let bin = packer.bins[0];
    let rects = bin.rects;

    let res: any[] = [];

    for (let item of rects) {
      item.data.frame.x = item.x;
      item.data.frame.y = item.y;
      if (item.rot) {
        item.data.rotated = true;
      }
      res.push(item.data);
    }

    return res;
  }

  static get type() {
    return "MaxRectsPacker";
  }

  static get defaultMethod() {
    return METHOD.Smart;
  }

  static get methods() {
    return METHOD;
  }

  static getMethodProps(id: string = '') {
    switch (id) {
      case METHOD.Smart:
        return { name: "Smart edge logic", description: "" };
      case METHOD.SmartArea:
        return { name: "Smart area logic", description: "" };
      case METHOD.Square:
        return { name: "Square edge logic", description: "" };
      case METHOD.SquareArea:
        return { name: "Square area logic", description: "" };
      case METHOD.SmartSquare:
        return { name: "Smart square edge logic", description: "" };
      case METHOD.SmartSquareArea:
        return { name: "Smart square area logic", description: "" };
      default:
        throw new Error("Unknown method " + id);
    }
  }

  static getMethodByType(type: string): MaxRectsPackerMethod  {
    type = type.toLowerCase();

    let keys = Object.keys(METHOD);

    for (let name of keys) {
      if (type === name.toLowerCase()) return METHOD[name];
    }

    return null;
  }
}