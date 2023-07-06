import { MaxRectsBinMethod, MaxRectsPackerMethod, PackerMethods, getPackerByType } from "./packers";
import { getExporterByType } from "./exporters";
import { getFilterByType } from "./filters";
import FilesProcessor, { ResultFile } from "./FilesProcessor";
import Jimp from "jimp";
export * from './packers';

/**
 * Trim mode for sprites
 *
 * @see TexturePackerOptions.trimMode
 * @see TexturePackerOptions.allowTrim
 */
export enum TrimMode {
  /**
   * Remove transparent pixels from sides, but left original frame size
   *
   * For example:
   *  Original sprite has size 64x64, after removing transparent pixels its real size will be reduced to 32x28,
   *  which will be written as frame size, but original frame size will stay the same: 64x64
   */
  TRIM = 'trim',
  /**
   * Remove transparent pixels from sides, and update frame size
   *
   * For example:
   *  Original sprite has size 64x64, after removing transparent pixels its real size will be reduced to 32x28,
   *  which will be written as frame size, and original frame size will be reduced to the same dimensions
   */
  CROP = 'crop',
}

/**
 * Output atlas texture format
 *
 * @see TexturePackerOptions.textureFormat
 */
export enum TextureFormat {
  PNG = 'png',
  JPG = 'jpg',
}

/**
 * Atlas packer type.
 * There are two implementations which could be used
 *
 * @see TexturePackerOptions.packer
 * @see TexturePackerOptions.packerMethod
 * @see MaxRectsBinMethod
 * @see MaxRectsPackerMethod
 */
export enum PackerType {
  MAX_RECTS_BIN = 'MaxRectsBin',
  MAX_RECTS_PACKER = 'MaxRectsPacker',
  OPTIMAL_PACKER = 'OptimalPacker'
}


/**
 * Packer exporter type
 * Predefined exporter types (supported popular formats)
 * Instead of predefined type you could use custom exporter
 *
 * @see TexturePackerOptions.exporter
 * @see PackerExporter
 */
export enum PackerExporterType {
  JSON_HASH = 'JsonHash',
  JSON_ARRAY = 'JsonArray',
  CSS = 'Css',
  OLD_CSS = 'OldCss',
  PIXI = 'Pixi',
  PHASER_HASH = 'PhaserHash',
  PHASER_ARRAY = 'PhaserArray',
  PHASER3 = 'Phaser3',
  XML = 'XML',
  STARLING = 'Starling',
  COCOS2D = 'Cocos2d',
  SPINE = 'Spine',
  UNREAL = 'Unreal',
  UIKIT = 'UIKit',
  UNITY3D = 'Unity3D',
}

/**
 * Bitmap filter, applicable to output atlas texture
 *
 * @see TexturePackerOptions.filter
 */
export enum BitmapFilterType {
  GRAYSCALE = 'grayscale',
  MASK = 'mask',
  NONE = 'none',
}

/**
 * Texture packer options
 */
export interface TexturePackerOptions {
  /**
   * Name of output files.
   *
   * @default pack-result
   */
  textureName?: string;

  /**
   * Max single texture width in pixels
   *
   * @default 2048
   */
  width?: number;
  /**
   * Max single texture height in pixels
   *
   * @default 2048
   */
  height?: number;
  /**
   * Fixed texture size
   *
   * @default false
   */
  fixedSize?: boolean;
  /**
   * Force power of two textures sizes
   *
   * @default false
   */
  powerOfTwo?: boolean;
  /**
   * Spaces in pixels around images
   *
   * @default 0
   */
  padding?: number;
  /**
   * Extrude border pixels size around images
   *
   * @default 0
   */
  extrude?: number;
  /**
   * Allow image rotation
   * @default true
   */
  allowRotation?: boolean;
  /**
   * Allow detect identical images
   *
   * @default true
   */
  detectIdentical?: boolean;
  /**
   * Allow trim images
   *
   * @default true
   */
  allowTrim?: boolean;
  /**
   * Trim mode
   *
   * @default {@link TrimMode.TRIM}
   * @see {@link TrimMode}
   * @see {@link allowTrim}
   */
  trimMode?: TrimMode;
  /**
   * Threshold alpha value
   *
   * @default 0
   */
  alphaThreshold?: number;
  /**
   * Remove file extensions from frame names
   *
   * @default false
   */
  removeFileExtension?: boolean;
  /**
   * Prepend folder name to frame names
   *
   * @default true
   */
  prependFolderName?: boolean;
  /**
   * Output file format
   *
   * @default {@link TextureFormat.PNG}
   * @see {@link TextureFormat}
   */
  textureFormat?: TextureFormat;
  /**
   * Export texture as base64 string to atlas meta tag
   *
   * @default false
   */
  base64Export?: boolean;
  /**
   * Scale size and positions in atlas
   *
   * @default 1
   */
  scale?: number;
  /**
   * Texture scaling method
   *
   * @default ScaleMethod.BILINEAR
   */
  scaleMethod?: ScaleMethod;
  /**
   * "Tinify" texture using TinyPNG
   *
   * @default false
   */
  tinify?: boolean;
  /**
   * TinyPNG key
   *
   * @default empty string
   */
  tinifyKey?: string;
  /**
   * Type of packer
   * @see PackerType
   * @default {@link PackerType.MAX_RECTS_BIN}
   */
  packer?: PackerType;
  /**
   * Pack method
   *
   * @default {@link MaxRectsBinMethod.BEST_SHORT_SIDE_FIT}
   * @see MaxRectsBinMethod
   * @see MaxRectsPackerMethod
   */
  packerMethod?: PackerMethods;
  /**
   * Name of predefined exporter (), or custom exporter (see below)
   *
   * @default JsonHash
   */
  exporter?: PackerExporterType | PackerExporter;
  /**
   * Bitmap filter type
   *
   * @see BitmapFilterType
   * @default {@link BitmapFilterType.NONE}
   */
  filter?: BitmapFilterType;
  /**
   * External application info.
   * Required fields: url and version
   *
   * @default null
   */
  appInfo?: any;
  suffix?: string;
  suffixInitialValue?: number;
}

export enum ScaleMethod {
  BILINEAR = 'BILINEAR',
  NEAREST_NEIGHBOR = 'NEAREST_NEIGHBOR',
  HERMITE = 'HERMITE',
  BEZIER = 'BEZIER',
}

/**
 * Texture packer uses {@link http://mustache.github.io/ | mustache} template engine.
 * Look at documentation how to create custom exporter:
 * {@link https://www.npmjs.com/package/free-tex-packer-core#custom-exporter}
 */
export interface PackerExporter {
  /**
   * File extension
   */
  fileExt: string;
  /**
   * Path to template file (content could be used instead)
   * @see {@link content}
   */
  template?: string;
  /**
   * Template content (template path could be used instead)
   * @see {@link template}
   */
  content?: string;
}



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
