const { default: inquirer } = require("inquirer");
const path = require("path");
const { vue3Map } = require("../../../../static");
const { getProjectPath, exec, execName, convertPath, writeFile, } = require("../../../utils");
const registry = require("../../../../config.json").registry;

async function insertTs(workPath) {
  // 安装npm包
  await exec(`npm install typescript @vue/cli-plugin-typescript -D --registry=${registry}`, workPath);
  // 删除main.js
  await exec(`${execName("rmfile")} ${convertPath(workPath + "/src/main.js")}`);
  // 写入main.ts
  await writeFile(path.join(workPath, "/src/main.ts"), vue3Map["main.ts"])
  // 删除/src/router/index.js
  await exec(`${execName("rmfile")} ${convertPath(workPath + "/src/router/index.js")}`);
  // 删除/src/store/index.js
  await exec(`${execName("rmfile")} ${convertPath(workPath + "/src/store/index.js")}`);
  // 删除jsconfig.json
  await exec(`${execName("rmfile")} ${convertPath(workPath + "/jsconfig.json")}`);
  // 将vue2Map["router.ts"]写入到workPath/src/router目录下
  await writeFile(path.join(workPath, "/src/router/index.ts"), vue3Map["router.ts"])
  // 将vue2Map["store.ts"]写入到workPath/src/store目录下
  await writeFile(path.join(workPath, "/src/store/index.ts"), vue3Map["store.ts"])
  // 写入tsconfig.json
  await writeFile(path.join(workPath, "/tsconfig.json"), vue3Map["tsconfig.json"])
  // 写入shims-vue.d.ts
  await writeFile(path.join(workPath, "/src/shims-vue.d.ts"), vue3Map["shims-vue.d.ts"])
}


async function insertSass(workPath) {
  // 安装npm包
  await exec(`npm install sass-loader sass -D --registry=${registry}`, workPath);
}

async function insertAxios(workPath) {
  // 安装npm包
  await exec(`npm install axios -S --registry=${registry}`, workPath);
}

async function insertElementUi(workPath) {
  // 安装npm包
  await exec(`npm install element-plus -S --registry=${registry}`, workPath);
}



function getPluginsVue3() {
  return new Promise(async (resolve, reject) => {
    try {
      // 让用户选择插件
      const answers = await inquirer.prompt({
        type: "checkbox",
        name: "plugins",
        message: "请选择需要安装的插件",
        choices: ["typescript", "sass", "axios", "element-plus"],
      });

      // 根据用户选择的插件，安装对应的依赖
      const { plugins } = answers;
      resolve(plugins);
    } catch (error) {
      reject(error);
    }
  });
}

async function insetConfig(projectName, plugins) {
  const workPath = getProjectPath(projectName);
  if (plugins.includes("typescript")) {
    console.log("安装 typescript ...");
    await insertTs(workPath);
    console.log("安装 typescript 完成\n\n\n");
  }
  if (plugins.includes("sass")) {
    // 安装 sass
    console.log("安装 sass ...");
    await insertSass(workPath);
    console.log("安装 sass 完成\n\n\n");
  }
  if (plugins.includes("axios")) {
    // 安装 axios
    console.log("安装 axios ...");
    await insertAxios(workPath);
    console.log("安装 axios 完成\n\n\n");
  }
  if (plugins.includes("element-plus")) {
    // 安装 element-plus
    console.log("安装 element-plus ...");
    await insertElementUi(workPath);
    console.log("安装 element-plus 完成\n\n\n");
  }
}

exports.getPluginsVue3 = getPluginsVue3;

exports.insetConfigVue3 = insetConfig;