import FoodIcon from "./FoodIcon";
import type { GeneralItem, SelectedItem } from "../lib/types";

type Props = {
  h: GeneralItem;
  onClick: (item: SelectedItem) => void;
};

// エリア最高目玉品のカード
export default function HighlightCard({ h, onClick }: Props) {
  return (
    <div
      className="bg-white p-2.5 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden flex gap-2.5 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => onClick(h)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-rose-400"></div>

      <FoodIcon
        name={h.name}
        category={h.category}
        icon={h.icon}
        className="w-12 h-12 rounded-xl flex-shrink-0 ml-1 shadow-sm"
      />

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center flex-wrap gap-1">
            <span className="font-black text-xs text-stone-800 leading-tight">{h.name}</span>
            {h.is_new && (
              <span className="bg-amber-400 text-white text-[10px] px-1 py-0.5 rounded-full font-bold">
                NEW
              </span>
            )}
            {!h.is_one_day_sale && h.sale_end_date && (
              <span className="text-stone-500 text-[10px] font-medium ml-1">{h.sale_end_date}</span>
            )}
          </div>
          <span className="flex-shrink-0 ml-1 text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-bold">
            {h.day === "today" ? "今日限定" : "明日限定"}
          </span>
        </div>
        <div className="text-[10px] text-stone-600 mt-1 leading-relaxed">
          {h.comment || "過去の平均価格より大幅にお得！見逃し厳禁の特売品です。"}
        </div>
        <div className="text-right mt-1.5 pt-1.5 border-t border-dashed border-stone-200">
          <span className="text-stone-500 text-[10px]">({h.shop})</span>
          <span className="text-base font-black text-rose-600 ml-1 tracking-tight">
            {h.price}円
          </span>
        </div>
      </div>
    </div>
  );
}
