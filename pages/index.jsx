import { useState, useMemo } from "react";
import Head from "next/head";
import { fetchSaleData } from "../lib/db";

const SAMPLE_DATA = {
  lastUpdated: "取得失敗",
  daily: [],
  stocks: [],
  highlights: [],
  general: [],
};

function FallbackImage({ src, alt, className }) {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    const initial = alt ? alt.charAt(0) : "🛒";
    return (
      <div className={`flex items-center justify-center bg-stone-200 text-stone-500 font-bold ${className}`}>
        {initial}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  );
}

function NativeAd({ title, description, imgUrl }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden relative flex p-3 gap-3 my-4">
      <span className="absolute top-0 right-0 bg-stone-200 text-stone-500 text-[9px] px-1.5 py-0.5 rounded-bl-lg font-bold z-10">
        スポンサーリンク
      </span>
      <FallbackImage src={imgUrl} alt="ad" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
      <div className="flex-1 pt-1">
        <h3 className="text-xs font-black text-stone-700 leading-tight">{title}</h3>
        <p className="text-[10px] text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ▼▼▼ 新規追加：ボトムシート（詳細情報モーダル） ▼▼▼
function BottomSheet({ item, onClose }) {
  if (!item) return null;

  const discountRate = item.avg_price > 0 && item.price > 0 
    ? Math.round(((item.avg_price - item.price) / item.avg_price) * 100) 
    : 0;

  return (
    <>
      {/* 背景のオーバーレイ */}
      <div 
        className="fixed inset-0 bg-black/40 z-[100] transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* ボトムシート本体 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[101] p-5 pb-8 shadow-2xl transform transition-transform max-w-md mx-auto">
        <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-4"></div>
        
        <div className="flex gap-4 items-start mb-4">
          <FallbackImage src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-2xl shadow-sm" />
          <div>
            <h3 className="font-black text-stone-800 text-lg leading-tight">{item.name}</h3>
            <p className="text-stone-500 text-xs mt-1">{item.shop}</p>
          </div>
        </div>

        <div className="bg-[#faf9f8] rounded-2xl p-4 mb-4 border border-stone-100">
          <div className="flex justify-between items-end mb-2">
            <span className="text-stone-500 text-xs font-bold">特売価格</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-rose-600 leading-none">{item.price}</span>
              <span className="text-rose-600 font-bold">円</span>
            </div>
          </div>
          
          {item.avg_price > 0 && (
            <div className="flex justify-between items-center py-2 border-t border-stone-200/60 border-dashed">
              <span className="text-stone-500 text-[11px]">過去の平均価格</span>
              <span className="text-stone-700 text-xs font-bold">{item.avg_price}円</span>
            </div>
          )}
          {item.min_price > 0 && (
            <div className="flex justify-between items-center py-2 border-t border-stone-200/60 border-dashed">
              <span className="text-stone-500 text-[11px]">過去最安値</span>
              <span className="text-stone-700 text-xs font-bold">{item.min_price}円</span>
            </div>
          )}
          
          {discountRate > 0 && (
            <div className="mt-2 bg-rose-100 text-rose-700 text-xs font-bold text-center py-1.5 rounded-xl">
              平均より {discountRate}% お得！🎉
            </div>
          )}
        </div>

        <div className="space-y-3">
          {item.purchase_condition && (
            <div className="flex gap-2 items-start bg-amber-50 p-3 rounded-xl border border-amber-100">
              <span className="text-amber-500 mt-0.5">⚠️</span>
              <div>
                <div className="text-[10px] font-bold text-amber-700 mb-0.5">購入条件・備考</div>
                <div className="text-xs text-amber-900 font-medium">{item.purchase_condition}</div>
              </div>
            </div>
          )}
          
          {(item.sale_start_date || item.sale_end_date) && (
            <div className="flex gap-2 items-center text-xs text-stone-600 bg-stone-50 p-3 rounded-xl">
              <span>📅</span>
              <span className="font-medium">
                販売期間: {item.sale_start_date || "本日"} 〜 {item.sale_end_date ? item.sale_end_date.replace("まで", "") : "未定"}
              </span>
            </div>
          )}

          {item.comment && (
            <div className="flex gap-2 items-start text-xs text-teal-800 bg-teal-50 p-3 rounded-xl">
              <span>💡</span>
              <span className="font-medium leading-relaxed">{item.comment}</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-6 bg-stone-800 text-white font-bold py-3.5 rounded-2xl active:bg-stone-700 transition-colors"
        >
          閉じる
        </button>
      </div>
    </>
  );
}
// ▲▲▲  ここまで  ▲▲▲

function DailyCarouselItem({ item, onClick }) {
  const todaySlot    = item.schedule.find(s => s.day.includes("今日"));
  const tomorrowSlot = item.schedule.find(s => s.day.includes("明日"));
  const firstMinSlot = item.schedule.find(s => s.isMin);

  const adviceSlot = todaySlot?.isMin    ? todaySlot
                   : tomorrowSlot?.isMin ? tomorrowSlot
                   : firstMinSlot        ?? null;

  const advicePrefix = !adviceSlot                        ? "💡 "
    : adviceSlot.day.includes("今日")                     ? "💡 今日が買い！："
    : adviceSlot.day.includes("明日")                     ? "⏳ 明日まで待って："
    : `📅 ${adviceSlot.day}が狙い目：`;

  const adviceText = adviceSlot?.advice || "今週の底値曜日をチェックして計画的に購入しましょう。";

  return (
    <div className="border-b border-stone-100 last:border-0 pb-4 last:pb-0">
      <div 
        className="text-[13px] font-bold text-stone-700 mb-2 flex items-center gap-2 cursor-pointer active:opacity-50"
        onClick={() => onClick({
          name: item.name,
          shop: firstMinSlot?.shop || "-",
          price: firstMinSlot?.price || 0,
          image: item.image,
          avg_price: item.avg_price,
          min_price: item.min_price,
          sale_end_date: item.sale_end_date,
          purchase_condition: firstMinSlot?.purchase_condition || "",
          comment: adviceText
        })}
      >
        <FallbackImage src={item.image} alt={item.name} className="w-6 h-6 rounded-full object-cover shadow-sm" />
        <div className="flex items-center flex-wrap gap-1">
          <span>{item.name}</span>
          {item.is_new && <span className="bg-amber-400 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">NEW</span>}
          {item.sale_end_date && <span className="text-stone-400 text-[10px] font-medium ml-1">{item.sale_end_date}</span>}
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto py-1 no-sb">
        {item.schedule.map((s, i) => (
          <div
            key={i}
            className={`flex-shrink-0 w-[86px] p-2 rounded-2xl border text-center transition-all ${
              s.isMin
                ? "bg-rose-50 border-rose-200 shadow-sm ring-1 ring-rose-100"
                : "bg-white border-stone-200"
            }`}
          >
            <div className="text-[10px] text-stone-500 font-medium mb-0.5">{s.day}</div>
            <div className={`text-[13px] font-black ${s.isMin ? "text-rose-600" : "text-stone-700"}`}>
              {s.price > 0 ? `${s.price}円` : "-"}
            </div>
            <div className="text-[9px] text-stone-400 truncate mt-0.5">{s.shop}</div>
            
            {s.isMin && (
              <div className="inline-block mt-1 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wide">
                ★最安値
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-[11px] text-teal-800 bg-teal-50/70 border border-teal-100 rounded-xl p-2.5 mt-3 font-medium leading-relaxed">
        <span className="font-bold">{advicePrefix}</span>{adviceText}
      </div>
    </div>
  );
}

function StockAccordion({ stocks, openIdx, onToggle, onClick }) {
  return (
    <section>
      <h2 className="text-[11px] font-bold text-stone-500 tracking-wider mb-2 px-1 flex items-center gap-1">
        <span>🥫</span> ストック・まとめ買いのチャンス
      </h2>
      <div className="space-y-1.5">
        {stocks.map((s, i) => {
          const hasItem = s.items.length > 0;
          const isOpen  = openIdx === i;
          return (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
              <button
                onClick={() => hasItem && onToggle(i)}
                className={`w-full p-2.5 flex justify-between items-center text-xs transition-colors ${
                  hasItem ? "cursor-pointer hover:bg-stone-50 active:bg-stone-100" : "opacity-50 cursor-not-allowed"
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
                        {item.is_new && <span className="bg-amber-400 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">NEW</span>}
                        {item.sale_end_date && <span className="text-stone-400 text-[9px] font-medium ml-1">{item.sale_end_date}</span>}
                      </div>
                      <span className="flex-shrink-0">
                        <strong className="text-rose-600 font-black text-[13px]">{item.price}円</strong>
                        <span className="text-stone-400 text-[9px] ml-1">({item.shop})</span>
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

function HighlightCard({ h, onClick }) {
  return (
    <div 
      className="bg-white p-2.5 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden flex gap-2.5 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => onClick(h)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-rose-400"></div>
      
      <FallbackImage src={h.image} alt={h.name} className="w-12 h-12 object-cover rounded-xl flex-shrink-0 ml-1 shadow-sm text-lg" />
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center flex-wrap gap-1">
            <span className="font-black text-xs text-stone-800 leading-tight">{h.name}</span>
            {h.is_new && <span className="bg-amber-400 text-white text-[8px] px-1 py-0.5 rounded-full font-bold">NEW</span>}
            {!h.is_one_day_sale && h.sale_end_date && <span className="text-stone-400 text-[9px] font-medium ml-1">{h.sale_end_date}</span>}
          </div>
          <span className="flex-shrink-0 ml-1 text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-bold">
            {h.day === "today" ? "今日限定" : "明日限定"}
          </span>
        </div>
        <div className="text-[10px] text-stone-500 mt-1 leading-relaxed">
          {h.comment || "過去の平均価格より大幅にお得！見逃し厳禁の特売品です。"}
        </div>
        <div className="text-right mt-1.5 pt-1.5 border-t border-dashed border-stone-200">
          <span className="text-stone-400 text-[9px]">({h.shop})</span>
          <span className="text-base font-black text-rose-600 ml-1 tracking-tight">{h.price}円</span>
        </div>
      </div>
    </div>
  );
}

function GeneralTable({ items, searchQuery, setSearchQuery, sortKey, setSortKey, currentTab, storeFilter, setStoreFilter, availableStores, categoryFilter, setCategoryFilter, availableCategories, onlyOneDay, setOnlyOneDay, onClick }) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
      
      <div className="p-4 border-b border-stone-100 bg-[#faf9f8] space-y-3 relative z-10">
        <h2 className="text-[11px] font-bold text-stone-500 tracking-wider flex items-center gap-1">
          <span>🥩</span> 総合特売リスト
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="商品名で検索..."
            className="flex-1 pl-3 pr-2 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-shadow"
          />
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value)}
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
            {availableStores.map(store => (
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
            {availableCategories.map(cat => (
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
                onlyOneDay ? "bg-teal-500 text-white border-teal-500" : "bg-white text-teal-600 border-teal-200"
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
                      {item.is_new && <span className="bg-amber-400 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">NEW</span>}
                      {item.is_one_day_sale && <span className="bg-teal-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">本日限り</span>}
                      {!item.is_one_day_sale && item.sale_end_date && <span className="text-stone-400 text-[10px] font-medium ml-1">{item.sale_end_date}</span>}
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

export default function Dashboard({ data }) {
  const [currentTab,    setCurrentTab]    = useState("today");
  const [sortKey,       setSortKey]       = useState("price");
  const [searchQuery,   setSearchQuery]   = useState("");
  const [openAccordion, setOpenAccordion] = useState(null);
  const [storeFilter,   setStoreFilter]   = useState("all");
  const [categoryFilter,setCategoryFilter]= useState("all");
  const [onlyOneDay,    setOnlyOneDay]    = useState(false);
  const [selectedItem,  setSelectedItem]  = useState(null); // ボトムシート用

  const toggleAccordion = idx =>
    setOpenAccordion(prev => (prev === idx ? null : idx));

  const filteredHighlights = useMemo(
    () => data.highlights.filter(h => h.day === currentTab),
    [data.highlights, currentTab]
  );

  const availableStores = useMemo(
    () => [...new Set(data.general.map(item => item.shop))].sort((a, b) => a.localeCompare(b, "ja")),
    [data.general]
  );

  const availableCategories = useMemo(
    () => [...new Set(data.general.map(item => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ja")),
    [data.general]
  );

  const filteredGeneral = useMemo(() => {
    return [...data.general]
      .filter(item => item.day === currentTab)
      .filter(item => storeFilter === "all" || item.shop === storeFilter)
      .filter(item => categoryFilter === "all" || item.category === categoryFilter)
      .filter(item => !onlyOneDay || item.is_one_day_sale)
      .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortKey === "price") return a.price - b.price;
        if (sortKey === "shop") return a.shop.localeCompare(b.shop, "ja");
        if (sortKey === "category") return (a.category || "").localeCompare(b.category || "", "ja");
        return 0;
      });
  }, [data.general, currentTab, storeFilter, categoryFilter, onlyOneDay, searchQuery, sortKey]);

  const tabCls = active =>
    `flex-1 py-3.5 font-bold rounded-2xl text-center text-[13px] transition-all duration-200 ${
      active 
        ? "bg-rose-500 text-white shadow-md shadow-rose-200" 
        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
    }`;

  const formattedStocks = useMemo(() => {
    const groups = {};
    data.stocks.forEach(s => {
      const minSlot = s.schedule.find(slot => slot.isMin) || s.schedule.find(slot => slot.price > 0);
      if (!minSlot) return;
      const label = s.category_label || "その他ストック";
      if (!groups[label]) groups[label] = [];
      groups[label].push({ 
        name: s.name, 
        price: minSlot.price, 
        shop: minSlot.shop, 
        is_new: s.is_new, 
        sale_end_date: s.sale_end_date,
        image: s.image,
        avg_price: s.avg_price,
        min_price: s.min_price,
        purchase_condition: minSlot.purchase_condition,
        comment: minSlot.advice
      });
    });
    return Object.entries(groups).map(([cat, items]) => ({ cat, items }));
  }, [data.stocks]);

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const formatDate = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
  const todayStr = formatDate(todayDate);
  const tomorrowStr = formatDate(tomorrowDate);

  return (
    <div className="bg-[#f5f4f1] font-sans antialiased text-stone-800 min-h-screen">
      <Head>
        <title>北摂マルシェ 〜豊南エリア特売情報〜</title>
      </Head>
      <style>{`.no-sb::-webkit-scrollbar{display:none}.no-sb{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <div className="max-w-md mx-auto bg-[#faf9f8] min-h-screen pb-12 shadow-xl relative">

        <div className="h-48 w-full relative">
          <FallbackImage 
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop" 
            alt="Supermarket" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/20 to-[#faf9f8]"></div>
        </div>

        <header className="bg-white/70 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-50 p-4 pb-3 pt-4 -mt-16 rounded-t-3xl">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-base font-black text-stone-800 tracking-tight drop-shadow-sm">
              🛒 北摂マルシェ
            </h1>
            <span className="text-[10px] bg-white/80 text-stone-600 px-2.5 py-1 rounded-full font-bold shadow-sm border border-stone-100">
              本日 {data.lastUpdated} 更新
            </span>
          </div>
          <p className="text-[10px] text-stone-500 font-medium leading-relaxed">
            豊南エリアのスーパー（ライフ・ダイエー・サタケ・万代など）のチラシ情報をAIが毎日集約！いつ・どこで買うのが一番お得か、一目でわかります。
          </p>
        </header>

        <main className="p-4 space-y-6">

          <section className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100">
            <h2 className="text-[11px] font-bold text-stone-500 tracking-wider mb-4 flex items-center gap-1">
              <span>🥛</span> 毎日の必需品 1週間底値カレンダー
            </h2>
            <div className="space-y-4">
              {data.daily.length > 0 ? (
                data.daily.map((item, i) => <DailyCarouselItem key={i} item={item} onClick={setSelectedItem} />)
              ) : (
                <p className="text-xs text-stone-400 text-center py-4">データがありません</p>
              )}
            </div>
          </section>

          <NativeAd 
            title="【PR】豊中駅前の家事代行サービス" 
            description="お買い物からお料理まで。初回お試しキャンペーン実施中！"
            imgUrl="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&q=80"
          />

          <StockAccordion
            stocks={formattedStocks}
            openIdx={openAccordion}
            onToggle={toggleAccordion}
            onClick={setSelectedItem}
          />

          <div className="flex gap-2.5 bg-stone-100/50 p-1 rounded-3xl">
            <button onClick={() => setCurrentTab("today")}    className={tabCls(currentTab === "today")}>
              今日({todayStr})の特売品
            </button>
            <button onClick={() => setCurrentTab("tomorrow")} className={tabCls(currentTab === "tomorrow")}>
              明日({tomorrowStr})の特売品
            </button>
          </div>

          <section className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-3xl border border-orange-100 shadow-sm">
            <h2 className="text-[11px] font-bold text-orange-600 tracking-wider mb-3 flex items-center gap-1">
              <span>🔥</span> 見落とし厳禁！エリア最高目玉品
            </h2>
            <div className="space-y-3">
              {filteredHighlights.length > 0
                ? filteredHighlights.map((h, i) => <HighlightCard key={i} h={h} onClick={setSelectedItem} />)
                : (
                  <p className="text-[11px] text-orange-400 text-center py-3 bg-white/50 rounded-xl">
                    {currentTab === "today" ? "今日" : "明日"}の目玉品はありません
                  </p>
                )
              }
            </div>
          </section>

          <GeneralTable
            items={filteredGeneral}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortKey={sortKey}
            setSortKey={setSortKey}
            currentTab={currentTab}
            storeFilter={storeFilter}
            setStoreFilter={setStoreFilter}
            availableStores={availableStores}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            availableCategories={availableCategories}
            onlyOneDay={onlyOneDay}
            setOnlyOneDay={setOnlyOneDay}
            onClick={setSelectedItem}
          />

          <NativeAd 
            title="【PR】お得なクレジットカード" 
            description="スーパーでの買い物が常にポイント2倍！今なら5000ptプレゼント"
            imgUrl="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&q=80"
          />

          <div className="text-center pt-4 pb-2">
            <p className="text-[11px] text-stone-500 font-bold mb-2">【データ取得対象スーパー】</p>
            <div className="flex flex-wrap justify-center gap-2 text-[10px]">
              <a href="https://tokubai.co.jp/%E3%83%A9%E3%82%A4%E3%83%95/7345" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ライフ 庄内店</a>
              <a href="https://tokubai.co.jp/%E3%83%80%E3%82%A4%E3%82%A8%E3%83%BC/10014" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ダイエー 豊中店</a>
              <a href="https://satake-takenoko.co.jp/flyer/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">サタケ 豊南店</a>
              <a href="https://tokubai.co.jp/%E4%B8%87%E4%BB%A3/14011" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">万代 豊中豊南店</a>
              <a href="https://tokubai.co.jp/%E3%82%B5%E3%83%B3%E3%83%87%E3%82%A3/14012" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">サンディ 庄内栄町店</a>
              <a href="https://tokubai.co.jp/%E3%82%B8%E3%83%A3%E3%83%91%E3%83%B3/14013" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ジャパン 豊中庄内店</a>
              <a href="https://tokubai.co.jp/%E3%82%B9%E3%82%AE%E8%96%AC%E5%B1%80/14014" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">スギ薬局 豊中庄内店</a>
            </div>
          </div>

        </main>
      </div>
      
      {/* ボトムシートの呼び出し */}
      <BottomSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

export async function getStaticProps() {
  const data = await fetchSaleData();
  
  if (!data && process.env.NODE_ENV === 'production') {
    throw new Error("Failed to fetch sale data during production build. Aborting to keep the previous successful deployment.");
  }

  return {
    props: {
      data: data || SAMPLE_DATA,
    },
  };
}