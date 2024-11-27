# 安装

```
npm install -g ste-cli
```

## 使用

```
stellar create [options] [projectName]
```

### 简写

- `stellar`可使用`ste`代替
- `create`可使用`c`代替

## 功能

### 查看帮助

```shell
stellar --help
# 简写
stellar -h
```

### 查看版本

```shell
stellar --version
# 简写
stellar -v
```

### 创建项目

```shell
stellar create [options] [projectName]
# 简写
ste c [options] [projectName]
```

- 查看`options`选项

```shell
stellar create --help
# 简写
ste c --help
```

### options

- `-u2` `--uniapp2` 创建 uniapp-vue2.x 项目
- `-u3` `--uniapp3` 创建 uniapp-vue3.x 项目
- `-u3-vs` `--uniapp3-vscode` 创建 uniapp-vue3.x 项目，支持可使用 vscode 开发
- `-v2` `--vue2` 创建 vue2 项目
- `-v3` `--vue3` 创建 vue3 项目
