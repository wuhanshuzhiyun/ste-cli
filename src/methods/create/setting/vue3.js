function setVue3(projectName) {
  return new Promise(async (resolve, reject) => {
    try {
      const workPath = getProjectPath(projectName);
      // 让用户选择插件，多选[ts, eslint, sass]
      const answers = await inquirer.prompt({
        type: "checkbox",
        name: "plugins",
        message: "请选择需要安装的插件",
        choices: ["typescript", "sass", "axios", "element-ui"],
      });

      // 根据用户选择的插件，安装对应的依赖
      const { plugins } = answers;
      if (plugins.includes("typescript")) {
        console.log("安装 typescript ...");
        // await insertTs(workPath);
        console.log("安装 typescript 完成\n\n\n");
      }
      if (plugins.includes("sass")) {
        // 安装 sass
        console.log("安装 sass ...");
        // await insertSass(workPath);
        console.log("安装 sass 完成\n\n\n");
      }
      if (plugins.includes("axios")) {
        // 安装 axios
        console.log("安装 axios ...");
        // await insertAxios(workPath);
        console.log("安装 axios 完成\n\n\n");
      }
      if (plugins.includes("element-ui")) {
        // 安装 element-ui
        console.log("安装 element-ui ...");
        // await insertElementUi(workPath);
        console.log("安装 element-ui 完成\n\n\n");
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}


module.exports = setVue3;