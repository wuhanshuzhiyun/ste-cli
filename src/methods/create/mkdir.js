const inquirer = require("inquirer").default;
const fs = require("fs");
const { exec, execName, getProjectPath } = require("../../utils");

async function mkdir(projectName) {
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

  let workPath = getProjectPath(name);
  if (fs.existsSync(workPath)) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "method",
        message: "已存在同名项目",
        choices: ["取消", "重命名", "覆盖"],
      },
    ]);
    if (answer.method === "取消") {
      console.log("已取消创建项目");
      return;
    }
    if (answer.method === "重命名") {
      return await mkdir();
    }
    if (answer.method === "覆盖") {
      // 删除已存在的项目
      // 二次确认
      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "确定要覆盖已存在的项目吗?",
        }
      ])
      if (answer.confirm) {
        await exec(`${execName("rmdir")} ${workPath}`);
      } else {
        console.log("已取消覆盖项目");
        return
      }
    }
  }
  fs.mkdirSync(workPath);
  return name;
};
module.exports = mkdir