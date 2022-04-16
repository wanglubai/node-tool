// 调用fs和path这两个内置模块
var fs = require("fs");
var path = require("path");
var filePath = path.resolve("./左公子");
fileDisplay(filePath);
function fileDisplay(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err);
    } else {
      //遍历读取到的文件列表
      let i = 0;
      files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var path_ = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(path_, function (eror, stats) {
          if (eror) {
            console.warn("获取文件stats失败");
          } else {
            var isFile = stats.isFile(); //是文件
            var isImg = /(jpg)|(jpeg)|(png)/i.test(path_);
            if (isFile&&isImg) {
              let a = /左公子\./;
              const newPath = path_.replace(
                /左公子.{0,}\./,
                `左公子/${i++}_${new Date().getTime()}.`
              );
              console.log(newPath);
              fs.rename(path_, newPath, () => {});
            }
          }
        });
      });
    }
  });
}
