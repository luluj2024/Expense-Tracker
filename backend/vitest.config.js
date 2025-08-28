import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",       
    include: ["tests/**/*.test.js"], 
    exclude: ["node_modules"], 
    coverage: {
      provider: "c8",
      reporter: ["text", "lcov"],
      lines: 80,
      functions: 80,
      branches: 70,
    },
  },
});
