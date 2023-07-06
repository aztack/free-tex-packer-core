const fs = require('fs');
const { pack } = require('../../dist/index.js');
console.log(pack)
const $path = require('path');
const images = ['sar.png', 'igloo-tools.png', 'igloo-picture-books.jpeg', 'gameplus.png'];

pack(images.map(name => {
  const path = `../images/logos/${name}`;
  return { path, contents: fs.readFileSync($path.resolve(__dirname, path)) }
}), {
  textureName: 'output',
  exporter: 'COCOS2D'
}, (files, error) => {
  if (error) {
    console.error('Packaging failed', error);
  } else {
    for (let item of files) {
      console.log(`Saving ${item.name}`);
      fs.writeFileSync($path.resolve(__dirname, item.name), item.buffer);
    }
  }
});
