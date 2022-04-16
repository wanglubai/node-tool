const fs = require("fs");
const archiver = require("archiver");
const encrypted = require("archiver-zip-encrypted");
archiver.registerFormat("zip-encrypted", encrypted);

const name = "左公子_output";

const outPath = `${name}.zip`;

const out = fs.createWriteStream(outPath);

const archive = archiver.create("zip-encrypted", {
  zlib: {
    level: 8,
  },
  encryptionMethod: "aes256",
  password: "1024",
});
// 压缩文件夹
archive.directory(name, false);
archive.pipe(out);

out.on("close", () => {
  console.log("压缩完成", archive.pointer() / 1024 / 1024 + "M");
});
archive.on("error", (err) => {
  console.log("压缩失败!");
  throw err;
});
// 打包  promise函数
archive.finalize();
