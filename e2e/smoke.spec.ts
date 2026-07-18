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

test("同じ日に複数店舗の特売があるとカレンダーと詳細に両方表示され、正式名も出る", async ({
  page,
}) => {
  await page.goto("/");
  // 底値カレンダーの今日セルに2店舗ぶんの価格（178/188）が並ぶ
  await expect(page.getByText("188円").first()).toBeVisible();

  // 今日セルをタップ → 詳細に「取扱店」一覧と raw_item_name（正式名）が出る
  await page.getByText("178円").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText(/の取扱店/)).toBeVisible();
  await expect(dialog.getByText("ダイエー 豊中店")).toBeVisible();
  await expect(dialog.getByText("国産たまご Mサイズ 10個入")).toBeVisible();
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

test("詳細シートから情報の誤りを通報できる（理由選択UI）", async ({ page }) => {
  await page.goto("/");
  await page.getByText("卵", { exact: true }).first().click();
  await expect(page.getByRole("button", { name: "閉じる" })).toBeVisible();

  await page.getByRole("button", { name: /情報が違う場合は報告する/ }).click();
  await expect(page.getByText("どこが違いますか？")).toBeVisible();

  const submit = page.getByRole("button", { name: "報告する" });
  await expect(submit).toBeDisabled();
  await page.getByRole("button", { name: "価格が違う" }).click();
  await expect(submit).toBeEnabled();
});

test("Yahoo照合済み商品はJAN付きの商品リンクとクレジットが表示される", async ({ page }) => {
  await page.goto("/");
  // ストックのアコーディオンを開いてスーパードライの詳細を表示
  await page.getByText("お酒", { exact: true }).click();
  await page.getByText("スーパードライ").first().click();

  const dialog = page.getByRole("dialog");
  const yahooLink = dialog.getByRole("link", { name: /Yahoo!ショッピングで商品を見る/ });
  await expect(yahooLink).toBeVisible();
  await expect(yahooLink).toHaveAttribute("href", /store\.shopping\.yahoo\.co\.jp/);
  await expect(dialog.getByText(/JAN 4901004000001/)).toBeVisible();

  // フッターにYahoo APIのクレジット表記（規約必須）
  await page.getByRole("button", { name: "閉じる" }).click();
  await expect(page.getByRole("link", { name: "Web Services by Yahoo! JAPAN" })).toBeVisible();
});

test("単位あたり価格が総合リストと詳細シートに注記表示され、単価ソートが選べる", async ({
  page,
}) => {
  await page.goto("/");
  // 総合リストの価格の下に単価注記が出る
  await expect(page.getByText("1個あたり128円").first()).toBeVisible();
  await expect(page.getByText("100gあたり109.3円").first()).toBeVisible();

  // 並び順に「単位あたりが安い順」を選んでもリストが表示され続ける（デフォルトは実売価格）
  const sortSelect = page.getByRole("combobox", { name: "並び順" });
  await expect(sortSelect).toHaveValue("price");
  await sortSelect.selectOption("unit_price");
  await expect(page.getByText("キャベツ（1玉）").first()).toBeVisible();
  await expect(page.getByText("豚こま切れ（300g）").first()).toBeVisible();
  await sortSelect.selectOption("price");

  // 底値カレンダーの卵詳細にも単価注記が出る
  await page.getByText("卵", { exact: true }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText(/1個あたり1[57]\.8円/)).toBeVisible();
});

test("底値カレンダーの品目とストック枠のカテゴリをユーザーが選べて、選択が維持される", async ({
  page,
}) => {
  await page.goto("/");
  const cal = page.locator("section").filter({ hasText: "1週間底値カレンダー" }).first();
  await expect(cal.getByText("牛乳", { exact: true })).toBeVisible();

  // 品目ピッカーで牛乳を外す → カレンダーから消える
  await cal.getByRole("button", { name: "表示する品目を選ぶ" }).click();
  await cal.getByRole("button", { name: /牛乳/ }).click();
  await cal.getByRole("button", { name: "表示する品目を選ぶ" }).click(); // パネルを閉じる
  await expect(cal.getByText("牛乳", { exact: true })).toBeHidden();
  await expect(cal.getByText("卵", { exact: true })).toBeVisible();

  // リロードしても選択が維持される（localStorage永続化）
  await page.reload();
  const cal2 = page.locator("section").filter({ hasText: "1週間底値カレンダー" }).first();
  await expect(cal2.getByText("卵", { exact: true })).toBeVisible();
  await expect(cal2.getByText("牛乳", { exact: true })).toBeHidden();

  // ストック枠: カテゴリピッカーでお酒を外す → グループごと消える
  const stock = page.locator("section").filter({ hasText: "ストック・まとめ買いのチャンス" }).first();
  await expect(stock.getByRole("button", { name: /お酒.*件あり/ })).toBeVisible();
  await stock.getByRole("button", { name: "表示するカテゴリを選ぶ" }).click();
  await stock.getByRole("button", { name: "✓ お酒" }).click();
  await expect(stock.getByRole("button", { name: /お酒.*件あり/ })).toBeHidden();
});

test("SEO: 構造化データ（WebSite/ItemList/FAQPage）とFAQが出力される", async ({ page }) => {
  await page.goto("/");
  const topLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(topLd).toContain('"WebSite"');
  expect(topLd).toContain('"ItemList"');

  await page.goto("/guide");
  await expect(page.getByRole("heading", { name: /よくある質問/ })).toBeVisible();
  await expect(page.getByText("Q. 情報はいつ更新されますか？")).toBeVisible();
  const guideLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(guideLd).toContain('"BreadcrumbList"');
  expect(guideLd).toContain('"FAQPage"');
});

test("日付セルのタップでその日の詳細が開く", async ({ page }) => {
  await page.goto("/");
  // 底値カレンダーの「火」セル（価格あり）をタップ
  await page.getByText("198円").first().click();
  await expect(page.getByRole("button", { name: "閉じる" })).toBeVisible();
  // 日付バッジが表示される
  await expect(page.locator("h3", { hasText: "卵" })).toBeVisible();
});
