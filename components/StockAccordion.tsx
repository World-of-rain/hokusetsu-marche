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
      <h2 className="text-[11px] font-bold text-stone-600 tracking-wider mb-2 px-1 flex items-center gap-1">
        <span>🥫</span> ストック・まとめ買いのチャンス
      </h2>
      <div className="space-y-1.5">
        {stocks.map((s, i) => {
          const hasItem = s.items.length > 0;
          const isOpen = openIdx === i;
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
                <span className="font-bold text-stone-700">{s.cat}</span>
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
