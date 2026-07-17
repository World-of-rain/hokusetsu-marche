import { useState } from "react";
import FoodIcon from "./FoodIcon";
import { normalizeIconKey, pickIconKey } from "../lib/foodIcons";
import { photoForKey } from "../lib/foodPhotos";

type Props = {
  name: string;
  category?: string;
  icon?: string;
  /** Yahoo!ショッピング照合による実商品写真URL（あれば最優先で表示） */
  photoUrl?: string;
  className?: string;
  /** 取得する写真の幅（px）。小さいタイルほど小さく */
  width?: number;
};

// 商品ビジュアル。優先順位は
//   ① 実商品写真(photoUrl・Yahoo照合) → ② カテゴリのフリー写真 → ③ 自前SVGイラスト
// と多段フォールバックし、壊れた画像は決して出さない。
export default function ProductImage({
  name,
  category,
  icon,
  photoUrl,
  className,
  width = 200,
}: Props) {
  const key = normalizeIconKey(icon) ?? pickIconKey(name, category);
  const [failedUrls, setFailedUrls] = useState<string[]>([]);

  const candidates = [photoUrl, photoForKey(key, width)].filter(
    (u): u is string => !!u && !failedUrls.includes(u)
  );
  const src = candidates[0];

  if (!src) {
    return <FoodIcon name={name} category={category} icon={icon} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden bg-white ${className ?? ""}`} aria-hidden="true">
      {/* 静的エクスポート(output:export)では next/image 最適化は使えないため素の img を使う */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailedUrls((prev) => [...prev, src])}
        className={`absolute inset-0 w-full h-full ${src === photoUrl ? "object-contain" : "object-cover"}`}
      />
    </div>
  );
}
