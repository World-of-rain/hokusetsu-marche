import { useState, useMemo } from "react";
import Head from "next/head";
import type { GetStaticProps } from "next";

import { fetchSaleData } from "../lib/db";
import { STORE_LINKS } from "../lib/storeLinks";
import { useLiveDashboardData } from "../lib/useLiveData";
import type { DashboardData, SelectedItem, StockGroup } from "../lib/types";
import FallbackImage from "../components/FallbackImage";
import NativeAd from "../components/NativeAd";
import BottomSheet from "../components/BottomSheet";
import DailyCarouselItem from "../components/DailyCarouselItem";
import StockAccordion from "../components/StockAccordion";
import HighlightCard from "../components/HighlightCard";
import GeneralTable, { type SortKey } from "../components/GeneralTable";

const SAMPLE_DATA: DashboardData = {
  lastUpdated: "取得失敗",
  daily: [],
  stocks: [],
  highlights: [],
  general: [],
};

type Props = {
  data: DashboardData;
};

export default function Dashboard({ data: initialData }: Props) {
  // ビルド時データを初期表示し、表示後にKV（Pages Function）の最新データへ差し替える
  const data = useLiveDashboardData(initialData);

  const [currentTab, setCurrentTab] = useState<"today" | "tomorrow">("today");
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [storeFilter, setStoreFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [onlyOneDay, setOnlyOneDay] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null); // ボトムシート用

  const toggleAccordion = (idx: number) => setOpenAccordion((prev) => (prev === idx ? null : idx));

  const filteredHighlights = useMemo(
    () => data.highlights.filter((h) => h.day === currentTab),
    [data.highlights, currentTab]
  );

  const availableStores = useMemo(
    () =>
      [...new Set(data.general.map((item) => item.shop))].sort((a, b) => a.localeCompare(b, "ja")),
    [data.general]
  );

  const availableCategories = useMemo(
    () =>
      [...new Set(data.general.map((item) => item.category).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "ja")
      ),
    [data.general]
  );

  const filteredGeneral = useMemo(() => {
    return [...data.general]
      .filter((item) => item.day === currentTab)
      .filter((item) => storeFilter === "all" || item.shop === storeFilter)
      .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
      .filter((item) => !onlyOneDay || item.is_one_day_sale)
      .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortKey === "price") return a.price - b.price;
        if (sortKey === "shop") return a.shop.localeCompare(b.shop, "ja");
        if (sortKey === "category") return (a.category || "").localeCompare(b.category || "", "ja");
        return 0;
      });
  }, [data.general, currentTab, storeFilter, categoryFilter, onlyOneDay, searchQuery, sortKey]);

  const tabCls = (active: boolean) =>
    `flex-1 py-3.5 font-bold rounded-2xl text-center text-[13px] transition-all duration-200 ${
      active
        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
    }`;

  const formattedStocks = useMemo<StockGroup[]>(() => {
    const groups: Record<string, StockGroup["items"]> = {};
    data.stocks.forEach((s) => {
      const minSlot =
        s.schedule.find((slot) => slot.isMin) || s.schedule.find((slot) => slot.price > 0);
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
        comment: minSlot.advice,
        slot_day: minSlot.day,
        price_history: s.price_history,
      });
    });
    return Object.entries(groups).map(([cat, items]) => ({ cat, items }));
  }, [data.stocks]);

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
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
                data.daily.map((item, i) => (
                  <DailyCarouselItem key={i} item={item} onClick={setSelectedItem} />
                ))
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
            <button
              onClick={() => setCurrentTab("today")}
              className={tabCls(currentTab === "today")}
            >
              今日({todayStr})の特売品
            </button>
            <button
              onClick={() => setCurrentTab("tomorrow")}
              className={tabCls(currentTab === "tomorrow")}
            >
              明日({tomorrowStr})の特売品
            </button>
          </div>

          <section className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-3xl border border-orange-100 shadow-sm">
            <h2 className="text-[11px] font-bold text-orange-600 tracking-wider mb-3 flex items-center gap-1">
              <span>🔥</span> 見落とし厳禁！エリア最高目玉品
            </h2>
            <div className="space-y-3">
              {filteredHighlights.length > 0 ? (
                filteredHighlights.map((h, i) => (
                  <HighlightCard key={i} h={h} onClick={setSelectedItem} />
                ))
              ) : (
                <p className="text-[11px] text-orange-400 text-center py-3 bg-white/50 rounded-xl">
                  {currentTab === "today" ? "今日" : "明日"}の目玉品はありません
                </p>
              )}
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
              {STORE_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ボトムシートの呼び出し */}
      <BottomSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await fetchSaleData();

  if (!data && process.env.NODE_ENV === "production") {
    throw new Error(
      "Failed to fetch sale data during production build. Aborting to keep the previous successful deployment."
    );
  }

  return {
    props: {
      data: data || SAMPLE_DATA,
    },
  };
};
