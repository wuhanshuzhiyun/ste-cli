#!/usr/bin/env node
const version = require("../package.json").version;

const commander = require("commander");

const create = require("../src/methods/create");

const program = new commander.Command();





program
  .command("create [name]")
  .alias("c")
  .option("-u2, --uniapp2", "创建uniapp-vue2项目")
  .option("-u3, --uniapp3", "创建uniapp-vue3项目")
  .option("-v2, --vue2", "创建vue2项目")
  .option("-v3, --vue3", "创建vue3项目")
  .action(async (...args) => {
    try {
      await create(...args)
    } catch (error) {
      console.log("终止创建项目！")
    }
  })

// 查看版本
program.version(version, "-v, --version", "查看当前版本")

try {
  program.parse(process.argv);
} catch (error) {

}


// Try the following:
//    node options-negatable.js
//    node options-negatable.js --sauce
//    node options-negatable.js --cheese=blue
//    node options-negatable.js --no-sauce --no-cheese
