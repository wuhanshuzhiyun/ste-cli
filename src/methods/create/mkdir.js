const inquirer = require("inquirer").default;
const fs = require("fs");
const { exec, execName, getProjectPath } = require("../../utils");

module.exports = async (projectName) => {
  let name = projectName || "";
  // 判断项目名称是否为空
  while (!name) {
    // 提示用户输入项目名称
    name = (
      await inquirer.prompt([
        { type: "input", name: "name", message: "请输入项目名称:" },
      ])
    ).name;
  }

  let workPath = getProjectPath(projectName);
  if (fs.existsSync(workPath)) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "error",
        message: "已存在同名项目",
        choices: ["取消", "覆盖"],
      },
    ]);
    if (answer.error === "取消") {
      console.log("已取消创建项目");
      return;
    }
    if (answer.error === "覆盖") {
      await exec(`${execName("rmdir")} ${workPath}`);
    }
  }
  fs.mkdirSync(workPath);
  return name;
};
