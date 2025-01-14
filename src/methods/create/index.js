const fs = require("fs");
const { exec, execName, convertPath } = require("../../utils");
const { mkdir, getProjectName } = require("./mkdir");
const { getType, getGitpath } = require("./type.js");
const packagejs = require("./package.js");
const initGit = require("./init-git.js");
const { getPluginsVue2, insetPluginsVue2 } = require("./setting/vue2.js");
const { getPluginsVue3, insetPluginsVue3 } = require("./setting/vue3.js");
const { getPluginsUni2, insetPluginsUni2 } = require("./setting/uni-v2.js");
const { getPluginsUni3, insetPluginsUni3 } = require("./setting/uni-v3.js");
const { getPluginsUni3Vscode, insetPluginsUni3Vscode } = require("./setting/uni-v3-vs.js");

module.exports = async function (name, params) {
  const projectNameConfig = await getProjectName(name);
  if (!projectNameConfig) return;
  const { projectName, delProject } = projectNameConfig;
  console.log(`创建项目: ${projectName}`);
  let type = Object.keys(params)[0];
  if (!type) type = await getType();
  let plugins = [];
  let insetPlugins = async (projectName, plugins) => { }
  switch (type) {
    case "vue2":
      plugins = await getPluginsVue2();
      insetPlugins = insetPluginsVue2
      break;
    case "vue3":
      plugins = await getPluginsVue3();
      insetPlugins = insetPluginsVue3
      break;
    case "uniapp2":
      plugins = await getPluginsUni2();
      insetPlugins = insetPluginsUni2
      break;
    case "uniapp3":
      plugins = await getPluginsUni3();
      insetPlugins = insetPluginsUni3
      break;
    case "uniapp3-vscode":
      plugins = await getPluginsUni3Vscode();
      insetPlugins = insetPluginsUni3Vscode
      break;

  }

  console.log(`正在创建${type}项目: ${projectName} ...`);
  await mkdir(projectName, delProject);
  // 克隆项目
  await exec(`git clone ${getGitpath(type)} ${projectName}`);
  // 初始化package.json
  await packagejs(projectName);
  // 插件安装
  await insetPlugins(projectName, plugins);

  // 删除默认的.git 文件夹
  const gitdir = convertPath(`${process.cwd()}/${projectName}/.git`);
  if (fs.existsSync(gitdir)) {
    await exec(`${execName("rmdir")} ${gitdir}`);
  }

  // 初始化git仓库
  await initGit(projectName);
  console.log(`创建项目成功: ${projectName}`);
};
