import { useState } from "react";
import FoodIcon from "./FoodIcon";
import { normalizeIconKey, pickIconKey } from "../lib/foodIcons";
import { photoForKey } from "../lib/foodPhotos";

type Props = {
  name: string;
  category?: string;
  icon?: string;
  className?: string;
  /** 取得する写真の幅（px）。小さいタイルほど小さく */
  width?: number;
};

// 商品ビジュアル。カテゴリに合うフリー写真があれば写真を表示し、無い/読み込み失敗時は
// 自前のSVGイラスト（FoodIcon）へ自動フォールバックする。壊れた画像は決して出さない。
export default function ProductImage({ name, category, icon, className, width = 200 }: Props) {
  const key = normalizeIconKey(icon) ?? pickIconKey(name, category);
  const photo = photoForKey(key, width);
  const [failed, setFailed] = useState(false);

  if (!photo || failed) {
    return <FoodIcon name={name} category={category} icon={icon} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className ?? ""}`} aria-hidden="true">
      {/* 静的エクスポート(output:export)では next/image 最適化は使えないため素の img を使う */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
