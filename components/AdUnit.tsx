import { useEffect } from "react";
import { ADSENSE_CLIENT } from "../lib/site";

type Props = {
  slot?: string; // 広告ユニットのスロットID（自動広告のみ使う場合は不要）
  className?: string;
};

// Google AdSense のディスプレイ広告枠。
// NEXT_PUBLIC_ADSENSE_CLIENT と slot が設定されている場合のみ表示され、
// 未設定時は何も描画しない（審査前・ローカルで空枠が出ないようにするため）。
export default function AdUnit({ slot, className }: Props) {
  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot) return;
    try {
      // @ts-expect-error adsbygoogle はグローバルに注入される
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // スクリプト未ロード等は無視
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <div className={`my-4 text-center ${className ?? ""}`}>
      <span className="block text-[9px] text-stone-400 mb-1">スポンサーリンク</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
