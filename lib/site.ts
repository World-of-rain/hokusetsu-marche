// サイト全体で共有するメタ情報。
// 独自ドメイン移行時は Cloudflare Pages の環境変数 NEXT_PUBLIC_SITE_URL を変更する
// （public/robots.txt と public/sitemap.xml のURLも合わせて書き換えること）。
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hokusetsu-marche.pages.dev";
export const SITE_NAME = "北摂マルシェ";
export const SITE_TITLE = "北摂マルシェ 〜豊南エリア特売情報〜";
export const SITE_DESCRIPTION =
  "豊南エリアのスーパー（ライフ・ダイエー・サタケ・万代など）のチラシ情報をAIが毎日集約。卵・牛乳などの底値カレンダー、今日の目玉品、価格推移グラフでいつ・どこで買うのが一番お得かが一目でわかります。";

// お問い合わせ先メールアドレス。Cloudflare Pages の環境変数で設定する
// （AdSense審査では連絡手段の明示が推奨されるため、申請前に必ず設定すること）
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";

// Google AdSense クライアントID（例: ca-pub-1234567890123456）。
// 設定すると全ページの<head>に審査用・配信用スクリプトが挿入される
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

// トップページの広告ユニットのスロットID（AdSense管理画面で発行）。
// 未設定なら広告枠は描画されない。自動広告のみ使う場合は設定不要。
export const ADSENSE_SLOT_TOP = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || "";
export const ADSENSE_SLOT_BOTTOM = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || "";
