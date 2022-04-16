const sharp = require("sharp");
const fs = require("fs");
const targetDir = "./左公子";

const path = require("path");
const outDir = `${targetDir}_output`;

function clear() {
  const had = fs.existsSync(outDir);
  if (had) {
    const files = fs.readdirSync(outDir);
    files.forEach(function (file) {
      fs.unlinkSync(`${outDir}/${file}`);
    });
  } else {
    fs.mkdirSync(`${targetDir}_output`);
  }
}

function deal() {
  if (list.length > 0) {
    const item = list.pop();
    const info = {};

    sharp(`${targetDir}/${item}`)
      .metadata()
      .then(({ width, height }) =>
        sharp(`${targetDir}/${item}`)
          .resize({
            width,
            height:parseInt(height * 0.95),
            fit: sharp.fit.cover,
            position: "bottom",
          })
          .sharpen()
          .toFile(`${outDir}/${item}`)
          .then((e) => {
            console.log(JSON.stringify(e));
            deal();
          })
      );
  }
}

function getWh(width, height) {
  return { width, height: parseInt(height * 0.9) };
}

clear();
var filePath = path.resolve(targetDir);
let list = fs.readdirSync(filePath);
list = list.filter((item) => {
  return /(jpg|jpeg)/i.test(item);
});
// console.log(list);
// console.log(list);
deal();
