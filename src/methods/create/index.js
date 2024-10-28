const fs = require("fs");
const { exec, execName, convertPath } = require("../../utils");
const mkdir = require("./mkdir");
const { getType, getGitpath } = require("./type.js");
const packagejs = require("./package.js");

module.exports = async function (name, params) {
  console.log(`正在创建项目: ${name}`);
  const _name = await mkdir(name);
  if (!_name) return;
  let type = Object.keys(params)[0];
  if (!type) {
    type = await getType();
  }

  console.log(`正在下载模板: ${type}...`);
  // 克隆项目
  const gitpath = getGitpath(type);
  await exec(`git clone ${gitpath} ${_name}`);
  

  // 删除默认的.git 文件夹
  const gitdir = convertPath(`${process.cwd()}/${_name}/.git`);
  if (fs.existsSync(gitdir)) {
    await exec(`${execName("rmdir")} ${gitdir}`);
  }
  // 初始化package.json
  await packagejs(_name);
  console.log(`创建项目成功: ${_name}`);
};
