import type { IconKey } from "./foodIcons";

// ストック（買い溜め）セクションのカテゴリ表示設定。
// バックエンド(dashboard.py STOCK_SUBCATEGORIES / LLM)のラベルと対になる。
// ラベル先頭の絵文字は表示では除去し、カテゴリごとに専用アイコンへ置き換える。

export function cleanCategoryLabel(s: string): string {
  return (s || "").replace(/^[^\p{L}\p{N}]+/u, "");
}

// 表示順（この順に並べ、リストに無いものは末尾）。
export const STOCK_CATEGORY_ORDER: string[] = [
  "主食・粉物",
  "缶詰・レトルト・インスタント",
  "乾物・海藻",
  "調味料・油",
  "冷凍食品",
  "お菓子・スナック",
  "飲料(ノンアル)",
  "お酒",
  "紙製品",
  "洗剤・柔軟剤",
  "バス・ヘルスケア",
  "キッチン消耗品",
  "オムツ・ベビー",
  "ペット用品",
  "その他ストック",
];

// カテゴリ → 自前SVGアイコンキー（旧ラベルもエイリアスとして受ける）。
const STOCK_CATEGORY_ICON: Record<string, IconKey> = {
  "主食・粉物": "rice",
  "缶詰・レトルト・インスタント": "curry",
  "乾物・海藻": "fish",
  "調味料・油": "seasoning",
  調味料: "seasoning",
  冷凍食品: "frozen",
  "お菓子・スナック": "snack",
  "飲料(ノンアル)": "drink",
  お酒: "drink",
  紙製品: "paper",
  "洗剤・柔軟剤": "detergent",
  "洗剤・漂白剤・柔軟剤": "detergent",
  "バス・ヘルスケア": "detergent",
  キッチン消耗品: "paper",
  "オムツ・ベビー": "baby",
  オムツ: "baby",
  ペット用品: "default",
  その他ストック: "default",
};

export function stockCategoryIcon(cleanLabel: string): IconKey {
  return STOCK_CATEGORY_ICON[cleanLabel] ?? "default";
}

export function stockOrderIndex(cleanLabel: string): number {
  const i = STOCK_CATEGORY_ORDER.indexOf(cleanLabel);
  return i < 0 ? STOCK_CATEGORY_ORDER.length : i;
}
