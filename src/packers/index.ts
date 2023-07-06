import MaxRectsPacker, { MaxRectsPackerMethod } from "./MaxRectsPacker";
import MaxRectsBin, { MaxRectsBinMethod } from "./MaxRectsBin";
import OptimalPacker, { OptimalPackerMethod } from "./OptimalPacker";
export { MaxRectsBinMethod } from "./MaxRectsBin";
export { MaxRectsPackerMethod } from "./MaxRectsPacker";
export { OptimalPackerMethod } from "./OptimalPacker";

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

