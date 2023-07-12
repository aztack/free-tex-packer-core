import { getPackerByType } from "./packers";
import { getExporterByType } from "./exporters";
import { getFilterByType } from "./filters";
import FilesProcessor, { ResultFile } from "./FilesProcessor";
import Jimp from "jimp";
import { BitmapFilterType, PackerExporterType, PackerMethods, PackerType, ScaleMethod, TextureFormat, TexturePackerOptions, TrimMode } from "./types";
export * from './packers';
export * from './types';

function getErrorDescription(txt) {
  return "@sar-creator/tex-packer" + ": " + txt;
}

function fixPath(path) {
  return path.split("\\").join("/");
}

function loadImage(file, files) {
  return Jimp.read(file.contents)
    .then(image => {
      // @ts-ignore
      image.name = fixPath(file.path);
      // @ts-ignore
      image._base64 = file.contents.toString("base64");
      // @ts-ignore
      image.width = image.bitmap.width;
      // @ts-ignore
      image.height = image.bitmap.height;
      // @ts-ignore
      files[image.name] = image;
    })
    .catch(e => {
      console.error(getErrorDescription("Error reading " + file.path));
    });
}

export function packAsync(
  images: Array<{ path: string; contents: Buffer }>,
  options?: TexturePackerOptions
): Promise<ResultFile[]>{
  options = options || {};
  options = Object.assign({}, options);

  options.textureName = options.textureName === undefined ? "pack-result" : options.textureName;
  options.suffix = (options.suffix === undefined ? "-" : options.suffix) as string;
  options.suffixInitialValue = options.suffixInitialValue === undefined ? 0 : options.suffixInitialValue;
  options.width = options.width === undefined ? 2048 : options.width;
  options.height = options.height === undefined ? 2048 : options.height;
  options.powerOfTwo = !!options.powerOfTwo;
  options.fixedSize = options.fixedSize === undefined ? false : options.fixedSize;
  options.padding = options.padding === undefined ? 0 : options.padding;
  options.extrude = options.extrude === undefined ? 0 : options.extrude;
  options.allowRotation = options.allowRotation === undefined ? true : options.allowRotation;
  options.detectIdentical = options.detectIdentical === undefined ? true : options.detectIdentical;
  options.allowTrim = options.allowTrim === undefined ? true : options.allowTrim;
  options.trimMode = (options.trimMode === undefined ? "trim" : options.trimMode) as TrimMode;
  options.alphaThreshold = options.alphaThreshold === undefined ? 0 : options.alphaThreshold;
  options.removeFileExtension = options.removeFileExtension === undefined ? false : options.removeFileExtension;
  options.prependFolderName = options.prependFolderName === undefined ? true : options.prependFolderName;
  options.textureFormat = (options.textureFormat === undefined ? "png" : options.textureFormat) as TextureFormat;
  options.base64Export = options.base64Export === undefined ? false : options.base64Export;
  options.scale = options.scale === undefined ? 1 : options.scale;
  options.scaleMethod = (options.scaleMethod === undefined ? "BILINEAR" : options.scaleMethod) as ScaleMethod;
  options.tinify = options.tinify === undefined ? false : options.tinify;
  options.tinifyKey = options.tinifyKey === undefined ? "" : options.tinifyKey;
  options.filter = (options.filter === undefined ? "none" : options.filter) as BitmapFilterType;

  if (!options.packer) options.packer = PackerType.MAX_RECTS_BIN;
  if (!options.exporter) options.exporter = PackerExporterType.JSON_HASH;

  let packer = getPackerByType(options.packer);
  if (!packer) {
    throw new Error(getErrorDescription("Unknown packer " + options.packer));
  }

  if (!options.packerMethod) {
    options.packerMethod = packer.defaultMethod as PackerMethods;
  }

  let packerMethod = packer.getMethodByType(options.packerMethod);
  if (!packerMethod) {
    throw new Error(getErrorDescription("Unknown packer method " + options.packerMethod));
  }

  let exporter;
  if (typeof options.exporter == "string") {
    exporter = getExporterByType(options.exporter);
  }
  else {
    exporter = options.exporter;
  }

  if (!exporter.allowRotation) options.allowRotation = false;
  if (!exporter.allowTrim) options.allowTrim = false;

  if (!exporter) {
    throw new Error(getErrorDescription("Unknown exporter " + options.exporter));
  }

  let filter = getFilterByType(options.filter);
  if (!filter) {
    throw new Error(getErrorDescription("Unknown filter " + options.filter));
  }

  // @ts-ignore original js file reused packer and filter fields to save packer and filter constructor
  options.packer = packer;
  options.packerMethod = packerMethod;
  options.exporter = exporter;
  // @ts-ignore
  options.filter = filter;

  let files = {};
  let p = [];

  for (let file of images) {
    p.push(loadImage(file, files));
  }

  return new Promise((resolve, reject) =>
    Promise.all(p)
      .then(() => {
        // @ts-ignore
        FilesProcessor.start(files, options,
          (res) => resolve(res),
          (error) => reject(error)
        )
      })
      .catch((error) => reject(error))
  );
}

export function pack(
  images: Array<{ path: string; contents: Buffer }>,
  options: TexturePackerOptions, cb: (files: Array<{ name: string, buffer: Buffer }>, error?: Error) => void
) {
  packAsync(images, options)
    .then((result) => cb(result))
    .catch((error) => cb(undefined, error));
}
