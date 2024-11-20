const sys = require("child_process");
const fs = require("fs");
const process = require("process");

/**
 * 执行指令
 * @param {string} cmd
 * @param {string} dir
 * @param {boolean} print
 * @returns
 */
function exec(cmd, dir, print = false) {
  return new Promise((resolve, reject) => {
    const callback = (error, stdout, stderr) => {
      console.log(stdout);
      if (error) {
        console.log(`Command Error: ${cmd}`);
        reject(error);
        return;
      }
      if (stderr) {
        resolve(stderr);
        return;
      }
      resolve(stdout);
    };

    let rsyncProcess = null;

    if (dir) rsyncProcess = sys.exec(cmd, { cwd: dir }, callback);
    else rsyncProcess = sys.exec(cmd, callback);
    if (!print) return; // 不打印

    const printMessage = (event, data, ...arg) => {
      if (data) console.log(event, data, ...arg);
    };

    rsyncProcess.stdout.on("data", (...arg) => printMessage("stdout:", ...arg));
    rsyncProcess.stderr.on("data", (...arg) => printMessage("stderr:", ...arg));
    rsyncProcess.on("close", (...arg) => printMessage("close:", ...arg));
  });
}

/**
 * 获取指令
 * @param {'rmdir'|'rmfile'|'mkdir'|'cp'|'mv' |'dir' | 'rename'} name
 */
function execName(name) {
  const isWindows = process.platform === "win32";
  switch (name) {
    case "rmdir":
      return isWindows ? "rmdir /s /q" : "rm -rf";
    case "rmfile":
      return isWindows ? "del" : "rm -rf";
    case "mkdir":
      return isWindows ? "mkdir" : "mkdir -p";
    case "cp":
      return isWindows ? "copy" : "cp";
    case "mv":
      return isWindows ? "move" : "mv";
    case "dir":
      return isWindows ? "dir" : "ls";
    case "rename":
      return isWindows ? "ren" : "mv";
  }
  return "";
}

/**
 * 转换路径
 */
function convertPath(path) {
  const isWindows = process.platform === "win32";
  return isWindows ? path.replace(/\//g, "\\") : path;
}

/**
 * 获取当前项目绝对路径
 */
function getProjectPath(projectName) {
  return convertPath(`${process.cwd()}/${projectName}`);
}

/**
 * 将内容写入文件
 * @param {string} filePath 
 * @param {string} content 
 * @returns 
 */
function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) reject(err);
      resolve();
    });
  })
}

exports.exec = exec;
exports.convertPath = convertPath;
exports.getProjectPath = getProjectPath;
exports.execName = execName;
exports.writeFile = writeFile;
