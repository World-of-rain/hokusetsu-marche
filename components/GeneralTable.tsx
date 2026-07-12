import type { GeneralItem, SelectedItem } from "../lib/types";

export type SortKey = "price" | "shop" | "category";

type Props = {
  items: GeneralItem[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  currentTab: "today" | "tomorrow";
  storeFilter: string;
  setStoreFilter: (v: string) => void;
  availableStores: string[];
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  availableCategories: string[];
  onlyOneDay: boolean;
  setOnlyOneDay: (v: boolean) => void;
  onClick: (item: SelectedItem) => void;
};

// 総合特売リスト（検索・絞り込み・ソート付きテーブル）
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
        <h2 className="text-[11px] font-bold text-stone-500 tracking-wider flex items-center gap-1">
          <span>🥩</span> 総合特売リスト
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="商品名で検索..."
            className="flex-1 pl-3 pr-2 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-shadow"
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="text-xs font-bold bg-white border border-stone-200 rounded-xl px-2 focus:outline-none text-stone-600"
          >
            <option value="price">価格が安い順</option>
            <option value="shop">お店の順</option>
            <option value="category">ジャンル順</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 pb-1">
          <div className="flex gap-1.5 overflow-x-auto no-sb pb-1">
            <button
              onClick={() => setStoreFilter("all")}
              className={`flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                storeFilter === "all" ? "bg-rose-500 text-white" : "bg-stone-100 text-stone-500"
              }`}
            >
              すべての店舗
            </button>
            {availableStores.map((store) => (
              <button
                key={store}
                onClick={() => setStoreFilter(store)}
                className={`flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                  storeFilter === store ? "bg-rose-500 text-white" : "bg-stone-100 text-stone-500"
                }`}
              >
                {store}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 items-center overflow-x-auto no-sb pb-1">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                categoryFilter === "all" ? "bg-rose-500 text-white" : "bg-stone-100 text-stone-500"
              }`}
            >
              すべてのジャンル
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                  categoryFilter === cat ? "bg-rose-500 text-white" : "bg-stone-100 text-stone-500"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="w-px h-4 bg-stone-300 mx-1 flex-shrink-0"></div>
            <button
              onClick={() => setOnlyOneDay(!onlyOneDay)}
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-[10px] font-bold text-stone-400 border-b border-stone-100">
              <th className="p-3 pl-4">商品名</th>
              <th className="p-3 text-right">最安値</th>
              <th className="p-3 pr-4 text-right">取扱店</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-stone-400 text-xs">
                  対象の商品はありません
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr
                  key={i}
                  className="hover:bg-rose-50/30 transition-colors bg-white even:bg-stone-50/50 cursor-pointer active:bg-stone-100"
                  onClick={() => onClick(item)}
                >
                  <td className="p-3 pl-4 text-xs">
                    <div className="flex items-center flex-wrap gap-1">
                      <span className="font-bold text-stone-700">{item.name}</span>
                      {item.is_new && (
                        <span className="bg-amber-400 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                          NEW
                        </span>
                      )}
                      {item.is_one_day_sale && (
                        <span className="bg-teal-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                          本日限り
                        </span>
                      )}
                      {!item.is_one_day_sale && item.sale_end_date && (
                        <span className="text-stone-400 text-[10px] font-medium ml-1">
                          {item.sale_end_date}
                        </span>
                      )}
                    </div>
                    {item.warning && currentTab === "today" && (
                      <span className="inline-block mt-1 text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full animate-pulse">
                        🛑 明日まで待って！
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-sm font-black text-rose-600 text-right whitespace-nowrap">
                    {item.price}円
                  </td>
                  <td className="p-3 pr-4 text-[11px] text-stone-500 text-right whitespace-nowrap">
                    {item.shop}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
