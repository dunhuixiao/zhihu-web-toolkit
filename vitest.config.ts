import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    restoreMocks: true,
    setupFiles: ["tests/setup.ts"],
    environmentOptions: {
      jsdom: {
        url: "https://www.zhihu.com/",
      },
    },
  },
});
