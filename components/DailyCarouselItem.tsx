import ProductImage from "./ProductImage";
import Glyph from "./Glyph";
import type { DailyItem, SelectedItem } from "../lib/types";

type Props = {
  item: DailyItem;
  onClick: (item: SelectedItem) => void;
};

// 毎日の必需品（卵・牛乳など）の1週間底値カレンダー
export default function DailyCarouselItem({ item, onClick }: Props) {
  const todaySlot = item.schedule.find((s) => s.day.includes("今日"));
  const tomorrowSlot = item.schedule.find((s) => s.day.includes("明日"));
  const firstMinSlot = item.schedule.find((s) => s.isMin);

  const adviceSlot = todaySlot?.isMin
    ? todaySlot
    : tomorrowSlot?.isMin
      ? tomorrowSlot
      : (firstMinSlot ?? null);

  const advice: { glyph: "bulb" | "hourglass" | "calendar"; label: string } = !adviceSlot
    ? { glyph: "bulb", label: "" }
    : adviceSlot.day.includes("今日")
      ? { glyph: "bulb", label: "今日が買い！：" }
      : adviceSlot.day.includes("明日")
        ? { glyph: "hourglass", label: "明日まで待って：" }
        : { glyph: "calendar", label: `${adviceSlot.day}が狙い目：` };

  const adviceText = adviceSlot?.advice || "今週の底値曜日をチェックして計画的に購入しましょう。";

  return (
    <div className="border-b border-stone-100 last:border-0 pb-4 last:pb-0">
      <div
        className="text-[13px] font-bold text-stone-700 mb-2 flex items-center gap-2 cursor-pointer active:opacity-50"
        onClick={() =>
          onClick({
            name: item.name,
            shop: firstMinSlot?.shop || "-",
            price: firstMinSlot?.price || 0,
            avg_price: item.avg_price,
            min_price: item.min_price,
            sale_end_date: item.sale_end_date,
            purchase_condition: firstMinSlot?.purchase_condition || "",
            comment: adviceText,
            slot_day: firstMinSlot?.day || "",
            price_history: item.price_history,
            store_url: firstMinSlot?.store_url || "",
            icon: item.icon,
            item_id: firstMinSlot?.item_id,
            image_hash: firstMinSlot?.image_hash,
            anchor_id: firstMinSlot?.anchor_id,
            report_state: firstMinSlot?.report_state,
          })
        }
      >
        <ProductImage
          name={item.name}
          icon={item.icon}
          width={120}
          className="w-8 h-8 rounded-xl shadow-sm"
        />
        <div className="flex items-center flex-wrap gap-1">
          <span>{item.name}</span>
          {item.is_new && (
            <span className="bg-amber-400 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              NEW
            </span>
          )}
          {item.sale_end_date && (
            <span className="text-stone-500 text-[10px] font-medium ml-1">
              {item.sale_end_date}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto py-1 no-sb">
        {item.schedule.map((s, i) => (
          <div
            key={i}
            onClick={() =>
              s.price > 0 &&
              onClick({
                name: item.name,
                shop: s.shop,
                price: s.price,
                avg_price: item.avg_price,
                min_price: item.min_price,
                sale_end_date: item.sale_end_date,
                purchase_condition: s.purchase_condition || "",
                comment: s.advice || "",
                slot_day: s.day,
                price_history: item.price_history,
                store_url: s.store_url || "",
                icon: item.icon,
                item_id: s.item_id,
                image_hash: s.image_hash,
                anchor_id: s.anchor_id,
                report_state: s.report_state,
              })
            }
            className={`flex-shrink-0 w-[86px] p-2 rounded-2xl border text-center transition-all ${
              s.isMin
                ? "bg-rose-50 border-rose-200 shadow-sm ring-1 ring-rose-100"
                : "bg-white border-stone-200"
            } ${s.price > 0 ? "cursor-pointer active:scale-95" : "opacity-70"}`}
          >
            <div className="text-[10px] text-stone-600 font-medium mb-0.5">{s.day}</div>
            <div
              className={`text-[13px] font-black ${s.isMin ? "text-rose-600" : "text-stone-700"}`}
            >
              {s.price > 0 ? `${s.price}円` : "-"}
            </div>
            <div className="text-[10px] text-stone-500 truncate mt-0.5">{s.shop}</div>

            {s.isMin && (
              <div className="inline-block mt-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tracking-wide">
                ★最安値
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-[11px] text-teal-800 bg-teal-50/70 border border-teal-100 rounded-xl p-2.5 mt-3 font-medium leading-relaxed flex items-start gap-1.5">
        <Glyph name={advice.glyph} className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
        <span>
          <span className="font-bold">{advice.label}</span>
          {adviceText}
        </span>
      </div>
    </div>
  );
}
