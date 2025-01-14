const fs = require("fs");
const path = require("path");
const { default: inquirer } = require("inquirer");
const { getProjectPath, exec } = require("../../../utils");
const registry = require("../../../../config.json").registry;
const steRegistry = require("../../../../config.json")["ste-registry"];



async function insertStellarUi(workPath) {
  // 安装npm包
  await exec(`npm install stellar-ui-plus -S --registry=${steRegistry}`, workPath);
  // 在pages.json中添加easycom对象
  const pagesJsonPath = path.resolve(workPath, "pages.json");
  const fileData = fs.readFileSync(pagesJsonPath);
  let pagesJson = fileData.toString("utf-8");
  // 删除意外的注释
  pagesJson = pagesJson.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
  const pagesJsonObj = JSON.parse(pagesJson);
  if (!pagesJsonObj["easycom"]) pagesJsonObj["easycom"] = { "autoscan": true, "custom": { "ste-(.*)": "stellar-ui-plus/components/ste-$1/ste-$1.vue" } }
  // 写入pages.json
  const data = JSON.stringify(pagesJsonObj, null, 2)
  fs.writeFileSync(pagesJsonPath, data);
  // 在APP.vue中引入添加style
  const appVuePath = path.resolve(workPath, "App.vue");
  const fileData2 = fs.readFileSync(appVuePath);
  let appVue = fileData2.toString("utf-8");
  appVue = appVue.replace("<style>", `<style lang="scss">\n@import 'stellar-ui-plus/common/css/common.scss';\n`);
  fs.writeFileSync(appVuePath, appVue);
}

async function insertAxios(workPath) {
  // 安装npm包
  await exec(`npm install axios -S --registry=${registry}`, workPath);
}

async function setAppid(workPath) {
  const appids = await inquirer.prompt([
    { type: "input", name: "wxappid", message: "微信小程序appid（选填）：" },
    { type: "input", name: "aliappid", message: "支付宝小程序appid（选填）：" }
  ])
  const { wxappid, aliappid } = appids;
  if (!wxappid && !aliappid) return;
  // 读取manifest.json
  const manifestPath = path.resolve(workPath, "manifest.json");
  const fileData = fs.readFileSync(manifestPath);
  let manifest = fileData.toString("utf-8");
  // 删除意外的注释
  manifest = manifest.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
  const manifestJson = JSON.parse(manifest);
  if (!manifestJson["mp-weixin"]) manifestJson["mp-weixin"] = { "appid": "", "usingComponents": true }
  if (!manifestJson["mp-alipay"]) manifestJson["mp-alipay"] = { "appid": "", "usingComponents": true }
  if (wxappid) manifestJson["mp-weixin"]["appid"] = wxappid;
  if (aliappid) manifestJson["mp-alipay"]["appid"] = aliappid;
  // 写入manifest.json
  const data = JSON.stringify(manifestJson, null, 2)
  fs.writeFileSync(manifestPath, data);
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
  await setAppid(workPath);
}

exports.getPluginsUni3 = getPluginsUni3;

exports.insetPluginsUni3 = insetPlugins;