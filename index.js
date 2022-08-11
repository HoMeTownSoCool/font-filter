(function (global, targetTextDir = './text.txt') {
  const GLOBAL = global;
  const Fontmin = require("fontmin");
  const fs = require("fs");
  const path = require("path");
  let timer = null;

  /**
   * 检测目录
   * @param {String} src 目录地址
   */
  function statDir(src) {
    try {
      var stat = fs.statSync(path.join(__dirname, src));
      return stat.isFile() || stat.isDirectory();
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * 删除目录
   * @param {string} dir 目录地址
   */
  function rmDir(dir) {
    let files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
      let newPath = path.join(dir, files[i]);
      let stat = fs.statSync(newPath);
      if (stat.isDirectory()) {
        rmDir(newPath);
      } else {
        fs.unlinkSync(newPath);
      }
    }
    fs.rmdirSync(dir); //如果文件夹是空的，就将自己删除掉
  }

  /**
   * path处理
   * @param {String} path 地址
   */
  function pathCheck(path) {
    if (Object.prototype.toString.call(path) === "[object String]") {
      return true;
    }
    return false;
  }

  /**
   * 读取文件
   */
  function fsReadText() {
    fs.readFile(targetTextDir, "utf-8", function (err, data) {
      if (err) {
        console.error(err);
        return;
      } else {
        fontFilter(`${data}`)
      }
    });
  }

  /**
   *
   * @param {String} text 过滤文本
   */
  function fontFilter(text, src = "fonts/*.ttf", dest = "build/fonts") {
    if (!pathCheck(src) || !pathCheck(dest)) {
      console.error("src || dest error!");
      return;
    }
    if (statDir(dest)) {
      rmDir(dest);
    }
    timer = setTimeout(() => {
      var fontmin = new Fontmin().src(src).dest(dest).use(
        Fontmin.glyph({
          text,
        })
      );
      fontmin.run(function (err, files) {
        if (err) {
          throw err;
        }
      });
      clearTimeout(timer);
    }, 400);
  }

  fsReadText();
})(globalThis);
