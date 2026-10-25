# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

北摂（豊中・庄内周辺）のスーパー特売情報サイト「北摂マルシェ」のフロントエンド。Next.js（Pages Router）の
静的エクスポートを Cloudflare Pages で配信する。データはバックエンド `World-of-rain/smart_pantry`
（NAS 上で稼働）が作る。コード・コメント・コミットメッセージは日本語。

**ユーザーへの回答・報告はすべて日本語で行う。**

## コマンド

```bash
npm ci
npm run dev            # 開発サーバ（API_URL 未設定なら localhost:8000 を読みに行き、失敗すればサンプルデータ）
npm run lint           # eslint（next/core-web-vitals + next/typescript + prettier）
npm run typecheck      # tsc --noEmit
npm run format:check   # prettier（printWidth 100, ダブルクォート, trailingComma es5）。直すときは npm run format
npm run build          # scripts/gen-sitemap.mjs で public/sitemap.xml を更新してから next build → out/
```

CI（`.github/workflows/ci.yml`）は lint → typecheck → format:check → モック API でビルド → Playwright スモークの順。手元で同じことをするには:

```bash
node scripts/mock-api.mjs &                                         # :8123 にモックAPI
API_URL=http://127.0.0.1:8123/api/prices/shonai npx next build      # out/ を作る
npx playwright test                                                 # out/ を :8124 で配信して e2e/ を実行
npx playwright test -g "トップページ"                                # 1テストだけ
```

- E2E は**ビルド済みの `out/`** に対して走る（`scripts/serve-static.mjs`）。ソースを変えたら先にビルドし直す
- ブラウザをダウンロードせず既存の Chromium を使うときは `CHROMIUM_EXECUTABLE=/path/to/chromium` を付ける
- ユニットテストは無い。E2E は「ビルドは通るが画面が壊れている」を拾う最小限のスモークに留める方針

## アーキテクチャ

### データの流れ（2段構え）

1. **ビルド時**: `pages/index.tsx` の `getStaticProps` → `lib/db.ts` の `fetchSaleData()` が `API_URL`（バックエンドの `/api/prices/<area>`）を取得し、zod で検証してページに焼き込む。取得失敗・検証失敗・全セクション空のときは `SAMPLE_DATA` でビルドを通す（ビルドは止めない）
2. **表示後**: `lib/useLiveData.ts` の `useLiveDashboardData` が Pages Function `/api/prices/<area>` を叩き、Cloudflare KV（binding `SALE_DATA`、キー `prices:<area>`）の最新 JSON に差し替える。404/503・検証失敗・全空のときはビルド時データのまま

KV へは NAS 側が抽出完了ごと・毎朝5時に書き込むので、**データ更新に再ビルドは不要**。毎朝5時の再ビルドは日付ラベルと sitemap の lastmod を進めるため。

### スキーマはバックエンドと対

`lib/types.ts` の zod スキーマ（`DashboardResponseSchema` / `LiveDashboardSchema`）は smart_pantry の `dashboard.py` の Pydantic モデル（`DashboardResponse` ほか）と対になっている。フィールドを増減するときは両リポジトリを更新する。未知のフィールドは zod が黙って除去するので、バックエンド先行の追加ではビルドは壊れない。逆にフロントで必須フィールドを足すと、バックエンドが追いつくまで検証に落ちてサンプル/ビルド時データへフォールバックする。モックデータ `scripts/mock-api.mjs` も同じ形に揃える。

### Cloudflare 側

- `functions/` は Cloudflare Pages Functions（Next.js の API ルートではない。`output: "export"` なので Next のサーバ機能は使えない）
  - `functions/api/prices/[area].ts` … KV を読んで返すだけ。area は `^[\w-]{1,50}$` のみ許可
  - `functions/api/report.ts` … 詳細シートの「情報が違う」通報を受けて KV に `report:` 接頭辞で積む（IP ごとのレート制限・重複排除、`TURNSTILE_SECRET` があれば Turnstile 検証）。NAS が1時間ごとに取り込んで LLM 再チェックを経て補正する。フロントから DB は直接触らない
- `wrangler.toml` に KV バインディングを定義（本番・プレビューとも同じ KV）。`main` への push で Cloudflare Pages が自動ビルド・デプロイ
- `public/sw.js` … 本番だけ登録される Service Worker（静的アセットは stale-while-revalidate、`/api/prices/*` は network-first）。キャッシュの形を変えたら `CACHE_NAME` を上げる

### 画面

- `pages/index.tsx` … トップ（「まちの朝市新聞」の紙面）。ヒーロー（大見出し・本日のまとめ・今日の一押しの値札・数字の柱）→ 流れる帯 → 01 底値カレンダー `daily` → 02 目玉品 `highlights` → 03 ストック `stocks` → 04 総合リスト `general` → 05 店舗の索引 → 06 しくみ → 07 よくある質問。「今日・明日・今週」の切り替え（`DayTabs`）は 02 と 04 に同じ状態で2つ置く
- `pages/stores/[slug].tsx` … 店舗別ページ（`lib/storeLinks.ts` の `slug`）。その店の底値・目玉品・日別の特売一覧。ビルド時のデータで書き出し、表示後に KV の最新データへ差し替える。店舗を足すときは `STORE_LINKS` と `scripts/gen-sitemap.mjs` の `STORE_SLUGS` の両方に足す
- `about` / `guide` / `privacy` は `components/DocPage.tsx`、見つからないページは `pages/404.tsx`
- 表示設定などの端末ごとの保存は `lib/useLocalStorage.ts`

### デザインの決まり

- 色は `tailwind.config.js` のトークン（`paper` 紙・`ink` 墨・`persimmon` 柿・`leaf` 若葉・`mustard` 芥子・`plum`）だけを使う。柿色は白抜き・地の上の小さな文字のどちらでも 4.5:1 以上になる深さにしてある（変えるときはコントラスト比を計算する）
- フォントは `lib/fonts.ts`（next/font の自己ホスト）。取り込むのは見出しの明朝（`font-display`）と数字の欧文（`.num`）だけ。本文は端末のゴシック。日本語の本文フォントを取り込むと、分割ファイルが届くたびの組み直しで低速の端末の描画が数秒遅れた（Lighthouse スマホ 67 → 外して 98）
- スクロールで現れる演出は `data-reveal`（`lib/useReveal.ts`）。`.js` クラスがあるときだけ効き、JS が動かない環境（クローラ）や動きを減らす設定では最初から見える。書き出した HTML に中身が必ず入るようにする
- 価格は `components/Yen.tsx`（数字は `.num`、「円」は小さく）

### SEO・AI 検索（SAO）

- 構造化データ: トップは Organization / WebSite / WebPage / ItemList / FAQPage、店舗ページは BreadcrumbList / GroceryStore（等）/ ItemList、読み物は BreadcrumbList（ガイドは FAQPage も）。**いずれもページに表示している内容と一致させる**
- よくある質問は `lib/faq.ts` の1か所から、トップ・ガイドの表示と FAQPage の両方を作る
- 本日のまとめ（`lib/summary.ts`）は自然文でページ本文に書き出す。JS を動かさない AI クローラもそのまま引用できる
- `public/llms.txt` … AI 向けのサイト案内（ページと店舗の一覧・引用時の注意）。店舗を足したらここにも足す

### 環境変数

ビルド時: `API_URL`、`ALLOW_EMPTY_DATA`、`NEXT_PUBLIC_SITE_URL`（sitemap・構造化データ）、`NEXT_PUBLIC_DEFAULT_AREA`、`NEXT_PUBLIC_ADSENSE_*`、`NEXT_PUBLIC_CONTACT_EMAIL`。

## 補足

- `public/icons/` と `public/og-image.png` は `scripts/generate-assets.mjs` で生成してコミットした成果物
- Dependabot はマイナー・パッチを週1でまとめて PR にする（メジャーは対象外）
- バックエンドの現状・運用・制約は smart_pantry の `HANDOVER.md` / `OPERATIONS.md` にある。この環境からは公開サイト `hokusetsu-marche.com` に繋がらない（プロキシが 403）
