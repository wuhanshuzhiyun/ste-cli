const inquirer = require("inquirer").default;

const types = require("../../../config.json").gitpaths;

exports.getType = async function () {
  // 选择框架
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "请选择框架",
      choices: [...new Set(types.map((item) => item.framework))],
    },
  ]);
  // 选着版本
  const _types = types.filter((item) => item.framework === answer.framework);
  const versions = await inquirer.prompt([
    {
      type: "list",
      name: "versions",
      message: `请选择【${answer.framework}】项目版本`,
      choices: _types.map((item) => item.desc),
    },
  ]);
  return _types.find((item) => item.desc === versions.versions).value;
};

exports.getGitpath = function (type) {
  return types.find((item) => item.value === type).gitpath;
};
