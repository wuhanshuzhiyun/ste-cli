const { exec } = require("child_process");
const process = require("process");

/**
 * 执行指令
 * @param {string} cmd
 * @returns
 */
exports.exec = function (cmd, dir, print = true) {
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

    if (dir) rsyncProcess = exec(cmd, { cwd: dir }, callback);
    else rsyncProcess = exec(cmd, callback);
    if (!print) return; // 不打印

    const printMessage = (event, data, ...arg) => {
      if (data) console.log(event, data, ...arg);
    };

    rsyncProcess.stdout.on("data", (...arg) => printMessage("stdout:", ...arg));
    rsyncProcess.stderr.on("data", (...arg) => printMessage("stderr:", ...arg));
    rsyncProcess.on("close", (...arg) => printMessage("close:", ...arg));
  });
};

/**
 * 获取指令
 * @param {'rmdir'|'rmfile'|'mkdir'|'cp'|'mv' |'dir'} name
 */
exports.execName = function (name) {
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
  }
  return "";
};

/**
 * 转换路径
 */
exports.convertPath = function (path) {
  const isWindows = process.platform === "win32";
  return isWindows ? path.replace(/\//g, "\\") : path;
};
