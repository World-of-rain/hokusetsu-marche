// CIおよびローカル検証用のモックAPI。
// 使い方: node scripts/mock-api.mjs &
//         API_URL=http://127.0.0.1:8123/api/prices/shonai npx next build
import { createServer } from "node:http";

const SCHEDULE = [
  {
    day: "土(今日)",
    price: 178,
    shop: "ライフ 庄内店",
    isMin: false,
    advice: "",
    is_new: true,
    purchase_condition: "",
    raw_item_name: "国産たまご Mサイズ 10個入",
    offers: [
      { price: 178, shop: "ライフ 庄内店" },
      { price: 188, shop: "ダイエー 豊中店" },
    ],
  },
  {
    day: "日(明日)",
    price: 158,
    shop: "万代 豊中豊南店",
    isMin: true,
    advice: "週内最安値ニャ",
    is_new: false,
    purchase_condition: "お一人様2点限り",
  },
  {
    day: "月",
    price: 0,
    shop: "-",
    isMin: false,
    advice: "",
    is_new: false,
    purchase_condition: "",
  },
  {
    day: "火",
    price: 198,
    shop: "ダイエー 豊中店",
    isMin: false,
    advice: "",
    is_new: false,
    purchase_condition: "",
  },
];

const HISTORY = [
  { date: "6/15", price: 208 },
  { date: "6/18", price: 198 },
  { date: "6/22", price: 178 },
  { date: "6/25", price: 218 },
  { date: "7/1", price: 188 },
  { date: "7/5", price: 168 },
  { date: "7/12", price: 158 },
];

const DATA = {
  daily: [
    {
      name: "卵",
      image: "https://example.com/egg.jpg",
      schedule: SCHEDULE,
      category_label: "",
      is_new: true,
      sale_end_date: "7/15まで",
      avg_price: 198,
      min_price: 148,
      price_history: HISTORY,
    },
  ],
  stocks: [
    {
      name: "スーパードライ",
      image: "https://example.com/beer.jpg",
      schedule: SCHEDULE,
      category_label: "🍺 お酒",
      is_new: false,
      sale_end_date: "",
      avg_price: 1080,
      min_price: 980,
      price_history: HISTORY,
    },
  ],
  highlights: [
    {
      name: "豚バラ肉",
      price: 98,
      shop: "サタケ 豊南店",
      day: "today",
      warning: false,
      image: "https://example.com/pork.jpg",
      comment: "今日はグラム98円ニャ",
      category: "肉",
      is_one_day_sale: true,
      is_new: true,
      sale_start_date: "7/12",
      sale_end_date: "7/12まで",
      purchase_condition: "",
      avg_price: 138,
      min_price: 88,
      price_history: HISTORY,
    },
  ],
  general: [
    {
      name: "キャベツ（1玉）",
      price: 128,
      shop: "サンディ 庄内栄町店",
      day: "today",
      warning: false,
      image: "https://example.com/cabbage.jpg",
      comment: "",
      category: "野菜",
      is_one_day_sale: false,
      is_new: false,
      sale_start_date: "7/10",
      sale_end_date: "7/14まで",
      purchase_condition: "",
      avg_price: 158,
      min_price: 98,
      price_history: [],
    },
  ],
};

const port = Number(process.env.MOCK_API_PORT || 8123);

createServer((req, res) => {
  const body = JSON.stringify(DATA);
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(body);
}).listen(port, "127.0.0.1", () => {
  console.log(`mock API listening on http://127.0.0.1:${port}`);
});
