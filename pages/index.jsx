/**
 * pages/index.jsx  ─  豊中駅前 特売ダッシュボード
 */

import { useState, useMemo } from "react";
import { fetchSaleData } from "../lib/db";

// ================================================================
// サンプルデータ (API取得失敗時のフォールバック)
// ================================================================
const SAMPLE_DATA = {
  lastUpdated: "取得失敗",
  daily: [],
  stocks: [],
  highlights: [],
  general: [],
};

// ================================================================
// NativeAd: インフィード広告コンポーネント
// ================================================================
function NativeAd({ title, description, imgUrl }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden relative flex p-3 gap-3 my-4">
      <span className="absolute top-0 right-0 bg-stone-200 text-stone-500 text-[9px] px-1.5 py-0.5 rounded-bl-lg font-bold z-10">
        スポンサーリンク
      </span>
      <img src={imgUrl} alt="ad" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
      <div className="flex-1 pt-1">
        <h3 className="text-xs font-black text-stone-700 leading-tight">{title}</h3>
        <p className="text-[10px] text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ================================================================
// DailyCarouselItem: 1品目のカルーセル行 + アドバイスボックス
// ================================================================
function DailyCarouselItem({ item }) {
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
      <div className="text-[13px] font-bold text-stone-700 mb-2 flex items-center gap-2">
        <img src={item.image} alt={item.name} className="w-6 h-6 rounded-full object-cover shadow-sm" />
        <span>{item.name}</span>
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

// ================================================================
// StockAccordion: 排他制御アコーディオン
// ================================================================
function StockAccordion({ stocks, openIdx, onToggle }) {
  return (
    <section>
      <h2 className="text-[11px] font-bold text-stone-500 tracking-wider mb-2 px-1 flex items-center gap-1">
        <span>🥫</span> ストック・まとめ買いのチャンス
      </h2>
      <div className="space-y-2.5">
        {stocks.map((s, i) => {
          const hasItem = s.items.length > 0;
          const isOpen  = openIdx === i;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <button
                onClick={() => hasItem && onToggle(i)}
                className={`w-full p-3.5 flex justify-between items-center text-xs transition-colors ${
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
                  maxHeight: isOpen ? "500px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div className="px-4 pb-3 pt-2 text-xs border-t border-stone-50 bg-[#faf9f8]">
                  {s.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0"
                    >
                      <span className="font-medium text-stone-600 mr-2">{item.name}</span>
                      <span className="flex-shrink-0">
                        <strong className="text-rose-600 font-black text-[13px]">{item.price}円</strong>
                        <span className="text-stone-400 text-[10px] ml-1">({item.shop})</span>
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

// ================================================================
// HighlightCard: 目玉商品カード（画像付き）
// ================================================================
function HighlightCard({ h }) {
  return (
    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden flex gap-3">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-rose-400"></div>
      
      <img src={h.image} alt={h.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0 ml-1 shadow-sm" />
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span className="font-black text-[13px] text-stone-800 leading-tight">{h.name}</span>
          <span className="flex-shrink-0 ml-2 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
            {h.day === "today" ? "今日限定" : "明日限定"}
          </span>
        </div>
        <div className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
          過去の平均価格より大幅にお得！見逃し厳禁の特売品です。
        </div>
        <div className="text-right mt-2.5 pt-2 border-t border-dashed border-stone-200">
          <span className="text-stone-400 text-[10px]">({h.shop})</span>
          <span className="text-lg font-black text-rose-600 ml-1.5 tracking-tight">{h.price}円</span>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// GeneralTable: 検索・ソート対応テーブル
// ================================================================
function GeneralTable({ items, searchQuery, setSearchQuery, sortKey, setSortKey, currentTab }) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden relative">
      {/* 背景テクスチャ装飾 */}
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
          </select>
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
                <tr key={i} className="hover:bg-rose-50/30 transition-colors bg-white">
                  <td className="p-3 pl-4 text-xs">
                    <div className="font-bold text-stone-700">{item.name}</div>
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

// ================================================================
// Dashboard: メインコンポーネント
// ================================================================
export default function Dashboard({ data }) {
  const [currentTab,    setCurrentTab]    = useState("today");
  const [sortKey,       setSortKey]       = useState("price");
  const [searchQuery,   setSearchQuery]   = useState("");
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = idx =>
    setOpenAccordion(prev => (prev === idx ? null : idx));

  const filteredHighlights = useMemo(
    () => data.highlights.filter(h => h.day === currentTab),
    [data.highlights, currentTab]
  );

  const filteredGeneral = useMemo(() => {
    return [...data.general]
      .filter(item => item.day === currentTab)
      .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) =>
        sortKey === "price"
          ? a.price - b.price
          : a.shop.localeCompare(b.shop, "ja")
      );
  }, [data.general, currentTab, searchQuery, sortKey]);

  const tabCls = active =>
    `flex-1 py-3.5 font-bold rounded-2xl text-center text-[13px] transition-all duration-200 ${
      active 
        ? "bg-rose-500 text-white shadow-md shadow-rose-200" 
        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
    }`;

  // APIのstocksデータをアコーディオン用の形式に変換
  const formattedStocks = useMemo(() => {
    const items = data.stocks.map(s => {
      const minSlot = s.schedule.find(slot => slot.isMin) || s.schedule.find(slot => slot.price > 0);
      return {
        name: s.name,
        price: minSlot ? minSlot.price : 0,
        shop: minSlot ? minSlot.shop : "-"
      };
    }).filter(item => item.price > 0);

    return [
      { cat: "今週のストック推奨品", items: items }
    ];
  }, [data.stocks]);

  return (
    <div className="bg-[#f5f4f1] font-sans antialiased text-stone-800 min-h-screen">
      <style>{`.no-sb::-webkit-scrollbar{display:none}.no-sb{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <div className="max-w-md mx-auto bg-[#faf9f8] min-h-screen pb-12 shadow-xl relative">

        {/* ── ヒーロー画像 ── */}
        <div className="h-48 w-full relative">
          <img 
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop" 
            alt="Supermarket" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/20 to-[#faf9f8]"></div>
        </div>

        {/* ── ヘッダー ── */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-50 p-4 pb-3 pt-4 -mt-16 rounded-t-3xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-base font-black text-stone-800 tracking-tight drop-shadow-sm">
              🛍️ 豊中駅前 特売ダッシュボード
            </h1>
            <span className="text-[10px] bg-white/80 text-stone-600 px-2.5 py-1 rounded-full font-bold shadow-sm border border-stone-100">
              本日 {data.lastUpdated} 更新
            </span>
          </div>
          <div className="flex gap-2.5 bg-stone-100/50 p-1 rounded-3xl">
            <button onClick={() => setCurrentTab("today")}    className={tabCls(currentTab === "today")}>
              今日買うもの
            </button>
            <button onClick={() => setCurrentTab("tomorrow")} className={tabCls(currentTab === "tomorrow")}>
              明日まで待つもの
            </button>
          </div>
        </header>

        <main className="p-4 space-y-6">

          {/* 1. 日常インフラ */}
          <section className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100">
            <h2 className="text-[11px] font-bold text-stone-500 tracking-wider mb-4 flex items-center gap-1">
              <span>🥛</span> 毎日の必需品 1週間底値カレンダー
            </h2>
            <div className="space-y-4">
              {data.daily.length > 0 ? (
                data.daily.map((item, i) => <DailyCarouselItem key={i} item={item} />)
              ) : (
                <p className="text-xs text-stone-400 text-center py-4">データがありません</p>
              )}
            </div>
          </section>

          {/* インフィード広告 ① */}
          <NativeAd 
            title="【PR】豊中駅前の家事代行サービス" 
            description="お買い物からお料理まで。初回お試しキャンペーン実施中！"
            imgUrl="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&q=80"
          />

          {/* 2. ストック */}
          <StockAccordion
            stocks={formattedStocks}
            openIdx={openAccordion}
            onToggle={toggleAccordion}
          />

          {/* 3. 注目枠（タブ連動） */}
          <section className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-3xl border border-orange-100 shadow-sm">
            <h2 className="text-[11px] font-bold text-orange-600 tracking-wider mb-3 flex items-center gap-1">
              <span>🔥</span> 見落とし厳禁！エリア最高目玉品
            </h2>
            <div className="space-y-3">
              {filteredHighlights.length > 0
                ? filteredHighlights.map((h, i) => <HighlightCard key={i} h={h} />)
                : (
                  <p className="text-[11px] text-orange-400 text-center py-3 bg-white/50 rounded-xl">
                    {currentTab === "today" ? "今日" : "明日"}の目玉品はありません
                  </p>
                )
              }
            </div>
          </section>

          {/* 4. 一般テーブル */}
          <GeneralTable
            items={filteredGeneral}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortKey={sortKey}
            setSortKey={setSortKey}
            currentTab={currentTab}
          />

          {/* インフィード広告 ② */}
          <NativeAd 
            title="【PR】お得なクレジットカード" 
            description="スーパーでの買い物が常にポイント2倍！今なら5000ptプレゼント"
            imgUrl="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&q=80"
          />

        </main>
      </div>
    </div>
  );
}

// ================================================================
// getStaticProps: ビルド時にAPIからデータを取得
// ================================================================
export async function getStaticProps() {
  const data = await fetchSaleData();
  
  return {
    props: {
      data: data || SAMPLE_DATA,
    },
  };
}
