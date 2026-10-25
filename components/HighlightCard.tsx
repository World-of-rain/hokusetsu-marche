import ProductImage from "./ProductImage";
import Yen from "./Yen";
import { discountRate } from "../lib/summary";
import type { GeneralItem, SelectedItem } from "../lib/types";

type Props = {
  h: GeneralItem;
  onClick: (item: SelectedItem) => void;
  index?: number;
};

// 目玉品のカード。写真（またはイラスト）・品名・店・大きな値札。平均からの値引きを若葉色で示す
export default function HighlightCard({ h, onClick, index = 0 }: Props) {
  const off = discountRate(h);
  return (
    <button
      type="button"
      data-reveal
      data-reveal-delay={String(Math.min(index, 5) * 0.07)}
      onClick={() => onClick(h)}
      className="group relative flex h-full w-full flex-col rounded-[22px] border border-ink/15 bg-paper-light p-5 text-left transition-all duration-500 ease-out hover:-translate-y-1 hover:border-ink hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <ProductImage
          name={h.name}
          category={h.category}
          icon={h.icon}
          photoUrl={h.photo_url}
          width={200}
          className="h-16 w-16 shrink-0 rounded-2xl border rule transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="flex flex-wrap justify-end gap-1">
          <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold tracking-wider text-paper">
            {h.day === "today" ? "今日限定" : h.day === "tomorrow" ? "明日限定" : "今週"}
          </span>
          {h.is_new && (
            <span className="rounded-full bg-mustard px-2 py-1 text-[10px] font-bold text-ink">
              NEW
            </span>
          )}
          {h.bonus_points > 0 && (
            <span className="rounded-full bg-plum px-2 py-1 text-[10px] font-bold text-white">
              +{h.bonus_points}pt
            </span>
          )}
        </div>
      </div>
      <h3 className="mt-4 phrase font-display text-[1.35rem] leading-snug text-ink">{h.name}</h3>
      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
        {h.comment || "過去の平均価格より大幅にお得。見逃し厳禁の特売品です。"}
      </p>
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-ink/25 pt-4">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-bold text-ink-soft">{h.shop}</p>
          {!h.is_one_day_sale && h.sale_end_date && (
            <p className="text-[11px] text-ink-mute">{h.sale_end_date}</p>
          )}
        </div>
        <div className="text-right">
          {off > 0 && <p className="num text-sm leading-none text-leaf">−{off}%</p>}
          <Yen value={h.price} className="text-[2.6rem] leading-none text-persimmon" />
        </div>
      </div>
    </button>
  );
}
