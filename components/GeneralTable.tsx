import ProductImage from "./ProductImage";
import Glyph from "./Glyph";
import type { GeneralItem, SelectedItem } from "../lib/types";

export type SortKey = "price" | "unit_price" | "shop" | "category";

type Props = {
  items: GeneralItem[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  currentTab: "today" | "tomorrow" | "week";
  storeFilter: string;
  setStoreFilter: (v: string) => void;
  availableStores: string[];
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  availableCategories: string[];
  onlyOneDay: boolean;
  setOnlyOneDay: (v: boolean) => void;
  favorites: string[];
  onToggleFavorite: (name: string) => void;
  onClick: (item: SelectedItem) => void;
};

const chip = (on: boolean) =>
  `shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition-colors ${
    on
      ? "border-ink bg-ink text-paper"
      : "border-ink/20 text-ink-soft hover:border-ink hover:text-ink"
  }`;

// 総合特売リスト（検索・絞り込み・並べ替え・お気に入りのピン留め付きの表）
export default function GeneralTable({
  items,
  searchQuery,
  setSearchQuery,
  sortKey,
  setSortKey,
  currentTab,
  storeFilter,
  setStoreFilter,
  availableStores,
  categoryFilter,
  setCategoryFilter,
  availableCategories,
  onlyOneDay,
  setOnlyOneDay,
  favorites,
  onToggleFavorite,
  onClick,
}: Props) {
  return (
    <div>
      {/* 操作の帯 */}
      <div className="space-y-3 rounded-[22px] border border-ink/15 bg-paper-light p-4 md:p-5">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">商品名で検索</span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
              fill="none"
            >
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
              <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="商品名で検索（ひらがなでもOK）"
              aria-label="商品名で検索"
              className="w-full rounded-full border border-ink/20 bg-paper py-3 pl-11 pr-4 text-[15px] placeholder:text-ink-mute focus:border-ink focus:outline-none"
            />
          </label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="並び順"
            className="rounded-full border border-ink/20 bg-paper px-4 py-3 text-[13px] font-bold text-ink focus:border-ink focus:outline-none"
          >
            <option value="price">価格が安い順</option>
            <option value="unit_price">単位あたりが安い順</option>
            <option value="shop">お店の順</option>
            <option value="category">ジャンル順</option>
          </select>
        </div>
        <div className="no-sb -mx-4 flex gap-2 overflow-x-auto px-4 md:-mx-5 md:px-5">
          <button
            type="button"
            onClick={() => setStoreFilter("all")}
            aria-pressed={storeFilter === "all"}
            className={chip(storeFilter === "all")}
          >
            すべての店舗
          </button>
          {availableStores.map((store) => (
            <button
              type="button"
              key={store}
              onClick={() => setStoreFilter(store)}
              aria-pressed={storeFilter === store}
              className={chip(storeFilter === store)}
            >
              {store}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={availableCategories.includes(categoryFilter) ? categoryFilter : "all"}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="ジャンルで絞り込み"
            className={`min-w-0 flex-1 rounded-full border px-4 py-2 text-[12px] font-bold focus:outline-none sm:flex-none ${
              categoryFilter !== "all"
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 bg-paper text-ink-soft"
            }`}
          >
            <option value="all">すべてのジャンル</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setOnlyOneDay(!onlyOneDay)}
            aria-pressed={onlyOneDay}
            className={`shrink-0 rounded-full border px-4 py-2 text-[12px] font-bold transition-colors ${
              onlyOneDay
                ? "border-leaf bg-leaf text-white"
                : "border-leaf/40 text-leaf hover:border-leaf"
            }`}
          >
            {onlyOneDay ? "✓ 本日のみ" : "本日のみ"}
          </button>
          <span className="ml-auto hidden text-[12px] text-ink-mute sm:inline" aria-live="polite">
            <span className="num text-lg text-ink">{items.length}</span> 品
          </span>
        </div>
      </div>

      {/* 表 */}
      <div className="mt-4 overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">特売品の一覧（価格・取扱店）</caption>
          <thead>
            <tr className="border-b-2 rule-strong text-[11px] font-bold tracking-[0.12em] text-ink-mute">
              <th scope="col" className="w-10 py-3">
                <span className="sr-only">お気に入り</span>
              </th>
              <th scope="col" className="py-3">
                商品名
              </th>
              <th scope="col" className="w-24 py-3 text-right sm:w-32">
                最安値
              </th>
              <th scope="col" className="hidden w-48 py-3 pl-4 text-right md:table-cell">
                取扱店
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-14 text-center text-[13px] text-ink-mute">
                  対象の商品はありません
                </td>
              </tr>
            ) : (
              items.map((item, i) => {
                const isFavorite = favorites.includes(item.name);
                return (
                  <tr
                    key={i}
                    className={`group cursor-pointer border-b rule transition-colors hover:bg-paper-light ${
                      isFavorite ? "bg-mustard-tint/50" : ""
                    }`}
                    onClick={() => onClick(item)}
                  >
                    <td className="py-3 align-top">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.name);
                        }}
                        aria-label={
                          isFavorite
                            ? `${item.name}をお気に入りから外す`
                            : `${item.name}をお気に入りに追加`
                        }
                        aria-pressed={isFavorite}
                        className={`grid h-8 w-8 place-items-center rounded-full text-lg transition-transform active:scale-125 ${
                          isFavorite ? "text-mustard" : "text-ink/25 hover:text-mustard"
                        }`}
                      >
                        {isFavorite ? "★" : "☆"}
                      </button>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-3">
                        <ProductImage
                          name={item.name}
                          category={item.category}
                          icon={item.icon}
                          photoUrl={item.photo_url}
                          width={120}
                          className="h-11 w-11 shrink-0 rounded-xl border rule"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                            <span className="text-[15px] font-bold leading-snug text-ink group-hover:text-persimmon">
                              {item.name}
                            </span>
                            {item.is_new && (
                              <span className="rounded bg-mustard px-1 py-0.5 text-[9px] font-bold leading-none">
                                NEW
                              </span>
                            )}
                            {item.is_one_day_sale && (
                              <span className="rounded bg-leaf px-1 py-0.5 text-[9px] font-bold leading-none text-white">
                                本日限り
                              </span>
                            )}
                            {item.bonus_points > 0 && (
                              <span className="rounded bg-plum px-1 py-0.5 text-[9px] font-bold leading-none text-white">
                                +{item.bonus_points}pt
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[11px] text-ink-mute">
                            <span className="md:hidden">{item.shop}</span>
                            {!item.is_one_day_sale && item.sale_end_date && (
                              <span>
                                <span className="md:hidden"> ・ </span>
                                {item.sale_end_date}
                              </span>
                            )}
                          </div>
                          {item.warning && currentTab === "today" && (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-persimmon-tint px-2 py-0.5 text-[10px] font-bold text-persimmon-deep">
                              <Glyph name="stop" className="h-3 w-3" /> 明日まで待って
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right align-top">
                      <span className="num text-[1.6rem] leading-none text-persimmon">
                        {item.price}
                        <span className="font-sans text-[11px] font-bold">円</span>
                      </span>
                      {item.unit_price_text && (
                        <span className="mt-1 block text-[10px] leading-tight text-ink-mute">
                          {item.unit_price_text}
                        </span>
                      )}
                    </td>
                    <td className="hidden py-3 pl-4 text-right align-top text-[12px] font-bold text-ink-soft md:table-cell">
                      {item.shop}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
