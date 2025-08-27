// backend/vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",       // 后端测试环境
    include: ["tests/**/*.test.js"], // 测试文件放在 tests 目录
    exclude: ["node_modules"], // 排除依赖
    coverage: {
      provider: "c8",
      reporter: ["text", "lcov"],
      lines: 80,
      functions: 80,
      branches: 70,
    },
  },
});
