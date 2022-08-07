# Taro 微信小程序最佳实践
## 抖音短视频去水印
### 扫码体验
![小程序码](https://file.ionic.fun/gh_f721ab07b5df_258.jpg)
### 修改配置文件
1. 修改文件 `project.config.json `里面的 `appid`
2. 修改 `config` 文件夹下的 `dev.js` 和 `prod.js` 里面的 `HOST` 改成自己的服务器地址
### 还原包
`yarn`
### 编译成微信小程序
`yarn build:weapp`
#### 使用微信小程序工具打开 当前项目下的 `dist` 文件夹

### 后端源码地址
[后端源码地址](https://github.com/zerox-v/tool-api)



