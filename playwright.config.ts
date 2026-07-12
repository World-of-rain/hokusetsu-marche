import { defineConfig } from "@playwright/test";

// ローカルでプリインストール済みChromiumを使う場合は
// CHROMIUM_EXECUTABLE=/path/to/chrome を設定する（CIでは playwright install を使う）
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:8124",
    ...(process.env.CHROMIUM_EXECUTABLE
      ? { launchOptions: { executablePath: process.env.CHROMIUM_EXECUTABLE } }
      : {}),
  },
  webServer: {
    command: "node scripts/serve-static.mjs out 8124",
    url: "http://127.0.0.1:8124",
    reuseExistingServer: !process.env.CI,
  },
});
