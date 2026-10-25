import ProductImage from "./ProductImage";
import Glyph from "./Glyph";
import { dayPhrase } from "../lib/summary";
import type { DailyItem, ScheduleItem, SelectedItem } from "../lib/types";

type Props = {
  item: DailyItem;
  onClick: (item: SelectedItem) => void;
  index?: number;
};

function toSelected(item: DailyItem, s: ScheduleItem | undefined, comment: string): SelectedItem {
  return {
    name: item.name,
    shop: s?.shop || "-",
    price: s?.price || 0,
    avg_price: item.avg_price,
    min_price: item.min_price,
    sale_end_date: item.sale_end_date,
    purchase_condition: s?.purchase_condition || "",
    comment,
    slot_day: s?.day || "",
    price_history: item.price_history,
    store_url: s?.store_url || "",
    raw_item_name: s?.raw_item_name,
    icon: item.icon,
    item_id: s?.item_id,
    image_hash: s?.image_hash,
    anchor_id: s?.anchor_id,
    offers: s?.offers,
    report_state: s?.report_state,
    unit_price_text: s?.unit_price_text,
    photo_url: item.photo_url,
    jan_code: item.jan_code,
    product_url: item.product_url,
  };
}

// 底値カレンダーの1行（品目 × 7日）。底値の日は柿色の札で塗り、買い時の一言を添える
export default function DailyCarouselItem({ item, onClick, index = 0 }: Props) {
  const todaySlot = item.schedule.find((s) => s.day.includes("今日"));
  const tomorrowSlot = item.schedule.find((s) => s.day.includes("明日"));
  const firstMinSlot = item.schedule.find((s) => s.isMin);
  const bonusPoints = firstMinSlot?.bonus_points ?? 0;

  const adviceSlot = todaySlot?.isMin
    ? todaySlot
    : tomorrowSlot?.isMin
      ? tomorrowSlot
      : (firstMinSlot ?? null);

  const advice: { glyph: "bulb" | "hourglass" | "calendar"; label: string } = !adviceSlot
    ? { glyph: "bulb", label: "" }
    : adviceSlot.day.includes("今日")
      ? { glyph: "bulb", label: "今日が買い" }
      : adviceSlot.day.includes("明日")
        ? { glyph: "hourglass", label: "明日まで待って" }
        : { glyph: "calendar", label: `${dayPhrase(adviceSlot.day)}が狙い目` };

  const adviceText = adviceSlot?.advice || "今週の底値曜日をチェックして計画的に購入しましょう。";

  return (
    <article
      data-reveal
      data-reveal-delay={String(Math.min(index, 5) * 0.06)}
      className="grid gap-4 border-b rule py-6 last:border-b-0 md:grid-cols-[15rem_1fr] md:gap-8"
    >
      <div className="flex items-start gap-3 md:block">
        <button
          type="button"
          onClick={() => onClick(toSelected(item, firstMinSlot, adviceText))}
          className="group flex items-center gap-3 text-left"
        >
          <ProductImage
            name={item.name}
            icon={item.icon}
            photoUrl={item.photo_url}
            width={160}
            className="h-14 w-14 shrink-0 rounded-2xl border rule transition-transform duration-500 ease-out group-hover:-rotate-3 md:h-16 md:w-16"
          />
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-1.5">
              <h3 className="font-display text-2xl leading-none text-ink group-hover:text-persimmon md:text-[1.7rem]">
                {item.name}
              </h3>
              {item.is_new && (
                <span className="rounded-full bg-mustard px-2 py-0.5 text-[10px] font-bold text-ink">
                  NEW
                </span>
              )}
              {bonusPoints > 0 && (
                <span className="rounded-full bg-plum px-2 py-0.5 text-[10px] font-bold text-white">
                  +{bonusPoints}pt
                </span>
              )}
            </span>
            {item.sale_end_date && (
              <span className="mt-1.5 block text-[12px] text-ink-mute">{item.sale_end_date}</span>
            )}
          </span>
        </button>
        {adviceSlot && (
          <p className="ml-auto max-w-[11rem] text-[12px] leading-relaxed text-leaf-deep md:ml-0 md:mt-4 md:max-w-none">
            <span className="flex items-center gap-1 font-bold">
              <Glyph name={advice.glyph} className="h-3.5 w-3.5 shrink-0" />
              {advice.label}
            </span>
            <span className="text-ink-soft">{adviceText}</span>
          </p>
        )}
      </div>

      <div className="no-sb -mx-4 overflow-x-auto px-4 pt-3 md:mx-0 md:px-0">
        <ol className="grid auto-cols-[minmax(5.75rem,1fr)] grid-flow-col gap-2">
          {item.schedule.map((s, i) => {
            const has = s.price > 0;
            const multi = has && s.offers && s.offers.length > 1;
            return (
              <li key={i}>
                <button
                  type="button"
                  disabled={!has}
                  onClick={() => has && onClick(toSelected(item, s, s.advice || ""))}
                  className={`relative flex h-full min-h-[7.5rem] w-full flex-col rounded-2xl border p-3 text-left transition-all duration-300 ease-out ${
                    s.isMin
                      ? "border-persimmon bg-persimmon text-white shadow-lift"
                      : has
                        ? "border-ink/15 bg-paper-light hover:-translate-y-0.5 hover:border-ink hover:shadow-card"
                        : "border-dashed border-ink/20 bg-transparent text-ink-mute"
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold tracking-wider ${s.isMin ? "text-white/85" : "text-ink-mute"}`}
                  >
                    {s.day}
                  </span>
                  {has ? (
                    multi ? (
                      <span className="mt-auto space-y-1">
                        {s.offers.map((o, oi) => (
                          <span key={oi} className="block">
                            <span
                              className={`num block whitespace-nowrap text-[1.2rem] leading-none ${
                                s.isMin
                                  ? "text-white"
                                  : o.price === s.price
                                    ? "text-persimmon"
                                    : "text-ink"
                              }`}
                            >
                              {o.price}
                              <span className="ml-0.5 font-sans text-[10px] font-bold">円</span>
                            </span>
                            <span
                              className={`block truncate text-[10px] ${s.isMin ? "text-white/80" : "text-ink-mute"}`}
                            >
                              {o.shop}
                            </span>
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="mt-auto">
                        <span
                          className={`num block whitespace-nowrap text-[1.6rem] leading-none md:text-[1.8rem] ${s.isMin ? "text-white" : "text-ink"}`}
                        >
                          {s.price}
                          <span className="ml-0.5 font-sans text-[11px] font-bold">円</span>
                        </span>
                        <span
                          className={`mt-1 block truncate text-[10px] ${s.isMin ? "text-white/85" : "text-ink-mute"}`}
                        >
                          {s.shop}
                        </span>
                      </span>
                    )
                  ) : (
                    <span className="mt-auto num text-2xl leading-none text-ink/25">—</span>
                  )}
                  {s.isMin && (
                    <span className="absolute -top-2.5 right-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold tracking-wider text-paper">
                      ★最安値
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </article>
  );
}
