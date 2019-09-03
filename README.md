# web termianl

![GitHub Logo](webshell.gif)

## 功能

-   可以创建多个 tab 窗口
-   每一个窗口可以创建最多四个 pane，每个 pane 会继承上一个 pane 的 cwd 目录环境
-   可以切换主题，共有 156 个主题可以选择

## 开发

```js
npm run dev

cd assets && npm start
```

## 部署

```
npm run build

node ./bin/webshell
```
