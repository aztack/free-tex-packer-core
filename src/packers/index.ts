import { MaxRectsBinMethod, MaxRectsPackerMethod, OptimalPackerMethod } from "../types";
import MaxRectsBin from "./MaxRectsBin";
import MaxRectsPacker from "./MaxRectsPacker";
import OptimalPacker from "./OptimalPacker";

export { MaxRectsBinMethod } from "../types";
export { MaxRectsPackerMethod } from "../types";
export { OptimalPackerMethod } from "../types";

export type PackerMethods = MaxRectsBinMethod | MaxRectsPackerMethod | OptimalPackerMethod;

export const list = [
    MaxRectsBin,
    MaxRectsPacker,
    OptimalPacker
];

export function getPackerByType(type: string) {
    type = type.toLowerCase();
    
    for(let item of list) {
        if(item.type.toLowerCase() === type) {
            return item;
        }
    }
    return null;
}

