import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "zhihu-web-toolkit",
        namespace: "https://github.com/",
        match: ["https://www.zhihu.com/*"],
        "run-at": "document-end",
        grant: "none",
        description: "A modular toolkit for cleaning up Zhihu web UI.",
      },
      build: {
        fileName: "zhihu-web-toolkit.user.js",
      },
    }),
  ],
});
