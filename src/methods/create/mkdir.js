const inquirer = require("inquirer").default;
const fs = require("fs");
const { exec, execName, getProjectPath } = require("../../utils");

async function getProjectName(projectName) {
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
  // 是否删除同名项目
  let delProject = false;
  if (fs.existsSync(workPath)) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "method",
        message: "已存在同名项目",
        choices: ["取消", "重命名", "覆盖(该操作会删除原有项目)"],
      },
    ]);
    if (answer.method === "取消") {
      console.log("已取消创建项目");
      return;
    }
    if (answer.method === "重命名") {
      return (await getProjectName());
    }
    if (answer.method === "覆盖(该操作会删除原有项目)") {
      // 删除已存在的项目
      // 二次确认
      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "该操作会删除原有项目，二次确认",
        }
      ])
      if (answer.confirm) {
        console.log("覆盖原有项目");
        delProject = true
      } else {
        console.log("已取消覆盖项目");
        return
      }
    }
  }
  if (!name) return;
  return { projectName: name, delProject };
};

async function mkdir(projectName, delProject) {
  let workPath = getProjectPath(projectName);
  if (delProject) {
    await exec(`${execName("rmdir")} ${workPath}`);
  }
  fs.mkdirSync(workPath);
}

exports.getProjectName = getProjectName
exports.mkdir = mkdir
