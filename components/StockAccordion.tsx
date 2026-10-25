import type { ReactNode } from "react";
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

// ストック・まとめ買い品のカテゴリ別の引き出し。紙面の索引のように番号と罫線で並べる
export default function StockAccordion({
  stocks,
  openIdx,
  onToggle,
  onClick,
  picker,
  emptyMessage,
}: Props) {
  return (
    <div>
      {picker}
      {stocks.length === 0 && emptyMessage && (
        <p className="rounded-2xl border border-dashed border-ink/25 py-6 text-center text-[13px] text-ink-mute">
          {emptyMessage}
        </p>
      )}
      <ul className="border-t rule-strong">
        {stocks.map((s, i) => {
          const hasItem = s.items.length > 0;
          const isOpen = openIdx === i;
          const catLabel = cleanCategoryLabel(s.cat);
          return (
            <li
              key={i}
              className="border-b rule"
              data-reveal
              data-reveal-delay={String(Math.min(i, 6) * 0.05)}
            >
              <button
                type="button"
                onClick={() => hasItem && onToggle(i)}
                aria-expanded={isOpen}
                className={`group flex w-full items-center gap-3 py-4 text-left transition-colors md:gap-4 ${
                  hasItem ? "hover:text-persimmon" : "cursor-not-allowed opacity-50"
                }`}
              >
                <span className="num hidden w-8 text-sm text-ink-mute sm:inline">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <FoodIcon
                  name={catLabel}
                  icon={stockCategoryIcon(catLabel)}
                  className="h-11 w-11 shrink-0 rounded-xl"
                  padClassName="p-[16%]"
                />
                <span className="phrase min-w-0 font-display text-lg leading-tight text-ink group-hover:text-persimmon sm:text-xl md:text-2xl">
                  {catLabel}
                </span>
                <span className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-bold ${
                      hasItem ? "bg-mustard-tint text-ink" : "bg-paper-deep text-ink-mute"
                    }`}
                  >
                    {hasItem ? `${s.items.length}件あり` : "特売なし"}
                  </span>
                  {hasItem && (
                    <span
                      aria-hidden="true"
                      className={`grid h-8 w-8 place-items-center rounded-full border border-ink/25 text-lg transition-transform duration-500 ease-out ${
                        isOpen ? "rotate-45 border-ink bg-ink text-paper" : ""
                      }`}
                    >
                      +
                    </span>
                  )}
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <ul className="grid gap-x-8 pb-5 md:grid-cols-2 md:pl-12">
                    {s.items.map((item, j) => (
                      <li key={j}>
                        <button
                          type="button"
                          tabIndex={isOpen ? 0 : -1}
                          onClick={() => onClick(item)}
                          className="flex w-full items-center gap-3 border-b border-dashed border-ink/15 py-3 text-left hover:bg-paper-light"
                        >
                          <ProductImage
                            name={item.name}
                            icon={item.icon}
                            photoUrl={item.photo_url}
                            width={100}
                            className="h-10 w-10 shrink-0 rounded-xl border rule"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14px] font-bold leading-snug text-ink">
                              {item.name}
                              {item.is_new && (
                                <span className="ml-1.5 rounded-full bg-mustard px-1.5 py-0.5 align-middle text-[9px] font-bold">
                                  NEW
                                </span>
                              )}
                              {(item.bonus_points ?? 0) > 0 && (
                                <span className="ml-1.5 rounded-full bg-plum px-1.5 py-0.5 align-middle text-[9px] font-bold text-white">
                                  +{item.bonus_points}pt
                                </span>
                              )}
                            </span>
                            <span className="block text-[11px] text-ink-mute">
                              {item.shop}
                              {item.sale_end_date ? ` ・ ${item.sale_end_date}` : ""}
                            </span>
                          </span>
                          <span className="num shrink-0 text-2xl text-persimmon">
                            {item.price}
                            <span className="font-sans text-[11px] font-bold">円</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
