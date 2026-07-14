import type { ReactNode } from "react";

// 自前のデュオトーン食材イラスト（SVG）。外部画像に依存せず、ライセンス・リンク切れ・
// オフラインの心配がなく、絵文字より作り込まれた統一感のある見た目にする。
// 各アイコンは viewBox 0 0 48 48。背景タイルは FoodIcon 側で付ける。

export type IconKey =
  | "egg"
  | "milk"
  | "dairy"
  | "bread"
  | "soy"
  | "rice"
  | "noodle"
  | "beef"
  | "pork"
  | "chicken"
  | "fish"
  | "shrimp"
  | "leafveg"
  | "tomato"
  | "rootveg"
  | "apple"
  | "banana"
  | "paper"
  | "detergent"
  | "baby"
  | "seasoning"
  | "curry"
  | "drink"
  | "snack"
  | "sweets"
  | "frozen"
  | "default";

// 各アイコンの「主役色」。タイル背景のグラデーションにも使い、カテゴリの色分けを効かせる。
export const ICON_TINT: Record<IconKey, string> = {
  egg: "#fbbf24",
  milk: "#60a5fa",
  dairy: "#f59e0b",
  bread: "#d19a66",
  soy: "#a3a380",
  rice: "#94a3b8",
  noodle: "#e0a458",
  beef: "#ef4444",
  pork: "#fb7185",
  chicken: "#f59e0b",
  fish: "#38bdf8",
  shrimp: "#fb923c",
  leafveg: "#4ade80",
  tomato: "#ef4444",
  rootveg: "#fb923c",
  apple: "#f43f5e",
  banana: "#facc15",
  paper: "#38bdf8",
  detergent: "#22d3ee",
  baby: "#f9a8d4",
  seasoning: "#a16207",
  curry: "#d97706",
  drink: "#f59e0b",
  snack: "#f97316",
  sweets: "#f472b6",
  frozen: "#38bdf8",
  default: "#f59e0b",
};

// name/category からアイコンキーを推定するキーワード規則。
// バックエンド（LLM選定）が icon を返さない場合のフォールバックにも使う。
const KEYWORD_RULES: [string[], IconKey][] = [
  [["卵", "たまご", "玉子", "タマゴ"], "egg"],
  [["牛乳", "ミルク", "低脂肪乳", "豆乳"], "milk"],
  [["ヨーグルト", "チーズ", "バター", "生クリーム", "乳"], "dairy"],
  [["食パン", "パン", "ベーグル", "トースト", "ロールパン"], "bread"],
  [["納豆", "豆腐", "とうふ", "油揚げ", "厚揚げ", "大豆"], "soy"],
  [["米", "ごはん", "ご飯", "白米", "無洗米"], "rice"],
  [["麺", "うどん", "そば", "ラーメン", "パスタ", "スパゲ", "焼きそば", "中華麺"], "noodle"],
  [["牛肉", "牛", "ステーキ", "ロース", "カルビ", "すき焼"], "beef"],
  [["豚肉", "豚", "ベーコン", "ハム", "バラ肉", "ポーク"], "pork"],
  [["鶏", "チキン", "とり肉", "鳥肉", "手羽", "もも肉", "むね肉", "ささみ"], "chicken"],
  [["ひき肉", "ミンチ", "挽肉", "肉"], "beef"],
  [["鮭", "サーモン", "刺身", "まぐろ", "マグロ", "ぶり", "さば", "あじ", "魚", "切身", "干物"], "fish"],
  [["えび", "エビ", "海老", "いか", "イカ", "たこ", "タコ", "貝", "ホタテ", "かに", "カニ"], "shrimp"],
  [["キャベツ", "レタス", "白菜", "ほうれん草", "小松菜", "ねぎ", "ネギ", "ブロッコリー", "野菜", "きゅうり"], "leafveg"],
  [["トマト", "ミニトマト"], "tomato"],
  [["大根", "にんじん", "人参", "玉ねぎ", "たまねぎ", "じゃがいも", "ごぼう", "さつまいも", "れんこん", "かぼちゃ"], "rootveg"],
  [["りんご", "リンゴ", "みかん", "ぶどう", "いちご", "梨", "もも", "果物", "フルーツ", "柑橘"], "apple"],
  [["バナナ"], "banana"],
  [["トイレットペーパー", "ティッシュ", "ペーパー", "キッチンペーパー"], "paper"],
  [["洗剤", "柔軟剤", "漂白", "石けん", "石鹸", "シャンプー", "ボディ", "ハンドソープ"], "detergent"],
  [["オムツ", "おむつ", "ベビー", "粉ミルク", "おしりふき"], "baby"],
  [["醤油", "味噌", "みそ", "塩", "砂糖", "酢", "ソース", "マヨ", "ケチャップ", "だし", "みりん", "油", "調味", "ドレッシング", "めんつゆ"], "seasoning"],
  [["カレー", "シチュー", "ハヤシ"], "curry"],
  [["ビール", "発泡酒", "チューハイ", "サワー", "ハイボール", "焼酎", "日本酒", "ワイン", "ウイスキー", "酒", "お茶", "ジュース", "コーヒー", "水", "飲料", "コーラ"], "drink"],
  [["ポテチ", "スナック", "せんべい", "おかき", "ナッツ", "チップス"], "snack"],
  [["アイス", "ケーキ", "プリン", "チョコ", "菓子", "スイーツ", "デザート", "ゼリー", "クッキー"], "sweets"],
  [["冷凍", "アイスクリーム"], "frozen"],
];

const CATEGORY_RULES: [string[], IconKey][] = [
  [["肉"], "beef"],
  [["魚", "鮮魚", "海鮮"], "fish"],
  [["野菜", "青果"], "leafveg"],
  [["果物", "フルーツ"], "apple"],
  [["乳", "乳製品"], "dairy"],
  [["日用品", "雑貨"], "detergent"],
  [["飲料", "酒"], "drink"],
  [["菓子", "スイーツ"], "sweets"],
  [["調味料"], "seasoning"],
];

export function pickIconKey(name: string, category?: string): IconKey {
  const n = name || "";
  for (const [kws, key] of KEYWORD_RULES) {
    if (kws.some((k) => n.includes(k))) return key;
  }
  const c = category || "";
  for (const [kws, key] of CATEGORY_RULES) {
    if (kws.some((k) => c.includes(k))) return key;
  }
  return "default";
}

// バックエンドが返した icon 文字列を安全に IconKey へ丸める
export function normalizeIconKey(icon: string | undefined): IconKey | null {
  if (!icon) return null;
  return icon in ICON_TINT ? (icon as IconKey) : null;
}

// ---- 以下、各アイコンの SVG 本体（viewBox 0 0 48 48） -------------------------

const ICONS: Record<IconKey, ReactNode> = {
  egg: (
    <>
      <ellipse cx="24" cy="27" rx="15" ry="12" fill="#fffdf7" stroke="#f1e7cf" strokeWidth="1.2" />
      <path d="M18 16c3-5 9-5 12 0 2 4 0 9-6 9s-8-5-6-9z" fill="#fffdf7" stroke="#f1e7cf" strokeWidth="1.2" />
      <circle cx="24" cy="25" r="6.5" fill="#fbbf24" />
      <circle cx="21.5" cy="22.5" r="2" fill="#fde68a" />
    </>
  ),
  milk: (
    <>
      <path d="M17 18h14v20a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3z" fill="#eaf2ff" stroke="#9cc2f5" strokeWidth="1.4" />
      <path d="M17 18l3-6h8l3 6z" fill="#ffffff" stroke="#9cc2f5" strokeWidth="1.4" />
      <rect x="20.5" y="26" width="7" height="9" rx="1.2" fill="#60a5fa" />
      <path d="M22 12l4 6" stroke="#9cc2f5" strokeWidth="1.4" fill="none" />
    </>
  ),
  dairy: (
    <>
      <path d="M9 30l18-10 12 7v6L21 40 9 34z" fill="#fcd34d" stroke="#eab308" strokeWidth="1.3" />
      <path d="M9 30l12 6 18-9" fill="none" stroke="#eab308" strokeWidth="1.3" />
      <circle cx="20" cy="30" r="2" fill="#fef3c7" />
      <circle cx="27" cy="33" r="1.6" fill="#fef3c7" />
      <circle cx="31" cy="28" r="1.4" fill="#fef3c7" />
    </>
  ),
  bread: (
    <>
      <path d="M12 22c0-5 5-8 12-8s12 3 12 8v13a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2z" fill="#e8b982" stroke="#c68a4e" strokeWidth="1.3" />
      <path d="M12 24h24" stroke="#c68a4e" strokeWidth="1.3" />
      <path d="M16 14c0-3 16-3 16 0" fill="#f3d3a6" stroke="#c68a4e" strokeWidth="1.3" />
    </>
  ),
  soy: (
    <>
      <rect x="12" y="18" width="24" height="18" rx="3" fill="#f4f1e0" stroke="#c9c39a" strokeWidth="1.4" />
      <path d="M12 27h24" stroke="#c9c39a" strokeWidth="1.2" />
      <circle cx="19" cy="22.5" r="1.6" fill="#d9d3ab" />
      <circle cx="29" cy="31.5" r="1.6" fill="#d9d3ab" />
    </>
  ),
  rice: (
    <>
      <path d="M10 26h28c-1 8-7 12-14 12s-13-4-14-12z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" />
      <path d="M14 22c3-3 6 0 10-2 3 2 7-1 10 2" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="24" cy="37" rx="16" ry="2.4" fill="#94a3b8" />
    </>
  ),
  noodle: (
    <>
      <path d="M11 24h26c-1 9-7 14-13 14s-12-5-13-14z" fill="#fde9c8" stroke="#e0a458" strokeWidth="1.4" />
      <path d="M15 20c2-4 5 0 9-3 3 3 7-1 9 3" fill="none" stroke="#eab676" strokeWidth="2" strokeLinecap="round" />
      <rect x="27" y="12" width="2.4" height="16" rx="1.2" transform="rotate(20 27 12)" fill="#c68a4e" />
      <rect x="31" y="12" width="2.4" height="16" rx="1.2" transform="rotate(20 31 12)" fill="#c68a4e" />
    </>
  ),
  beef: (
    <>
      <path d="M15 15c8-4 18-1 18 8s-6 12-13 12S9 30 11 22c1-3 2-5 4-7z" fill="#f26d6d" stroke="#d63d3d" strokeWidth="1.4" />
      <path d="M18 20c5-2 10 0 11 6s-3 8-7 8-8-3-7-8c.4-3 1.5-5 3-6z" fill="#fbcfcf" />
      <circle cx="30" cy="18" r="3" fill="#fff5f5" stroke="#d63d3d" strokeWidth="1.2" />
    </>
  ),
  pork: (
    <>
      <rect x="10" y="17" width="28" height="6" rx="3" fill="#fb7185" stroke="#e11d63" strokeWidth="1.2" />
      <rect x="10" y="17" width="28" height="2.4" rx="1.2" fill="#fecdd8" />
      <rect x="10" y="25" width="28" height="6" rx="3" fill="#fb7185" stroke="#e11d63" strokeWidth="1.2" />
      <rect x="10" y="25" width="28" height="2.4" rx="1.2" fill="#fecdd8" />
    </>
  ),
  chicken: (
    <>
      <path d="M17 14c6-3 12 2 11 9-1 5-5 7-9 6l-3 5c-1 2-4 2-5 0s0-4 2-5l1-2c-3-3-2-9 2-11z" fill="#f0b45a" stroke="#d98c2b" strokeWidth="1.4" />
      <rect x="9" y="30" width="7" height="3.4" rx="1.7" fill="#fff7e6" />
      <rect x="9.5" y="30.2" width="6.5" height="3" rx="1.5" fill="#fdf2d6" />
      <circle cx="24" cy="21" r="2" fill="#fde3b3" />
    </>
  ),
  fish: (
    <>
      <path d="M8 24c6-8 20-8 26 0-6 8-20 8-26 0z" fill="#7dd3fc" stroke="#0ea5e9" strokeWidth="1.4" />
      <path d="M34 24l7-5v10z" fill="#7dd3fc" stroke="#0ea5e9" strokeWidth="1.4" />
      <circle cx="15" cy="23" r="1.8" fill="#0c4a6e" />
      <path d="M20 20c3 2 3 6 0 8M25 21c2 1.5 2 4.5 0 6" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
    </>
  ),
  shrimp: (
    <>
      <path d="M32 14c-10-2-20 4-20 13 0 5 4 9 10 9 8 0 12-6 11-8-2 2-6 3-9 1 6-1 9-5 9-9" fill="#fb923c" stroke="#ea6a10" strokeWidth="1.4" />
      <circle cx="30" cy="17" r="1.6" fill="#7c2d12" />
      <path d="M18 24c3 1 6 1 9 0M18 29c2 1 5 1 8 0" fill="none" stroke="#fed7aa" strokeWidth="1.3" />
    </>
  ),
  leafveg: (
    <>
      <circle cx="24" cy="25" r="14" fill="#86efac" stroke="#22a355" strokeWidth="1.4" />
      <path d="M24 11c-6 3-10 9-9 16M24 11c6 3 10 9 9 16M24 12v25" fill="none" stroke="#4ade80" strokeWidth="1.6" />
      <path d="M14 20c4-2 6-2 10 0" fill="none" stroke="#22a355" strokeWidth="1.3" />
    </>
  ),
  tomato: (
    <>
      <circle cx="24" cy="27" r="13" fill="#ef4444" stroke="#c81e1e" strokeWidth="1.4" />
      <path d="M24 14c-4 0-6-2-6-2M24 14c4 0 6-2 6-2M24 14v3" fill="none" stroke="#3f9142" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 22c2-3 4-4 7-4" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  rootveg: (
    <>
      <path d="M20 20l8-2 2 4-14 16c-2 2-6-2-4-4z" fill="#fb923c" stroke="#ea6a10" strokeWidth="1.4" />
      <path d="M28 18l-2-6M30 20l4-4M31 23l6-1" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 26l4 4M18 30l4 4" fill="none" stroke="#fed7aa" strokeWidth="1.3" />
    </>
  ),
  apple: (
    <>
      <path d="M24 18c-3-3-11-2-11 7 0 8 6 13 11 13s11-5 11-13c0-9-8-10-11-7z" fill="#f43f5e" stroke="#be123c" strokeWidth="1.4" />
      <path d="M24 18v-3c0-3 3-4 5-4" fill="none" stroke="#7c3f16" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 11c2-1 4 0 4 0s-1 3-4 3z" fill="#4ade80" />
      <path d="M18 24c1-2 3-3 5-3" fill="none" stroke="#fda4b5" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  banana: (
    <>
      <path d="M13 16c1 12 9 20 21 19 2 0 3-3 1-4-9 0-16-6-17-16 0-2-5-1-5 1z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.4" />
      <path d="M13 16c1 11 8 18 19 18" fill="none" stroke="#fef08a" strokeWidth="1.6" />
      <path d="M34 35l3 1M13 15l-1-3" stroke="#8a6d0b" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  paper: (
    <>
      <rect x="13" y="18" width="22" height="18" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.4" />
      <ellipse cx="24" cy="18" rx="11" ry="4" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="1.4" />
      <ellipse cx="24" cy="18" rx="3.4" ry="1.4" fill="#bae6fd" />
      <path d="M31 24v11l4 2V26z" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="1.3" />
    </>
  ),
  detergent: (
    <>
      <rect x="16" y="18" width="14" height="20" rx="3" fill="#a5f3fc" stroke="#0891b2" strokeWidth="1.4" />
      <rect x="19" y="12" width="8" height="6" rx="1.5" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.2" />
      <rect x="19" y="24" width="8" height="9" rx="1.2" fill="#ecfeff" />
      <circle cx="34" cy="16" r="2" fill="#67e8f9" />
      <circle cx="37" cy="20" r="1.4" fill="#a5f3fc" />
    </>
  ),
  baby: (
    <>
      <path d="M17 17h14l3 6-3 4v9a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2v-9l-3-4z" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1.3" />
      <path d="M20 15c0 3 8 3 8 0" fill="none" stroke="#ec4899" strokeWidth="1.3" />
      <circle cx="24" cy="28" r="3.4" fill="#fce7f3" />
      <path d="M22 28h4" stroke="#f9a8d4" strokeWidth="1.4" />
    </>
  ),
  seasoning: (
    <>
      <rect x="18" y="20" width="12" height="18" rx="2.5" fill="#7c3f0f" stroke="#5b2e0a" strokeWidth="1.3" />
      <rect x="20" y="12" width="8" height="8" rx="1.5" fill="#a16207" stroke="#5b2e0a" strokeWidth="1.2" />
      <rect x="20.5" y="26" width="9" height="8" rx="1" fill="#fde9c8" opacity="0.85" />
      <path d="M22 30h5" stroke="#7c3f0f" strokeWidth="1.2" />
    </>
  ),
  curry: (
    <>
      <path d="M9 26h30c-1 8-7 12-15 12S10 34 9 26z" fill="#d97706" stroke="#b45309" strokeWidth="1.4" />
      <path d="M9 26h30" stroke="#b45309" strokeWidth="1.4" />
      <ellipse cx="20" cy="30" rx="3" ry="2" fill="#fbbf24" />
      <ellipse cx="28" cy="32" rx="2.4" ry="1.6" fill="#fcd34d" />
      <ellipse cx="24" cy="24" rx="16" ry="2.4" fill="#e5e7eb" />
    </>
  ),
  drink: (
    <>
      <path d="M16 16h14v20a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3z" fill="#fde68a" stroke="#d97706" strokeWidth="1.4" />
      <rect x="16" y="16" width="14" height="6" fill="#fef9e7" stroke="#d97706" strokeWidth="1.4" />
      <path d="M30 21h4a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-4" fill="none" stroke="#d97706" strokeWidth="1.4" />
      <rect x="19" y="25" width="8" height="11" rx="1.5" fill="#fbbf24" opacity="0.7" />
    </>
  ),
  snack: (
    <>
      <path d="M18 12h12l-1 4 2 18-3 3H20l-3-3 2-18z" fill="#fb923c" stroke="#ea6a10" strokeWidth="1.3" />
      <path d="M17 16h14M17 34h14" stroke="#ea6a10" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="4" fill="#fed7aa" />
      <path d="M22 23l1 1 2-2" stroke="#ea6a10" strokeWidth="1.3" fill="none" />
    </>
  ),
  sweets: (
    <>
      <path d="M12 26l12-8 12 8v8a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2z" fill="#fbcfe8" stroke="#db2777" strokeWidth="1.3" />
      <path d="M12 26l12 5 12-5" fill="none" stroke="#db2777" strokeWidth="1.3" />
      <path d="M18 22c0-3 12-3 12 0" fill="#fff1f7" stroke="#db2777" strokeWidth="1.3" />
      <circle cx="24" cy="17" r="2" fill="#f43f5e" />
    </>
  ),
  frozen: (
    <>
      <path d="M24 9v30M11 16l26 16M37 16L11 32" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M24 9l3 3-3 3-3-3zM24 39l3-3-3-3-3 3z" fill="#7dd3fc" />
      <circle cx="24" cy="24" r="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.4" />
    </>
  ),
  default: (
    <>
      <path d="M14 18h20l-2 18a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3z" fill="#fde68a" stroke="#d97706" strokeWidth="1.4" />
      <path d="M19 18a5 5 0 0 1 10 0" fill="none" stroke="#d97706" strokeWidth="1.8" />
      <circle cx="21" cy="26" r="1.6" fill="#d97706" />
      <circle cx="27" cy="26" r="1.6" fill="#d97706" />
    </>
  ),
};

export function iconSvg(key: IconKey): ReactNode {
  return ICONS[key] ?? ICONS.default;
}
