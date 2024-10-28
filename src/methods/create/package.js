const fs = require("fs");
const { exec, convertPath } = require("../../utils");

module.exports = async (projectName) => {
  const workPath = convertPath(`${process.cwd()}/${projectName}`);
  // 判断目录中是否存在package.json文件
  const packageJsonPath = convertPath(`${workPath}/package.json`);
  const isPackageJsonExist = fs.existsSync(packageJsonPath);
  if (!isPackageJsonExist) {
    // 如果不存在，则创建package.json文件
    console.log(`初始化package.json`)
    await exec(`npm init -y`, workPath, false);
  } else {
    // 读取package.json文件内容
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    // 设置package.json文件中的name字段
    packageJson.name = projectName;
    // 将package.json文件内容写回文件
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf-8"
    );
  }
};
