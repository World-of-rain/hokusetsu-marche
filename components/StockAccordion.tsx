import type { ReactNode } from "react";
import SectionHeading from "./SectionHeading";
import FoodIcon from "./FoodIcon";
import ProductImage from "./ProductImage";
import { cleanCategoryLabel, stockCategoryIcon } from "../lib/stockCategories";
import type { SelectedItem, StockGroup } from "../lib/types";

type Props = {
  stocks: StockGroup[];
  openIdx: number | null;
  onToggle: (idx: number) => void;
  onClick: (item: SelectedItem) => void;
  // 見出し直下に挿す表示カテゴリ選択UI（SectionPicker）
  picker?: ReactNode;
  // stocksが空のときに出す案内（データなし／カテゴリ未選択で文言を出し分ける）
  emptyMessage?: string;
};

// ストック・まとめ買い品のカテゴリ別アコーディオン
export default function StockAccordion({
  stocks,
  openIdx,
  onToggle,
  onClick,
  picker,
  emptyMessage,
}: Props) {
  return (
    <section>
      <SectionHeading
        variant="stock"
        title="ストック・まとめ買いのチャンス"
        tint="text-amber-700"
        chipBg="from-amber-400 to-yellow-400"
      />
      {picker}
      {stocks.length === 0 && emptyMessage && (
        <p className="text-[11px] text-stone-400 text-center py-3 bg-white rounded-xl border border-stone-100">
          {emptyMessage}
        </p>
      )}
      <div className="space-y-1.5">
        {stocks.map((s, i) => {
          const hasItem = s.items.length > 0;
          const isOpen = openIdx === i;
          // バックエンドのラベルに残る先頭絵文字を除去し、カテゴリ専用アイコンを当てる
          const catLabel = cleanCategoryLabel(s.cat);
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
                    icon={stockCategoryIcon(catLabel)}
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
                      className="flex justify-between items-start gap-2 py-1.5 border-b border-stone-100 last:border-0 cursor-pointer active:bg-stone-100"
                      onClick={() => onClick(item)}
                    >
                      {/* 商品名側を広くとる（店名は右カラムで価格の下に折り返す） */}
                      <div className="flex items-start gap-1.5 min-w-0 flex-1">
                        <ProductImage
                          name={item.name}
                          icon={item.icon}
                          photoUrl={item.photo_url}
                          width={100}
                          className="w-6 h-6 rounded-md flex-shrink-0 mt-0.5"
                        />
                        <div className="min-w-0">
                          <span className="font-medium text-stone-600 leading-snug break-words">
                            {item.name}
                            {item.is_new && (
                              <span className="bg-amber-400 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 align-middle whitespace-nowrap">
                                NEW
                              </span>
                            )}
                            {(item.bonus_points ?? 0) > 0 && (
                              <span className="bg-violet-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 align-middle whitespace-nowrap">
                                +{item.bonus_points}pt
                              </span>
                            )}
                          </span>
                          {item.sale_end_date && (
                            <div className="text-stone-400 text-[10px] font-medium leading-tight">
                              {item.sale_end_date}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-[84px] text-right">
                        <strong className="text-rose-600 font-black text-[13px]">
                          {item.price}円
                        </strong>
                        <div className="text-stone-500 text-[9px] leading-tight break-words">
                          {item.shop}
                        </div>
                      </div>
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
