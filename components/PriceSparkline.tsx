import type { PricePoint } from "../lib/types";

type Props = {
  history?: PricePoint[];
  avgPrice?: number;
};

// 過去30日の価格推移（ライブラリ不使用の素の SVG）。面を淡く塗り、底値の点を柿色で示す
export default function PriceSparkline({ history, avgPrice = 0 }: Props) {
  if (!history || history.length < 2) return null;

  const W = 320,
    H = 96,
    PX = 10,
    PY = 12;
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
  const area = `${PX},${H - PY} ${points} ${x(history.length - 1)},${H - PY}`;
  const minIdx = prices.indexOf(minPrice);
  const lastIdx = history.length - 1;

  return (
    <figure className="mb-4 rounded-[20px] border border-ink/15 p-4">
      <figcaption className="mb-2 flex items-center justify-between">
        <span className="text-[12px] font-bold tracking-[0.08em] text-ink-mute">
          過去30日の価格推移
        </span>
        <span className="num text-[12px] text-ink-mute">
          {history[0].date} – {history[lastIdx].date}
        </span>
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={`底値${minPrice}円、最高${maxPrice}円の推移`}
      >
        <defs>
          <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#c4361a" stopOpacity="0.22" />
            <stop offset="1" stopColor="#c4361a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {avgPrice > 0 && (
          <line
            x1={PX}
            y1={y(avgPrice)}
            x2={W - PX}
            y2={y(avgPrice)}
            stroke="#7b756a"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        )}
        <polygon points={area} fill="url(#spark-fill)" />
        <polyline
          points={points}
          fill="none"
          stroke="#c4361a"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={x(minIdx)} cy={y(minPrice)} r="4.5" fill="#c4361a" />
        <circle
          cx={x(lastIdx)}
          cy={y(prices[lastIdx])}
          r="3.5"
          fill="#f3eee4"
          stroke="#1c1a16"
          strokeWidth="2"
        />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-ink-soft">
        <span>
          底値 <span className="num text-[13px] text-persimmon">{minPrice}円</span>
        </span>
        {avgPrice > 0 && (
          <span>
            平均 <span className="num text-[13px] text-ink">{avgPrice}円</span>（点線）
          </span>
        )}
        <span>
          最高 <span className="num text-[13px] text-ink">{maxPrice}円</span>
        </span>
      </div>
    </figure>
  );
}
