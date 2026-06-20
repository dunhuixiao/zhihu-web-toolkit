import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "知乎网页工具箱",
        namespace: "https://github.com/dunhuixiao/zhihu-web-toolkit",
        match: ["https://www.zhihu.com/*"],
        "run-at": "document-end",
        grant: "none",
        description: "一个用于清理和优化知乎网页界面的模块化工具箱。",
      },
      build: {
        fileName: "zhihu-web-toolkit.user.js",
      },
    }),
  ],
});
