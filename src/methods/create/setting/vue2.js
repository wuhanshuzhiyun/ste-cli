const { default: inquirer } = require("inquirer");
const config = require("../../../../config.json");
const path = require("path");
const { vue2Map } = require("../../../../static");
const { getProjectPath, exec, execName, convertPath, writeFile, } = require("../../../utils");

async function insertTs(workPath) {
  const selfStaticPath = path.resolve(__dirname, "/static/vue2/");
  // await exec(`${execName("cp")} -r ${convertPath(selfStaticPath + "/shims-vue.d.ts")} ${convertPath(workPath + "/src")}`);
  // 设置npm源地址
  // await exec(`npm config set registry ${config.registry}`);
  // 安装npm包
  await exec(`npm install vue-class-component -S`, workPath);
  await exec(`npm install typescript @vue/cli-plugin-typescript -D`, workPath);
  // 删除main.js
  await exec(`${execName("rmfile")} ${convertPath(workPath + "/src/main.js")}`);
  // 将vue2Map["main.ts"]写入到workPath/src目录下
  await writeFile(path.join(workPath, "/src/main.ts"), vue2Map["main.ts"])
  // 将vue2Map["shims-vue.d.ts"]写入到workPath/src目录下
  await writeFile(path.join(workPath, "/src/shims-vue.d.ts"), vue2Map["shims-vue.d.ts"])
  // 将vue2Map["tsconfig.json"]写入到workPath目录下
  await writeFile(path.join(workPath, "/tsconfig.json"), vue2Map["tsconfig.json"])
  // 将src/router/index.js重命名为src/router/index.ts
  await exec(`${execName("rename")} ${convertPath(workPath + "/src/router/index.js")} ${convertPath(workPath + "/src/router/index.ts")}`);
  // 将src/store/index.js重命名为src/store/index.ts
  await exec(`${execName("rename")} ${convertPath(workPath + "/src/store/index.js")} ${convertPath(workPath + "/src/store/index.ts")}`);
}

module.exports = function setVue2(projectName) {
  return new Promise(async (resolve, reject) => {
    try {
      const workPath = getProjectPath(projectName);
      // 让用户选择插件，多选[ts, eslint, sass]
      const answers = await inquirer.prompt({
        type: "checkbox",
        name: "plugins",
        message: "请选择需要安装的插件",
        choices: ["typescript", "vuex", "router", "eslint", "sass", "axios", "element-ui"],
      });

      // 根据用户选择的插件，安装对应的依赖
      const { plugins } = answers;
      if (plugins.includes("typescript")) {
        console.log("安装 typescript");
        await insertTs(workPath);
      }
      if (plugins.includes("vuex")) {
        // 安装 vuex
        console.log("安装 vuex");
      }
      if (plugins.includes("router")) {
        // 安装 vue-router
        console.log("安装 vue-router");
      }
      if (plugins.includes("eslint")) {
        console.log("安装 eslint");
      }
      if (plugins.includes("sass")) {
        // 安装 sass
        console.log("安装 sass");
      }
      if (plugins.includes("axios")) {
        // 安装 axios
        console.log("安装 axios");
      }
      if (plugins.includes("element-ui")) {
        // 安装 element-ui
        console.log("安装 element-ui");
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
