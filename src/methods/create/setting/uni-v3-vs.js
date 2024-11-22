const { default: inquirer } = require("inquirer");
const { getProjectPath, exec } = require("../../../utils");
const registry = require("../../../../config.json").registry;
const steRegistry = require("../../../../config.json")["ste-registry"];



async function insertStellarUi(workPath) {
  // 安装npm包
  await exec(`npm install stellar-ui-plus -S --registry=${steRegistry}`, workPath);
}

async function insertAxios(workPath) {
  // 安装npm包
  await exec(`npm install axios -S --registry=${registry}`, workPath);
}

const choices = [
  { name: "stellar-ui-plus", value: "stellar-ui-plus", checked: true },
  { name: "axios", value: "axios" },
]
function getPluginsUni3() {
  return new Promise(async (resolve, reject) => {
    try {
      // 让用户选择插件
      const answers = await inquirer.prompt({
        type: "checkbox",
        name: "plugins",
        message: "请选择需要安装的插件",
        choices
      });

      // 根据用户选择的插件，安装对应的依赖
      const { plugins } = answers;
      resolve(plugins);
    } catch (error) {
      reject(error);
    }
  });
}

async function insetPlugins(projectName, plugins) {
  const workPath = getProjectPath(projectName);
  if (plugins.includes("axios")) {
    // 安装 axios
    console.log("安装 axios ...");
    await insertAxios(workPath);
    console.log("安装 axios 完成\n\n\n");
  }
  if (plugins.includes("stellar-ui-plus")) {
    // 安装 stellar-ui-plus
    console.log("安装 stellar-ui-plus ...");
    await insertStellarUi(workPath);
    console.log("安装 stellar-ui-plus 完成\n\n\n");
  }
}

exports.getPluginsUni3Vscode = getPluginsUni3;

exports.insetPluginsUni3Vscode = insetPlugins;