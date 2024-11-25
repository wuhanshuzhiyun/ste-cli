#!/usr/bin/env node
const version = require("../package.json").version;

const commander = require("commander");

const create = require("../src/methods/create");

const program = new commander.Command();

program
  .command("create [name]")
  .alias("c")
  .option("-u2, --uniapp2", "创建uniapp-vue2.x项目")
  .option("-u3, --uniapp3", "创建uniapp-vue3.x项目")
  .option("-u3-vs, --uniapp3-vscode", "创建uniapp-vue3.x项目，支持可使用vscode开发")
  .option("-v2, --vue2", "创建vue2项目")
  .option("-v3, --vue3", "创建vue3项目")
  .action(async (...args) => {
    try {
      await create(...args)
    } catch (error) {
      const e = String(error)
      if (e.indexOf("User") != -1) {
        console.log("终止创建")
      } else {
        console.log(e)
      }
    }
  })

// 查看版本
program.version(version, "-v, --version", "查看当前版本")

try {
  program.parse(process.argv);
} catch (error) {

}

