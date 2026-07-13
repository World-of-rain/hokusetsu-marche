import { useState, useMemo } from "react";
import Head from "next/head";
import type { GetStaticProps } from "next";

import { fetchSaleData } from "../lib/db";
import { useLiveDashboardData } from "../lib/useLiveData";
import { useLocalStorageState } from "../lib/useLocalStorage";
import { matchesSearch } from "../lib/search";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  ADSENSE_SLOT_TOP,
  ADSENSE_SLOT_BOTTOM,
} from "../lib/site";
import type { DashboardData, SelectedItem, StockGroup } from "../lib/types";
import AdUnit from "../components/AdUnit";
import SiteFooter from "../components/SiteFooter";
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

// ヘッダーの装飾（外部画像に依存しない絵文字バナー）
const HERO_EMOJIS = ["🥕", "🍞", "🥚", "🐟", "🍎", "🥬", "🧺", "🥛"];

type Props = {
  data: DashboardData;
};

export default function Dashboard({ data: initialData }: Props) {
  // ビルド時データを初期表示し、表示後にKV（Pages Function）の最新データへ差し替える
  const data = useLiveDashboardData(initialData);

  const [currentTab, setCurrentTab] = useState<"today" | "tomorrow">("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null); // ボトムシート用

  // フィルタ・並び順・お気に入りは端末に保存し、次回訪問時も維持する
  const [sortKey, setSortKey] = useLocalStorageState<SortKey>("hm:sortKey", "price");
  const [storeFilter, setStoreFilter] = useLocalStorageState<string>("hm:storeFilter", "all");
  const [categoryFilter, setCategoryFilter] = useLocalStorageState<string>(
    "hm:categoryFilter",
    "all"
  );
  const [onlyOneDay, setOnlyOneDay] = useLocalStorageState<boolean>("hm:onlyOneDay", false);
  const [favorites, setFavorites] = useLocalStorageState<string[]>("hm:favorites", []);

  const toggleFavorite = (name: string) =>
    setFavorites(
      favorites.includes(name) ? favorites.filter((f) => f !== name) : [...favorites, name]
    );

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
    // 保存されたフィルタ値が現在のデータに存在しない場合（店舗の入れ替え等）は無視する
    const effectiveStore =
      storeFilter !== "all" && !availableStores.includes(storeFilter) ? "all" : storeFilter;
    const effectiveCategory =
      categoryFilter !== "all" && !availableCategories.includes(categoryFilter)
        ? "all"
        : categoryFilter;

    return [...data.general]
      .filter((item) => item.day === currentTab)
      .filter((item) => effectiveStore === "all" || item.shop === effectiveStore)
      .filter((item) => effectiveCategory === "all" || item.category === effectiveCategory)
      .filter((item) => !onlyOneDay || item.is_one_day_sale)
      .filter((item) => matchesSearch(item.name, searchQuery))
      .sort((a, b) => {
        // お気に入りを最上部にピン留めし、その中で選択中の並び順を適用
        const favDiff = Number(favorites.includes(b.name)) - Number(favorites.includes(a.name));
        if (favDiff !== 0) return favDiff;
        if (sortKey === "price") return a.price - b.price;
        if (sortKey === "shop") return a.shop.localeCompare(b.shop, "ja");
        if (sortKey === "category") return (a.category || "").localeCompare(b.category || "", "ja");
        return 0;
      });
  }, [
    data.general,
    currentTab,
    storeFilter,
    categoryFilter,
    onlyOneDay,
    searchQuery,
    sortKey,
    favorites,
    availableStores,
    availableCategories,
  ]);

  const tabCls = (active: boolean) =>
    `flex-1 py-3.5 font-bold rounded-2xl text-center text-[13px] transition-all duration-200 ${
      active
        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
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

  // 検索エンジン向けの構造化データ（掲載中の特売品をItemListとして出力）
  const jsonLd = useMemo(() => {
    const products = [...initialData.highlights, ...initialData.general].slice(0, 10);
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "JPY",
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: p.shop },
          },
        },
      })),
    };
  }, [initialData]);

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  const todayStr = formatDate(todayDate);
  const tomorrowStr = formatDate(tomorrowDate);

  return (
    <div className="bg-[#f5f4f1] font-sans antialiased text-stone-800 min-h-screen">
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta name="theme-color" content="#e11d48" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icons/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="北摂マルシェ" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <style>{`.no-sb::-webkit-scrollbar{display:none}.no-sb{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <div className="max-w-md mx-auto bg-[#faf9f8] min-h-screen pb-12 shadow-xl relative">
        {/* ヒーローバナー（外部画像に依存しない自前デザイン） */}
        <div
          aria-hidden="true"
          className="h-44 w-full relative overflow-hidden bg-gradient-to-br from-rose-100 via-amber-50 to-teal-50"
        >
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 px-6 pt-2 pb-16 opacity-70 select-none">
            {HERO_EMOJIS.map((emoji, i) => (
              <span
                key={i}
                className="text-4xl drop-shadow-sm"
                style={{ transform: `rotate(${((i % 3) - 1) * 12}deg)` }}
              >
                {emoji}
              </span>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#faf9f8]"></div>
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
          <p className="text-[10px] text-stone-600 font-medium leading-relaxed">
            豊南エリアのスーパー（ライフ・ダイエー・サタケ・万代など）のチラシ情報をAIが毎日集約！いつ・どこで買うのが一番お得か、一目でわかります。
          </p>
        </header>

        <main className="p-4 space-y-6">
          <section className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100">
            <h2 className="text-[11px] font-bold text-stone-600 tracking-wider mb-4 flex items-center gap-1">
              <span aria-hidden="true">🥛</span> 毎日の必需品 1週間底値カレンダー
            </h2>
            <div className="space-y-4">
              {data.daily.length > 0 ? (
                data.daily.map((item, i) => (
                  <DailyCarouselItem key={i} item={item} onClick={setSelectedItem} />
                ))
              ) : (
                <p className="text-xs text-stone-500 text-center py-4">データがありません</p>
              )}
            </div>
          </section>

          <AdUnit slot={ADSENSE_SLOT_TOP} />

          <StockAccordion
            stocks={formattedStocks}
            openIdx={openAccordion}
            onToggle={toggleAccordion}
            onClick={setSelectedItem}
          />

          <div className="flex gap-2.5 bg-stone-100/50 p-1 rounded-3xl">
            <button
              onClick={() => setCurrentTab("today")}
              aria-pressed={currentTab === "today"}
              className={tabCls(currentTab === "today")}
            >
              今日({todayStr})の特売品
            </button>
            <button
              onClick={() => setCurrentTab("tomorrow")}
              aria-pressed={currentTab === "tomorrow"}
              className={tabCls(currentTab === "tomorrow")}
            >
              明日({tomorrowStr})の特売品
            </button>
          </div>

          <section className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-3xl border border-orange-100 shadow-sm">
            <h2 className="text-[11px] font-bold text-orange-600 tracking-wider mb-3 flex items-center gap-1">
              <span aria-hidden="true">🔥</span> 見落とし厳禁！エリア最高目玉品
            </h2>
            <div className="space-y-3">
              {filteredHighlights.length > 0 ? (
                filteredHighlights.map((h, i) => (
                  <HighlightCard key={i} h={h} onClick={setSelectedItem} />
                ))
              ) : (
                <p className="text-[11px] text-orange-500 text-center py-3 bg-white/50 rounded-xl">
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
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onClick={setSelectedItem}
          />

          <AdUnit slot={ADSENSE_SLOT_BOTTOM} />
        </main>

        <SiteFooter />
      </div>

      {/* ボトムシートの呼び出し */}
      <BottomSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await fetchSaleData();

  // 本番デプロイ（mainブランチ）でデータ取得に失敗した場合のみビルドを中断し、
  // 前回の正常なデプロイを維持する。プレビュービルド（DependabotのPR等）は
  // API_URLが無くビルド環境からNASに到達できないため、サンプルデータで通す
  // （実データはページ表示後にKVから取得される）。
  const isPreviewDeploy = !!process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== "main";

  if (!data && process.env.NODE_ENV === "production" && !isPreviewDeploy) {
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
