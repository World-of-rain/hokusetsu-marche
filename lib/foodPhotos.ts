import type { IconKey } from "./foodIcons";

// カテゴリ単位のフリー写真（Unsplash / Unsplashライセンス: 商用可・帰属不要・直リンク可）。
// これらの写真IDはバックエンドでも以前から使われていた実在の厳選IDに揃えている。
// 写真が無い/読めないキーは null を返し、呼び出し側で自前SVGイラストにフォールバックさせる
// （壊れた画像や被写体違いを出さないため、確実にカテゴリが合うものだけに写真を割り当てる）。
const PHOTO_IDS: Partial<Record<IconKey, string>> = {
  egg: "1587486913049-53fc88980cfc",
  milk: "1563636619-e9143da7973b",
  dairy: "1628088062854-d1870b4553da",
  bread: "1598373182133-52452f7691ef",
  soy: "1551024709-8f23befc6f87",
  rice: "1586201375761-83865001e31c",
  beef: "1607623814075-e51df1bdc82f",
  pork: "1607623814075-e51df1bdc82f",
  chicken: "1607623814075-e51df1bdc82f",
  fish: "1615141982883-c7fa0e69fd3f",
  shrimp: "1615141982883-c7fa0e69fd3f",
  leafveg: "1566385101042-1a0aa0c1268c",
  tomato: "1566385101042-1a0aa0c1268c",
  rootveg: "1566385101042-1a0aa0c1268c",
  paper: "1584556812952-905ffd0c611a",
  detergent: "1585909695284-32d2985ac9c0",
  baby: "1583947215259-38e31be8751f",
  default: "1542838132-92c53300491e",
};

// Unsplash CDN の変換パラメータで、必要な幅・画質に最適化して配信する（auto=format で webp 等）。
export function photoForKey(key: IconKey, width = 200): string | null {
  const id = PHOTO_IDS[key];
  if (!id) return null;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`;
}

// ヒーロー用のワイドな写真（青果売り場）。読めなければ背景グラデーションが残る。
export const HERO_PHOTO =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=70";
