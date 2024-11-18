const fs = require("fs");
const { exec, execName, convertPath } = require("../../utils");
const mkdir = require("./mkdir");
const { getType, getGitpath } = require("./type.js");
const packagejs = require("./package.js");
const initGit = require("./init-git.js");
const setVue2 = require("./setting/vue2.js");
const setVue3 = require("./setting/vue3.js");

module.exports = async function (name, params) {
  console.log(`正在创建项目: ${name}`);
  const projectName = await mkdir(name);
  if (!projectName) return;
  let type = Object.keys(params)[0];
  if (!type) type = await getType();

  console.log(`正在下载模板: ${type}...`);
  // 克隆项目
  const gitpath = getGitpath(type);
  await exec(`git clone ${gitpath} ${projectName}`);

  // 删除默认的.git 文件夹
  const gitdir = convertPath(`${process.cwd()}/${projectName}/.git`);
  if (fs.existsSync(gitdir)) {
    await exec(`${execName("rmdir")} ${gitdir}`);
  }
  // 初始化package.json
  await packagejs(projectName);
  // 初始化git
  await initGit(projectName);

  switch (type) {
    case "vue2":
      await setVue2(projectName);
      break;
    case "vue3":
      await setVue3(projectName);
      break;

    default:
      break;
  }

  console.log(`创建项目成功: ${projectName}`);
};
