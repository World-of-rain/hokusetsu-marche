import ProductImage from "./ProductImage";
import SectionHeading from "./SectionHeading";
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

// 総合特売リスト（検索・絞り込み・ソート・お気に入りピン留め付きテーブル）
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
    <section className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      ></div>

      <div className="p-4 border-b border-stone-100 bg-[#faf9f8] space-y-3 relative z-10">
        <SectionHeading
          variant="list"
          title="総合特売リスト"
          tint="text-rose-600"
          chipBg="from-rose-400 to-pink-400"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="商品名で検索（ひらがなでもOK）..."
            aria-label="商品名で検索"
            className="flex-1 pl-3 pr-2 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-shadow"
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="並び順"
            className="text-xs font-bold bg-white border border-stone-200 rounded-xl px-2 focus:outline-none text-stone-600"
          >
            <option value="price">価格が安い順</option>
            <option value="unit_price">単位あたりが安い順</option>
            <option value="shop">お店の順</option>
            <option value="category">ジャンル順</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 pb-1">
          <div className="flex gap-1.5 overflow-x-auto no-sb pb-1">
            <button
              onClick={() => setStoreFilter("all")}
              aria-pressed={storeFilter === "all"}
              className={`flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                storeFilter === "all" ? "bg-rose-500 text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              すべての店舗
            </button>
            {availableStores.map((store) => (
              <button
                key={store}
                onClick={() => setStoreFilter(store)}
                aria-pressed={storeFilter === store}
                className={`flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                  storeFilter === store ? "bg-rose-500 text-white" : "bg-stone-100 text-stone-600"
                }`}
              >
                {store}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 items-center">
            <select
              value={availableCategories.includes(categoryFilter) ? categoryFilter : "all"}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="ジャンルで絞り込み"
              className={`flex-1 min-w-0 text-[11px] font-bold rounded-full px-3 py-1.5 border transition-colors focus:outline-none ${
                categoryFilter !== "all"
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-stone-100 text-stone-600 border-stone-100"
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
              onClick={() => setOnlyOneDay(!onlyOneDay)}
              aria-pressed={onlyOneDay}
              className={`flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors border ${
                onlyOneDay
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white text-teal-600 border-teal-200"
              }`}
            >
              {onlyOneDay ? "✓ 本日のみ" : "本日のみ"}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-stone-50 text-[10px] font-bold text-stone-500 border-b border-stone-100">
              <th className="p-2 pl-3 w-7">
                <span className="sr-only">お気に入り</span>
              </th>
              <th className="p-3 pl-1">商品名</th>
              <th className="p-2 text-right w-14">最安値</th>
              <th className="p-2 pr-3 text-right w-[72px]">取扱店</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-500 text-xs">
                  対象の商品はありません
                </td>
              </tr>
            ) : (
              items.map((item, i) => {
                const isFavorite = favorites.includes(item.name);
                return (
                  <tr
                    key={i}
                    className={`hover:bg-rose-50/30 transition-colors cursor-pointer active:bg-stone-100 ${
                      isFavorite ? "bg-amber-50/60" : "bg-white even:bg-stone-50/50"
                    }`}
                    onClick={() => onClick(item)}
                  >
                    <td className="p-2 pl-3">
                      <button
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
                        className={`text-base leading-none p-1 rounded-full transition-transform active:scale-125 ${
                          isFavorite ? "text-amber-500" : "text-stone-300 hover:text-amber-400"
                        }`}
                      >
                        {isFavorite ? "★" : "☆"}
                      </button>
                    </td>
                    <td className="p-2 pl-1 text-xs">
                      <div className="flex items-center gap-2">
                        <ProductImage
                          name={item.name}
                          category={item.category}
                          icon={item.icon}
                          photoUrl={item.photo_url}
                          width={120}
                          className="w-8 h-8 rounded-lg flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-baseline flex-wrap gap-x-1 gap-y-0.5">
                            <span className="font-bold text-stone-700 leading-snug">{item.name}</span>
                            {item.is_new && (
                              <span className="bg-amber-400 text-white text-[8px] leading-none px-1 py-0.5 rounded font-bold align-middle">
                                NEW
                              </span>
                            )}
                            {item.is_one_day_sale && (
                              <span className="bg-teal-500 text-white text-[8px] leading-none px-1 py-0.5 rounded font-bold align-middle">
                                本日限り
                              </span>
                            )}
                            {!item.is_one_day_sale && item.sale_end_date && (
                              <span className="text-stone-400 text-[9px] font-medium">
                                {item.sale_end_date}
                              </span>
                            )}
                          </div>
                          {item.warning && currentTab === "today" && (
                            <span className="inline-flex items-center gap-0.5 mt-0.5 text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-px rounded-full">
                              <Glyph name="stop" className="w-2.5 h-2.5" /> 明日まで待って
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-sm font-black text-rose-600 text-right whitespace-nowrap align-top">
                      {item.price}
                      <span className="text-[10px] font-bold">円</span>
                      {item.unit_price_text && (
                        <div className="text-[8px] font-medium text-stone-400 leading-tight whitespace-normal">
                          {item.unit_price_text}
                        </div>
                      )}
                    </td>
                    <td className="p-2 pr-3 text-[10px] text-stone-600 text-right align-top whitespace-normal break-words leading-tight">
                      {item.shop}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
