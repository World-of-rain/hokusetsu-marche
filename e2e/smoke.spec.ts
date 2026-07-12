import { test, expect } from "@playwright/test";

// モックAPI（scripts/mock-api.mjs）のデータでビルドした out/ に対するスモークテスト。
// 「ビルドは通るが画面が壊れている」を検出するのが目的なので、最小限に保つ。

test("トップページが表示され、主要セクションが描画される", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /北摂マルシェ/ })).toBeVisible();
  // 底値カレンダー（モックの卵）
  await expect(page.getByText("卵", { exact: true }).first()).toBeVisible();
  // 目玉品
  await expect(page.getByText("豚バラ肉").first()).toBeVisible();
  // 総合リスト
  await expect(page.getByText("キャベツ（1玉）").first()).toBeVisible();
});

test("商品タップで詳細シートが開き、グラフ・店舗リンク・閉じるが機能する", async ({ page }) => {
  await page.goto("/");
  await page.getByText("卵", { exact: true }).first().click();

  await expect(page.getByRole("button", { name: "閉じる" })).toBeVisible();
  await expect(page.getByText("過去30日の価格推移")).toBeVisible();
  await expect(page.getByRole("link", { name: /チラシページを開く/ })).toBeVisible();

  await page.getByRole("button", { name: "閉じる" }).click();
  await expect(page.getByRole("button", { name: "閉じる" })).toBeHidden();
});

test("日付セルのタップでその日の詳細が開く", async ({ page }) => {
  await page.goto("/");
  // 底値カレンダーの「火」セル（価格あり）をタップ
  await page.getByText("198円").first().click();
  await expect(page.getByRole("button", { name: "閉じる" })).toBeVisible();
  // 日付バッジが表示される
  await expect(page.locator("h3", { hasText: "卵" })).toBeVisible();
});
