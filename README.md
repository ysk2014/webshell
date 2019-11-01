# web termianl

![GitHub Logo](webshell.gif)

## 功能

-   可以创建多个 tab 窗口
-   每一个窗口可以创建最多四个 pane，每个 pane 会继承上一个 pane 的 cwd 目录环境
-   可以切换主题，共有 156 个主题可以选择

## 主要用途

-   可以部署自己的开发机，方便登录操作
-   代码简单，可以以此作为扩展

## 开发

```js
npm install
npm run dev

cd assets

npm install

npm start
```

## 部署

```js
npm run build

// 默认端口：3000
node ./bin/webshell

//修改端口
node ./bin/webshell --port 3001

//如果使用pm2
pm2 start ./bin/webshell -- --port 3001
```
