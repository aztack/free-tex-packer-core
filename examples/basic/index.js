const fs = require('fs');
const texturePacker = require("../..");
const images = ['sar.png', 'igloo-tools.png', 'igloo-picture-books.jpeg', 'gameplus.png'];

texturePacker(images.map(name => {
  const path = `../images/logos/${name}`;
  return { path, contents: fs.readFileSync(path) }
}), {
  textureName: 'output',
  exporter: 'COCOS2D'
}, (files, error) => {
  if (error) {
    console.error('Packaging failed', error);
  } else {
    for (let item of files) {
      console.log(`Saving ${item.name}`);
      fs.writeFileSync(`./${item.name}`, item.buffer);
    }
  }
});
