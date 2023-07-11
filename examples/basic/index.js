const fs = require('fs');
const { pack } = require('../../dist/index.js');
const path = require('path');
const { images, pac } = scanFolder(path.resolve(__dirname, '../images/sheep'));
const options = JSON.parse(fs.readFileSync(path.resolve(__dirname, pac)).toString('utf-8'));

pack(images.map(_path => {
  return { path: _path, contents: fs.readFileSync(path.resolve(__dirname, _path)) }
}), {
  textureName: 'output',
  exporter: 'Cocos2D',
  ...options
}, (files, error) => {
  if (error) {
    console.error('Packaging failed', error);
  } else {
    for (let item of files) {
      console.log(`Saving ${item.name}`);
      fs.writeFileSync(path.resolve(__dirname, item.name), item.buffer);
    }
  }
});

function scanFolder(folderPath) {
  const fileNames = fs.readdirSync(folderPath);
  const images = [];
  let pac = '';

  fileNames.forEach((fileName) => {
    const filePath = path.join(folderPath, fileName);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile()) {
      if (path.extname(filePath) === '.png') {
        images.push(filePath);
      } else if (path.extname(filePath) === '.pac') {
        pac = filePath;
      }
    } else if (fileStat.isDirectory()) {
      const subFolderPaths = scanFolder(filePath);
      images.push(...subFolderPaths);
    }
  });

  return {
    images,
    pac
  };
}