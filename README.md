# Travel Match · 旅行搭子测试

一个用来快速了解旅行同伴默契度的小测试，React + Vite 构建。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 部署

本项目已配置 [`netlify.toml`](./netlify.toml)，可直接连接 Netlify 自动部署：
构建命令 `npm run build`，发布目录 `dist`。

## 项目结构

```
src/
  data/        题库、人格描述等静态数据
  utils/       计分、编解码等纯函数逻辑
  components/  可复用 UI 组件
  pages/       Home / Quiz / Result 三个页面
  App.jsx      页面路由（本地状态切换）
```
