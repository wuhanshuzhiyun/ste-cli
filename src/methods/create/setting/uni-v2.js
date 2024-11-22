const fs = require("fs");
const path = require("path");
const { default: inquirer } = require("inquirer");
const { getProjectPath, exec } = require("../../../utils");
const registry = require("../../../../config.json").registry;
const steRegistry = require("../../../../config.json")["ste-registry"];



async function insertStellarUi(workPath) {
  // 安装npm包
  await exec(`npm install stellar-ui -S --registry=${steRegistry}`, workPath);
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
  { name: "stellar-ui", value: "stellar-ui", checked: true },
  { name: "axios", value: "axios" },
]

function getPluginsUni2() {
  return new Promise(async (resolve, reject) => {
    try {
      // 让用户选择插件
      const answers = await inquirer.prompt({
        type: "checkbox",
        name: "plugins",
        message: "请选择需要安装的插件",
        choices,
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
  if (plugins.includes("stellar-ui")) {
    // 安装 stellar-ui
    console.log("安装 stellar-ui ...");
    await insertStellarUi(workPath);
    console.log("安装 stellar-ui 完成\n\n\n");
  }
  await setAppid(workPath)
}

exports.getPluginsUni2 = getPluginsUni2;

exports.insetPluginsUni2 = insetPlugins;