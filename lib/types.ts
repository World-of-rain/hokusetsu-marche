import { z } from "zod";

// バックエンド（smart_pantry/dashboard.py の Pydantic モデル）と対になるスキーマ。
// フィールドを増やす際は両方を更新すること。未知のフィールドはzodが黙って除去する
// （バックエンド先行でフィールド追加してもフロントのビルドは壊れない）。

export const PricePointSchema = z.object({
  date: z.string(),
  price: z.number(),
});

// 同じ日・同じ商品を扱う1店舗ぶんの特売情報（底値カレンダーの複数店舗表示用）
export const OfferSchema = z.object({
  price: z.number(),
  shop: z.string(),
  store_url: z.string().default(""),
  item_id: z.number().default(0),
  image_hash: z.string().default(""),
  anchor_id: z.string().default(""),
  // 店舗ごとの実際の商品名（チラシ表記）。同日複数店舗の詳細表示で店舗別に出す
  raw_item_name: z.string().default(""),
  // ボーナスポイント（0なら付与なし）
  bonus_points: z.number().default(0),
});

export const ScheduleItemSchema = z.object({
  day: z.string(),
  price: z.number(),
  shop: z.string(),
  isMin: z.boolean(),
  advice: z.string().default(""),
  is_new: z.boolean().default(false),
  // その日の最安店のボーナスポイント（0なら付与なし）
  bonus_points: z.number().default(0),
  purchase_condition: z.string().default(""),
  store_url: z.string().default(""),
  raw_item_name: z.string().default(""),
  item_id: z.number().default(0),
  image_hash: z.string().default(""),
  anchor_id: z.string().default(""),
  report_state: z.string().default(""),
  offers: z.array(OfferSchema).default([]),
  // 単位あたり価格の注記（例: "100gあたり39.8円"）。出せない商品は空文字
  unit_price_text: z.string().default(""),
});

export const DailyItemSchema = z.object({
  name: z.string(),
  image: z.string().default(""),
  icon: z.string().default(""),
  schedule: z.array(ScheduleItemSchema),
  category_label: z.string().default(""),
  is_new: z.boolean().default(false),
  sale_end_date: z.string().default(""),
  avg_price: z.number().default(0),
  min_price: z.number().default(0),
  price_history: z.array(PricePointSchema).default([]),
  photo_url: z.string().default(""),
  jan_code: z.string().default(""),
  product_url: z.string().default(""),
});

export const GeneralItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  shop: z.string(),
  day: z.string(),
  warning: z.boolean().default(false),
  image: z.string().default(""),
  icon: z.string().default(""),
  comment: z.string().default(""),
  category: z.string().default(""),
  is_one_day_sale: z.boolean().default(false),
  is_new: z.boolean().default(false),
  // ボーナスポイント（0なら付与なし）
  bonus_points: z.number().default(0),
  sale_start_date: z.string().default(""),
  sale_end_date: z.string().default(""),
  purchase_condition: z.string().default(""),
  avg_price: z.number().default(0),
  min_price: z.number().default(0),
  price_history: z.array(PricePointSchema).default([]),
  store_url: z.string().default(""),
  raw_item_name: z.string().default(""),
  item_id: z.number().default(0),
  image_hash: z.string().default(""),
  anchor_id: z.string().default(""),
  report_state: z.string().default(""),
  photo_url: z.string().default(""),
  jan_code: z.string().default(""),
  product_url: z.string().default(""),
  // 単位あたり価格。実売価格が主・単価は補助情報（注記表示とソート切替に使う）
  // unit_dimension: "mass"(円/100g) / "volume"(円/100ml) / "count"(円/個) / ""(単価なし)
  unit_price: z.number().default(0),
  unit_dimension: z.string().default(""),
  unit_price_text: z.string().default(""),
});

export const DashboardResponseSchema = z.object({
  daily: z.array(DailyItemSchema),
  stocks: z.array(DailyItemSchema),
  highlights: z.array(GeneralItemSchema),
  general: z.array(GeneralItemSchema),
});

// Pages Function（/api/prices/{area}）が返すKV由来のデータ。
// バックエンドが書き込み時刻 generated_at を付与する
export const LiveDashboardSchema = DashboardResponseSchema.extend({
  generated_at: z.string().optional(),
});

export type PricePoint = z.infer<typeof PricePointSchema>;
export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;
export type DailyItem = z.infer<typeof DailyItemSchema>;
export type GeneralItem = z.infer<typeof GeneralItemSchema>;
export type DashboardResponse = z.infer<typeof DashboardResponseSchema>;

/** ビルド時に付与する更新時刻を含む、ページが受け取るデータ */
export type DashboardData = DashboardResponse & { lastUpdated: string };

/** ボトムシート（詳細画面）に渡す表示用アイテム。複数のセクションから組み立てられる */
export type SelectedItem = {
  name: string;
  shop: string;
  price: number;
  category?: string;
  icon?: string;
  image?: string;
  avg_price?: number;
  min_price?: number;
  sale_start_date?: string;
  sale_end_date?: string;
  purchase_condition?: string;
  comment?: string;
  slot_day?: string;
  price_history?: PricePoint[];
  store_url?: string;
  raw_item_name?: string;
  item_id?: number;
  image_hash?: string;
  anchor_id?: string;
  report_state?: string;
  offers?: Offer[];
  photo_url?: string;
  jan_code?: string;
  product_url?: string;
  unit_price_text?: string;
  // ボーナスポイント（0なら付与なし）。ストック等 SelectedItem を直接組む経路で使う
  bonus_points?: number;
};

export type Offer = z.infer<typeof OfferSchema>;

/** ストックアコーディオンのグループ */
export type StockGroup = {
  cat: string;
  items: (SelectedItem & { is_new: boolean; sale_end_date: string })[];
};
