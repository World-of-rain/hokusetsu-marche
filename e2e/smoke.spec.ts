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

test("フッターからプライバシーポリシーへ遷移でき、AdSense開示がある", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "プライバシーポリシー" }).click();
  await expect(page.getByRole("heading", { name: "プライバシーポリシー", level: 1 })).toBeVisible();
  await expect(page.getByText("Google AdSense").first()).toBeVisible();
});

test("使い方ガイド・運営者情報ページが開ける", async ({ page }) => {
  await page.goto("/guide");
  await expect(page.getByRole("heading", { name: "使い方ガイド", level: 1 })).toBeVisible();
  await page.goto("/about");
  await expect(
    page.getByRole("heading", { name: "運営者情報・お問い合わせ", level: 1 })
  ).toBeVisible();
});

test("商品タップで詳細シートが開き、グラフ・店舗リンク・閉じるが機能する", async ({ page }) => {
  await page.goto("/");
  await page.getByText("卵", { exact: true }).first().click();

  await expect(page.getByRole("button", { name: "閉じる" })).toBeVisible();
  await expect(page.getByText("過去30日の価格推移")).toBeVisible();
  // 店舗リンクは STORE_LINKS（config）のURLを使う
  const storeLink = page.getByRole("link", { name: /チラシを見る/ });
  await expect(storeLink).toBeVisible();
  await expect(storeLink).toHaveAttribute("href", /tokubai\.co\.jp|satake-takenoko/);

  await page.getByRole("button", { name: "閉じる" }).click();
  await expect(page.getByRole("button", { name: "閉じる" })).toBeHidden();
});

test("詳細シートを下にドラッグすると閉じる", async ({ page }) => {
  await page.goto("/");
  await page.getByText("卵", { exact: true }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  const box = await dialog.boundingBox();
  if (!box) throw new Error("dialog box not found");
  // シート上部からしっかり下方向へドラッグ（しきい値110pxを超える）
  const startX = box.x + box.width / 2;
  const startY = box.y + 20;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) {
    await page.mouse.move(startX, startY + i * 45);
  }
  await page.mouse.up();

  await expect(page.getByRole("button", { name: "閉じる" })).toBeHidden();
});

test("お気に入りの星をタップすると状態が切り替わり、リロード後も維持される", async ({ page }) => {
  await page.goto("/");
  const star = page.getByRole("button", { name: /お気に入りに追加/ }).first();
  await star.click();
  await expect(page.getByRole("button", { name: /お気に入りから外す/ }).first()).toBeVisible();

  // localStorage永続化の確認
  await page.reload();
  await expect(page.getByRole("button", { name: /お気に入りから外す/ }).first()).toBeVisible();
});

test("日付セルのタップでその日の詳細が開く", async ({ page }) => {
  await page.goto("/");
  // 底値カレンダーの「火」セル（価格あり）をタップ
  await page.getByText("198円").first().click();
  await expect(page.getByRole("button", { name: "閉じる" })).toBeVisible();
  // 日付バッジが表示される
  await expect(page.locator("h3", { hasText: "卵" })).toBeVisible();
});
