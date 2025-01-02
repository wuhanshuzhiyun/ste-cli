const path = require("path");
const { default: inquirer } = require("inquirer");
const { getProjectPath, exec, execName, writeFile } = require("../../../utils");
const { uni3vsMap } = require("../../../../static");
const registry = require("../../../../config.json").registry;
const steRegistry = require("../../../../config.json")["ste-registry"];



async function insertStellarUi(workPath) {
  // 安装npm包
  await exec(`pnpm install stellar-ui-plus -S --registry=${steRegistry}`, workPath);
}

async function insertAxios(workPath) {
  // 安装npm包
  await exec(`pnpm install axios -S --registry=${registry}`, workPath);
}

async function insertTypeScript(workPath) {
  // 将uni3vsMap["shims-vue.d.ts"]写入到workPath/src/router目录下
  await writeFile(path.join(workPath, "/src/shims-vue.d.ts"), uni3vsMap["shims-vue.d.ts"])
  // 将src目录下的main.js修改为main.ts
  await exec(`${execName("rename")} main.js main.ts`, path.join(workPath, "/src"));
  // 将uni3vsMap["index.html"]写入到workPath目录下
  await writeFile(path.join(workPath, "/index.html"), uni3vsMap["index.html"])
}

const choices = [
  { name: "typescript", value: "typescript" },
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
  if (plugins.includes("typescript")) {
    // 安装 typescript
    console.log("安装 typescript ...");
    await insertTypeScript(workPath);
    console.log("安装 typescript 完成\n\n\n");
  }
}

exports.getPluginsUni3Vscode = getPluginsUni3;

exports.insetPluginsUni3Vscode = insetPlugins;