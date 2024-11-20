const { default: inquirer } = require("inquirer");
const { getProjectPath, exec } = require("../../utils");

module.exports = function initGit(projectName) {
  return new Promise((resolve, reject) => {
    const workPath = getProjectPath(projectName);
    inquirer
      .prompt({
        type: "confirm",
        name: "initGit",
        message: "是否初始化git仓库？",
      })
      .then(async (answers) => {
        if (answers.initGit) {
          console.log("初始化git仓库 ...");
          // 初始化git仓库
          await exec("git init", workPath);
          resolve();
        } else {
          resolve();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
