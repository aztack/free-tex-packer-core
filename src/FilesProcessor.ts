import Jimp from "jimp";
import PackProcessor from "./PackProcessor";
import TextureRenderer from "./utils/TextureRenderer";
// import tinify from "tinify";
import { startExporter } from "./exporters";
import { PackerExporter, TexturePackerOptions } from ".";

export interface ResultItem {
  data: any;
  buffer: Jimp;
}

export interface ResultFile {
  name: string;
  buffer: Buffer;
}

export default class FilesProcessor {
  static start( images: any[], options: TexturePackerOptions, callback: (files: ResultFile[]) => void, errorCallback?: (error: any) => void): void {
    PackProcessor.pack(images, options, (res) => {
        let packResult: ResultItem[] = [];
        let resFiles: ResultFile[] = [];
        let readyParts = 0;

        for (let data of res) {
          new TextureRenderer(data, options, (renderResult) => {
            packResult.push({
              data: renderResult.data,
              buffer: renderResult.buffer,
            });

            if (packResult.length >= res.length) {
              const suffix = options.suffix;
              let ix = options.suffixInitialValue;
              for (let item of packResult) {
                let fName =
                  options.textureName +
                  (packResult.length > 1 ? suffix + ix : "");

                FilesProcessor.processPackResultItem(
                  fName,
                  item,
                  options,
                  (files) => {
                    resFiles = resFiles.concat(files);
                    readyParts++;
                    if (readyParts >= packResult.length) {
                      callback(resFiles);
                    }
                  }
                );

                ix++;
              }
            }
          });
        }
      }, (error) => {
        if (errorCallback) errorCallback(error);
      }
    );
  }

  static processPackResultItem(
    fName: string,
    item: ResultItem,
    options: TexturePackerOptions,
    callback: (files: ResultFile[]) => void
  ): void {
    let files: ResultFile[] = [];

    let pixelFormat = options.textureFormat == "png" ? "RGBA8888" : "RGB888";
    let mime =
      options.textureFormat == "png" ? Jimp.MIME_PNG : Jimp.MIME_JPEG;

    item.buffer.getBuffer(mime, (err, srcBuffer) => {
      FilesProcessor.tinifyImage(srcBuffer, options, (buffer) => {
        let opts = {
          imageName: fName + "." + options.textureFormat,
          imageData: buffer.toString("base64"),
          format: pixelFormat,
          textureFormat: options.textureFormat,
          imageWidth: item.buffer.bitmap.width,
          imageHeight: item.buffer.bitmap.height,
          removeFileExtension: options.removeFileExtension,
          prependFolderName: options.prependFolderName,
          base64Export: options.base64Export,
          scale: options.scale,
          appInfo: options.appInfo,
          trimMode: options.trimMode,
        };

        files.push({
          name: fName + "." + (options.exporter as PackerExporter).fileExt,
          buffer: Buffer.from(
            startExporter(options.exporter, item.data, opts)
          ),
        });

        if (!options.base64Export) {
          files.push({
            name: fName + "." + options.textureFormat,
            buffer: buffer,
          });
        }

        callback(files);
      });
    });
  }

  static tinifyImage(buffer: Buffer, options: TexturePackerOptions, callback: (result: Buffer) => void): void {
    callback(buffer);
    // if (!options.tinify) {
    //   callback(buffer);
    //   return;
    // }

    // tinify.key = options.tinifyKey;

    // tinify.fromBuffer(buffer).toBuffer(function (err, result) {
    //   if (err) throw err;
    //   // @ts-ignore
    //   callback(result);
    // });
  }
}
