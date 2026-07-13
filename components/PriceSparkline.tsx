import type { PricePoint } from "../lib/types";

type Props = {
  history?: PricePoint[];
  avgPrice?: number;
};

// 過去30日の価格推移スパークライン（ライブラリ不使用の素SVG）
export default function PriceSparkline({ history, avgPrice = 0 }: Props) {
  if (!history || history.length < 2) return null;

  const W = 300,
    H = 80,
    PX = 8,
    PY = 10;
  const prices = history.map((h) => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  let lo = minPrice;
  let hi = maxPrice;
  if (avgPrice > 0) {
    lo = Math.min(lo, avgPrice);
    hi = Math.max(hi, avgPrice);
  }
  const span = hi - lo || 1;
  const x = (i: number) => PX + (i * (W - PX * 2)) / (history.length - 1);
  const y = (p: number) => PY + (H - PY * 2) * (1 - (p - lo) / span);
  const points = history.map((h, i) => `${x(i)},${y(h.price)}`).join(" ");
  const minIdx = prices.indexOf(minPrice);
  const lastIdx = history.length - 1;

  return (
    <div className="bg-white rounded-2xl p-3 mb-4 border border-stone-100">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-stone-500">📈 過去30日の価格推移</span>
        <span className="text-[10px] text-stone-500">
          {history[0].date} 〜 {history[lastIdx].date}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
        {avgPrice > 0 && (
          <line
            x1={PX}
            y1={y(avgPrice)}
            x2={W - PX}
            y2={y(avgPrice)}
            stroke="#a8a29e"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        )}
        <polyline
          points={points}
          fill="none"
          stroke="#e11d48"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={x(minIdx)} cy={y(minPrice)} r="3.5" fill="#e11d48" />
        <circle
          cx={x(lastIdx)}
          cy={y(prices[lastIdx])}
          r="3"
          fill="#fff"
          stroke="#e11d48"
          strokeWidth="2"
        />
      </svg>
      <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
        <span>底値 {minPrice}円</span>
        {avgPrice > 0 && <span>平均 {avgPrice}円（点線）</span>}
        <span>最高 {maxPrice}円</span>
      </div>
    </div>
  );
}
