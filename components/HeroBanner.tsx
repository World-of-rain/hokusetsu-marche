import { useState } from "react";
import { HERO_PHOTO } from "../lib/foodPhotos";

// ヒーロー。フリー写真（青果売り場）を背景に、下端を背景色へなじませる。
// 写真が読めない場合は暖色のグラデーションが残る（壊れた見た目にはならない）。
export default function HeroBanner() {
  const [failed, setFailed] = useState(false);

  return (
    <div
      aria-hidden="true"
      className="h-44 w-full relative overflow-hidden bg-gradient-to-br from-rose-100 via-amber-50 to-teal-50"
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={HERO_PHOTO}
          alt=""
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* 上部を軽く暗く、下端を背景色(#faf9f8)へフェードして見出しと馴染ませる */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#faf9f8]" />
    </div>
  );
}
