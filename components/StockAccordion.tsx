import SectionHeading from "./SectionHeading";
import FoodIcon from "./FoodIcon";
import type { SelectedItem, StockGroup } from "../lib/types";

type Props = {
  stocks: StockGroup[];
  openIdx: number | null;
  onToggle: (idx: number) => void;
  onClick: (item: SelectedItem) => void;
};

// ストック・まとめ買い品のカテゴリ別アコーディオン
export default function StockAccordion({ stocks, openIdx, onToggle, onClick }: Props) {
  return (
    <section>
      <SectionHeading
        variant="stock"
        title="ストック・まとめ買いのチャンス"
        tint="text-amber-700"
        chipBg="from-amber-400 to-yellow-400"
      />
      <div className="space-y-1.5">
        {stocks.map((s, i) => {
          const hasItem = s.items.length > 0;
          const isOpen = openIdx === i;
          // バックエンドのラベルに残る先頭絵文字を除去（アイコンはFoodIconで表現する）
          const catLabel = s.cat.replace(/^[^\p{L}\p{N}]+/u, "");
          return (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden"
            >
              <button
                onClick={() => hasItem && onToggle(i)}
                className={`w-full p-2.5 flex justify-between items-center text-xs transition-colors ${
                  hasItem
                    ? "cursor-pointer hover:bg-stone-50 active:bg-stone-100"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <span className="flex items-center gap-2 font-bold text-stone-700">
                  <FoodIcon
                    name={catLabel}
                    className="w-7 h-7 rounded-lg flex-shrink-0"
                    padClassName="p-[14%]"
                  />
                  {catLabel}
                </span>
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                    hasItem ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {hasItem ? `${s.items.length}件あり` : "特売なし"}
                </span>
              </button>

              <div
                style={{
                  maxHeight: isOpen ? "70vh" : "0px",
                  overflowY: "auto",
                  transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div className="px-3 pb-2 pt-1 text-[11px] border-t border-stone-50 bg-[#faf9f8]">
                  {s.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex justify-between items-center py-1.5 border-b border-stone-100 last:border-0 cursor-pointer active:bg-stone-100"
                      onClick={() => onClick(item)}
                    >
                      <div className="flex items-center flex-wrap gap-1 mr-2">
                        <span className="font-medium text-stone-600">{item.name}</span>
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
                      <span className="flex-shrink-0">
                        <strong className="text-rose-600 font-black text-[13px]">
                          {item.price}円
                        </strong>
                        <span className="text-stone-500 text-[10px] ml-1">({item.shop})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
