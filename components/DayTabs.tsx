import { addDays, md } from "../lib/dates";

export type Day = "today" | "tomorrow" | "week";

type Props = {
  value: Day;
  onChange: (d: Day) => void;
  today: Date;
  label?: string;
};

// 「今日・明日・今週」の切り替え。選ばれた側に墨の下地が滑り込む
export default function DayTabs({ value, onChange, today, label = "表示する日" }: Props) {
  const items: { key: Day; name: string; sub: string }[] = [
    { key: "today", name: "今日", sub: md(today) },
    { key: "tomorrow", name: "明日", sub: md(addDays(today, 1)) },
    { key: "week", name: "今週", sub: `〜${md(addDays(today, 6))}` },
  ];
  const idx = items.findIndex((i) => i.key === value);
  return (
    <div
      role="group"
      aria-label={label}
      className="relative grid w-full grid-cols-3 rounded-full border border-ink bg-paper-light p-1 sm:w-[22rem]"
    >
      <span
        aria-hidden="true"
        className="absolute bottom-1 top-1 rounded-full bg-ink transition-transform duration-500 ease-out"
        style={{
          width: "calc((100% - 0.5rem) / 3)",
          left: "0.25rem",
          transform: `translateX(${idx * 100}%)`,
        }}
      />
      {items.map((i) => (
        <button
          key={i.key}
          type="button"
          onClick={() => onChange(i.key)}
          aria-pressed={value === i.key}
          className={`relative z-10 flex items-baseline justify-center gap-1.5 rounded-full py-2 text-[13px] font-bold transition-colors duration-300 ${
            value === i.key ? "text-paper" : "text-ink-soft hover:text-ink"
          }`}
        >
          {i.name}
          <span className="num text-[11px] font-normal opacity-75">{i.sub}</span>
        </button>
      ))}
    </div>
  );
}
