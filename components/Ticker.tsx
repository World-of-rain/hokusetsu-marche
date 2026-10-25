import type { GeneralItem } from "../lib/types";

// 特売品が流れる帯（電光掲示板）。同じ並びを2回並べて継ぎ目なく回す。
// 読み上げでは1回分だけを読むよう、2回目は aria-hidden にする
export default function Ticker({ items }: { items: GeneralItem[] }) {
  if (items.length === 0) return null;
  const row = items.slice(0, 24);
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {row.map((g, i) => (
        <li key={i} className="flex items-baseline gap-2.5 whitespace-nowrap px-6 text-[15px]">
          <span className="text-persimmon" aria-hidden="true">
            ●
          </span>
          <span className="font-bold">{g.name}</span>
          <span className="num text-xl text-mustard">{g.price}円</span>
          <span className="text-[12px] text-paper/60">{g.shop}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee overflow-hidden border-y border-ink bg-ink py-3.5 text-paper">
      <p className="sr-only">今日の特売品の一部</p>
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
