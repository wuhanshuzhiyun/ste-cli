const { default: inquirer } = require("inquirer");
const path = require("path");
const { vue2Map } = require("../../../../static");
const { getProjectPath, exec, execName, convertPath, writeFile, } = require("../../../utils");

async function insertTs(workPath) {
  // 安装npm包
  await exec(`npm install vue-class-component@7.2.6 -S`, workPath);
  await exec(`npm install typescript @vue/cli-plugin-typescript -D`, workPath);
  // 删除main.js
  await exec(`${execName("rmfile")} ${convertPath(workPath + "/src/main.js")}`);
  // 写入main.ts
  await writeFile(path.join(workPath, "/src/main.ts"), vue2Map["main.ts"])
  // 删除/src/router/index.js
  await exec(`${execName("rmfile")} ${convertPath(workPath + "/src/router/index.js")}`);
  // 删除/src/store/index.js
  await exec(`${execName("rmfile")} ${convertPath(workPath + "/src/store/index.js")}`);
  // 删除jsconfig.json
  await exec(`${execName("rmfile")} ${convertPath(workPath + "/jsconfig.json")}`);
  // 将vue2Map["router.ts"]写入到workPath/src/router目录下
  await writeFile(path.join(workPath, "/src/router/index.ts"), vue2Map["router.ts"])
  // 将vue2Map["store.ts"]写入到workPath/src/store目录下
  await writeFile(path.join(workPath, "/src/store/index.ts"), vue2Map["store.ts"])
  // 写入tsconfig.json
  await writeFile(path.join(workPath, "/tsconfig.json"), vue2Map["tsconfig.json"])
  // 写入shims-vue.d.ts
  await writeFile(path.join(workPath, "/src/shims-vue.d.ts"), vue2Map["shims-vue.d.ts"])
  // 写入shims-tsx.d.ts
  await writeFile(path.join(workPath, "/src/shims-tsx.d.ts"), vue2Map["shims-tsx.d.ts"])
}

async function insertSass(workPath) {
  // 安装npm包
  await exec(`npm install sass-loader sass -D`, workPath);
}

async function insertAxios(workPath) {
  // 安装npm包
  await exec(`npm install axios -S`, workPath);
}

async function insertElementUi(workPath) {
  // 安装npm包
  await exec(`npm install element-ui -S`, workPath);
}


function setVue2() {
  return new Promise(async (resolve, reject) => {
    try {

      // 让用户选择插件，多选[ts, eslint, sass]
      const answers = await inquirer.prompt({
        type: "checkbox",
        name: "plugins",
        message: "请选择需要安装的插件",
        choices: ["typescript", "sass", "axios", "element-ui"],
      });

      // 根据用户选择的插件，安装对应的依赖
      const { plugins } = answers;

      resolve(plugins);
    } catch (error) {
      reject(error);
    }
  });
};

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
  if (plugins.includes("element-ui")) {
    // 安装 element-ui
    console.log("安装 element-ui ...");
    await insertElementUi(workPath);
    console.log("安装 element-ui 完成\n\n\n");
  }
}

exports.setVue2 = setVue2;
exports.insetConfigVue2 = insetConfig;