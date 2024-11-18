// 将当前目录下包括子孙目录下的所有类型文件都以txt的格式预加载到内存，方便后续使用
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const loadFiles = async (dir, filesList = []) => {
  const files = await readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileName = path.basename(filePath);
    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      await loadFiles(filePath, filesList);
    } else {
      const content = await readFile(filePath, 'utf8');
      filesList.push({ fileName, filePath, content });
    }
  }
  return filesList;
}
const vue2Map = {}
loadFiles(path.join(__dirname, "./vue2")).then(filesList => {
  filesList.forEach(item => {
    vue2Map[item.fileName] = item.content
  })
})

exports.vue2Map = vue2Map

const vue3Map = {}
loadFiles(path.join(__dirname, "./vue3")).then(filesList => {
  filesList.forEach(item => {
    vue3Map[item.fileName] = item.content
  })
})

exports.vue3Map = vue3Map

