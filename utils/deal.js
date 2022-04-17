const sharp = require("sharp");
const fs = require("fs");
const target = process.argv[2];
const targetDir = `./deal/${target}`;
//匹配图片
const imgRegExp = new RegExp(`.(jpg|jpeg|png)`, "i");
const outDir = `${targetDir}_img`;
var ProgressBar = require("progress");
const time = new Date().getTime();
function clear() {
  const had = fs.existsSync(outDir);
  if (had) {
    const files = fs.readdirSync(outDir);
    files.forEach(function (file) {
      fs.unlinkSync(`${outDir}/${file}`);
    });
  } else {
    fs.mkdirSync(`${outDir}`);
  }
}

function reanmeAction() {
  let names = fs.readdirSync(targetDir); //获取文件名
  names = names.filter((item) => {
    return imgRegExp.test(item);
  });
  let list = [...names];
  const newNames = [];
  var bar = new ProgressBar("reanmeAciton: [:bar]", {
    total: list.length,
    complete: "*",
  });
  const change = () => {
    const name = list.pop();
    if (name) {
      const nameRegExp = new RegExp(`.{0,}\\.`);
      const newName = name.replace(nameRegExp, `${list.length}_${time}.`);
      const hadName = fs.renameSync(
        `${targetDir}/${name}`,
        `${targetDir}/${newName}`
      );
      newNames.push(newName);
      bar.tick();
      change();
    } else {
      console.log("改名 success");
      sharpAcion([...newNames]);
    }
  };
  change();
}

function sharpAcion(list, bar) {
  if (bar) {
    bar.tick();
  } else {
    bar = new ProgressBar("sharpAcion: [:bar]", {
      total: list.length,
      complete: "*",
    });
  }
  const newName = list.pop();
  if (newName) {
    sharp(`${targetDir}/${newName}`)
      .metadata()
      .then(({ width, height }) =>
        sharp(`${targetDir}/${newName}`)
          .resize({
            width,
            height: parseInt(height * 0.95),
            fit: sharp.fit.cover,
            position: "top",
          })
          .composite([{ input: "./utils/2.jpeg", gravity: "southeast" }])
          .sharpen()
          .toFile(`${outDir}/${newName}`)
      )
      .then((e) => {
        sharpAcion(list, bar);
      });
  } else {
    console.log("水印 success");
    zipAction();
  }
}

clear();
reanmeAction();

function zipAction() {
  const archiver = require("archiver");
  const encrypted = require("archiver-zip-encrypted");
  archiver.registerFormat("zip-encrypted", encrypted);

  const outPath = `${targetDir}.niuniu`;
  const out = fs.createWriteStream(outPath);
  const archive = archiver.create("zip-encrypted", {
    zlib: {
      level: 8,
    },
    encryptionMethod: "aes256",
    password: "1024",
  });
  // 压缩文件夹
  archive.directory(outDir, false);
  archive.pipe(out);
  const inter = setInterval(() => {
    console.log(archive.pointer());
  }, 1000);
  out.on("close", () => {
    clearInterval(inter);
    console.log("压缩完成", archive.pointer() / 1024 / 1024 + "M");
  });

  archive.on("error", (err) => {
    console.log("压缩失败!");
    throw err;
  });
  archive.finalize();
}
