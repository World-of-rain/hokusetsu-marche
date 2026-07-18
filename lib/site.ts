// サイト全体で共有するメタ情報。
// 各値は Cloudflare Pages の環境変数で上書きできるが、環境変数が消えても
// 正しく動くよう、実運用のドメイン等をフォールバック既定値にしている
// （public/robots.txt と public/sitemap.xml も同じドメインに揃えること）。
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hokusetsu-marche.com";
export const SITE_NAME = "北摂マルシェ";
// 検索されやすい地名（豊中・庄内・服部）と行動語（特売・チラシ）をタイトルに含める。
// ブランド名を先頭に置き、重要語を前方に寄せる
export const SITE_TITLE = "北摂マルシェ｜豊中市 庄内・服部のスーパー特売・チラシまとめ";
export const SITE_DESCRIPTION =
  "大阪府豊中市の庄内・服部エリアのスーパー（ライフ・ダイエー・サタケ・万代など）の特売チラシをAIが毎日自動で集約。卵・牛乳・食パンの底値カレンダー、今日の目玉品、過去30日の価格推移グラフで「いつ・どこで買うのが一番お得か」が一目でわかる無料の特売情報サイトです。";

// お問い合わせ先メールアドレス。Cloudflare Email Routing で受信する。
// 別のローカルパートにする場合は NEXT_PUBLIC_CONTACT_EMAIL で上書きする。
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@hokusetsu-marche.com";

// トップページが表示するエリアタグ。KV（Pages Function /api/prices/{area}）の
// 読み出しキーになる。データのエリアに合わせて設定する（環境変数で上書き可）。
export const DEFAULT_AREA = process.env.NEXT_PUBLIC_DEFAULT_AREA || "shonai";

// Google AdSense クライアントID（公開情報。HTMLに埋め込まれる）。
// 設定すると全ページの<head>に審査用・配信用スクリプトと検証メタタグが挿入される。
// 環境変数で上書き可能だが、既定値を入れておくことで環境変数なしでも申請要件を満たす。
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-3893504806371860";

// トップページの広告ユニットのスロットID（AdSense管理画面で発行）。
// 未設定なら広告枠は描画されない。自動広告のみ使う場合は設定不要。
export const ADSENSE_SLOT_TOP = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || "";
export const ADSENSE_SLOT_BOTTOM = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || "";
