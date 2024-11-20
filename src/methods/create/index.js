const fs = require("fs");
const { exec, execName, convertPath } = require("../../utils");
const { mkdir, getProjectName } = require("./mkdir");
const { getType, getGitpath } = require("./type.js");
const packagejs = require("./package.js");
const initGit = require("./init-git.js");
const { getPluginsVue2, insetConfigVue2 } = require("./setting/vue2.js");
const { getPluginsVue3, insetConfigVue3 } = require("./setting/vue3.js");

module.exports = async function (name, params) {
  console.log(`正在创建项目: ${name}`);
  const projectNameConfig = await getProjectName(name);
  if (!projectNameConfig) return;
  const { projectName, delProject } = projectNameConfig;
  let type = Object.keys(params)[0];
  if (!type) type = await getType();
  let plugins = [];
  let insetConfig = (projectName, plugins) => { }
  switch (type) {
    case "vue2":
      plugins = await getPluginsVue2();
      insetConfig = insetConfigVue2
      break;
    case "vue3":
      plugins = await getPluginsVue3();
      insetConfig = insetConfigVue3
      break;

    default:
      break;
  }
  // 初始化git


  console.log(`正在创建项目: ${type}...`);
  await mkdir(projectName, delProject);
  // 克隆项目
  await exec(`git clone ${getGitpath(type)} ${projectName}`);
  await insetConfig(projectName, plugins);

  // 删除默认的.git 文件夹
  const gitdir = convertPath(`${process.cwd()}/${projectName}/.git`);
  if (fs.existsSync(gitdir)) {
    await exec(`${execName("rmdir")} ${gitdir}`);
  }
  // 初始化package.json
  await packagejs(projectName);
  // 初始化git仓库
  await initGit(projectName);





  console.log(`创建项目成功: ${projectName}`);
};
