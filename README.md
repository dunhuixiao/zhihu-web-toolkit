# zhihu-web-toolkit

`zhihu-web-toolkit` 是一个模块化的 Tampermonkey 用户脚本，用于清理知乎网页版界面，并重建一个更轻量的顶部导航。

项目使用 TypeScript、Vite 和 `vite-plugin-monkey` 构建，产物为 `dist/zhihu-web-toolkit.user.js`。

## 功能

- 重建知乎顶部 Header，并移除原生 Header 的 fixed/sticky 定位影响。
- 保留知乎主页、关注、推荐、热榜、搜索、消息、私信、个人头像和 `.css-ruapjk` 等顶部入口。
- 对消息、私信和个人头像使用真实原生触发器移动，保留知乎 Popover 菜单的正确锚点位置。
- 对普通导航和搜索使用 clone/proxy 策略，降低对知乎 React 节点的侵入。
- 隐藏配置中的侧边栏卡片、创作入口、盐选卡片、广告卡片、页脚、写回答区域和原始顶部 Header。
- 添加悬浮工具按钮：
  - 屏蔽词管理入口（当前为占位入口）。
  - 深色/浅色主题切换。
  - 回到顶部。
- 暴露调试 API：`window.__zhihuWebToolkit`。

## 安装使用

先安装依赖并构建用户脚本：

```bash
npm install
npm run build
```

然后在 Tampermonkey 中安装或导入：

```text
dist/zhihu-web-toolkit.user.js
```

脚本匹配范围为：

```text
https://www.zhihu.com/*
```

## 开发命令

```bash
npm run dev
npm run typecheck
npm run test
npm run build
```

- `npm run dev`：启动 Vite 开发服务。
- `npm run typecheck`：运行 TypeScript 类型检查。
- `npm run test`：运行 Vitest/jsdom 测试。
- `npm run build`：生成 Tampermonkey 用户脚本到 `dist/`。

## 项目结构

```text
src/main.ts                         用户脚本入口，只负责安装工具箱
src/toolkit.ts                      工具箱生命周期、apply/destroy/report 编排
src/features/header-toolkit/        Header 重建、节点查找、移动和代理逻辑
src/features/hide-elements/         隐藏样式生成与注入
src/features/floating-controls/     悬浮控制按钮、主题切换、回到顶部
src/shared/                         常量、DOM 工具、状态和公开类型
tests/                              Vitest/jsdom 测试与 fixture
dist/                               构建产物，请勿手动编辑
```

## 调试 API

安装后可在知乎页面控制台使用：

```js
window.__zhihuWebToolkit.report();
window.__zhihuWebToolkit.apply();
window.__zhihuWebToolkit.destroy();
```

`report()` 会返回当前状态，包括是否在知乎页面、是否找到原 Header、是否生成重建 Header、悬浮控件是否存在、隐藏目标的数量与可见数量、保留的 Header 入口、缺失项以及 `.css-ruapjk` 是否已移动。

## 验证建议

普通源码改动至少运行：

```bash
npm run typecheck
npm run test
```

影响构建配置、入口、用户脚本 metadata 或依赖时，再运行：

```bash
npm run build
npm audit --audit-level=moderate
```

涉及真实知乎 DOM 的改动，建议在已登录的 `https://www.zhihu.com/` 页面注入最新 `dist/zhihu-web-toolkit.user.js`，并检查：

- 重建 Header 只存在一次。
- 原始 `AppHeader`/顶部 banner 已隐藏。
- 配置的隐藏选择器 `visibleCount` 为 `0`。
- `.css-ruapjk` 位于重建 Header 内且可见。
- Header 不是 fixed，能随页面滚动。
- 消息、私信、头像菜单从新 Header 的对应入口附近展开。
- `window.__zhihuWebToolkit.report()` 输出正常。

## 注意事项

- 不要手动编辑 `dist/`，请通过 `npm run build` 生成。
- `src/zhihu-web-toolkit.console.js` 是历史控制台脚本/手动测试参考，不建议在其中新增功能。
- 浏览器验证只应做 DOM 注入、可见性、滚动、菜单定位和调试 API 检查。
- 不要读取或依赖 cookies、localStorage、sessionStorage、保存的密码或账号隐私状态。
