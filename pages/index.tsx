import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import type { GetStaticProps } from "next";

import { fetchSaleData } from "../lib/db";
import { useLiveDashboardData } from "../lib/useLiveData";
import { useLocalStorageState } from "../lib/useLocalStorage";
import { matchesSearch } from "../lib/search";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  DEFAULT_AREA,
  ADSENSE_SLOT_TOP,
  ADSENSE_SLOT_BOTTOM,
  CONTACT_EMAIL,
} from "../lib/site";
import { FAQ_JSONLD } from "../lib/faq";
import { buildSummary, discountRate } from "../lib/summary";
import { isoDate, jstToday, longJa, weekEn } from "../lib/dates";
import type { DashboardData, SelectedItem, StockGroup } from "../lib/types";
import AdUnit from "../components/AdUnit";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import BottomSheet from "../components/BottomSheet";
import DailyCarouselItem from "../components/DailyCarouselItem";
import StockAccordion from "../components/StockAccordion";
import HighlightCard from "../components/HighlightCard";
import GeneralTable, { type SortKey } from "../components/GeneralTable";
import Hero from "../components/Hero";
import Ticker from "../components/Ticker";
import SectionHead from "../components/SectionHead";
import SectionPicker from "../components/SectionPicker";
import DayTabs, { type Day } from "../components/DayTabs";
import StoreDirectory from "../components/StoreDirectory";
import HowItWorks from "../components/HowItWorks";
import FaqList from "../components/FaqList";
import { cleanCategoryLabel, stockOrderIndex, STOCK_CATEGORY_ORDER } from "../lib/stockCategories";

// 底値カレンダーの既定表示（ユーザーが未カスタマイズのときに出す定番5品）
const DEFAULT_DAILY_PICKS = ["卵", "牛乳", "食パン", "納豆", "豆腐"];

const SAMPLE_DATA: DashboardData = {
  lastUpdated: "取得失敗",
  daily: [],
  stocks: [],
  highlights: [],
  general: [],
};

type Props = {
  data: DashboardData;
  /** ビルドした日（日本時間・YYYY-MM-DD）。表示後は端末の今日に置き換える */
  builtOn: string;
};

const SECTION = "mx-auto max-w-page px-4 pt-20 sm:px-6 md:pt-28 lg:px-10";

export default function Dashboard({ data: initialData, builtOn }: Props) {
  // ビルド時データを初期表示し、表示後にKV（Pages Function）の最新データへ差し替える
  const data = useLiveDashboardData(initialData, DEFAULT_AREA);

  // 静的書き出しと表示時で日付がずれないよう、最初はビルドした日で描き、表示後に今日へ置き換える
  const [today, setToday] = useState(() => {
    const [y, m, d] = builtOn.split("-").map(Number);
    return new Date(y, m - 1, d);
  });
  useEffect(() => setToday(jstToday()), []);

  const [currentTab, setCurrentTab] = useState<Day>("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null); // 詳細シート用

  // フィルタ・並び順・お気に入りは端末に保存し、次回訪問時も維持する
  const [sortKey, setSortKey] = useLocalStorageState<SortKey>("hm:sortKey", "price");
  const [storeFilter, setStoreFilter] = useLocalStorageState<string>("hm:storeFilter", "all");
  const [categoryFilter, setCategoryFilter] = useLocalStorageState<string>(
    "hm:categoryFilter",
    "all"
  );
  const [onlyOneDay, setOnlyOneDay] = useLocalStorageState<boolean>("hm:onlyOneDay", false);
  const [favorites, setFavorites] = useLocalStorageState<string[]>("hm:favorites", []);
  // 底値カレンダーの表示品目・ストック枠の表示カテゴリ（null = 未カスタマイズ＝既定表示）
  const [dailyPicks, setDailyPicks] = useLocalStorageState<string[] | null>("hm:dailyPicks", null);
  const [stockCats, setStockCats] = useLocalStorageState<string[] | null>("hm:stockCats", null);

  const toggleFavorite = (name: string) =>
    setFavorites(
      favorites.includes(name) ? favorites.filter((f) => f !== name) : [...favorites, name]
    );

  const closeSheet = useCallback(() => setSelectedItem(null), []);

  const toggleAccordion = (idx: number) => setOpenAccordion((prev) => (prev === idx ? null : idx));

  const summary = useMemo(() => buildSummary(data, longJa(today)), [data, today]);

  // 流れる帯: 今日の特売を値引きの大きい順に
  const tickerItems = useMemo(
    () =>
      [
        ...data.general.filter((g) => g.day === "today"),
        ...data.highlights.filter((h) => h.day === "today"),
      ]
        .filter((g, i, all) => all.findIndex((x) => x.name === g.name && x.shop === g.shop) === i)
        .sort((a, b) => discountRate(b) - discountRate(a))
        .slice(0, 24),
    [data.general, data.highlights]
  );

  const filteredHighlights = useMemo(
    // 今週タブでは目玉品は今日・明日分をまとめて表示する
    () =>
      currentTab === "week" ? data.highlights : data.highlights.filter((h) => h.day === currentTab),
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
        if (sortKey === "unit_price") {
          // 単価あり商品を先頭に、同一次元（100gあたり/100mlあたり/1個あたり）ごとに
          // まとめて安い順。単価が出せない商品は末尾に実売価格順で並べる
          const aHas = a.unit_price > 0 ? 0 : 1;
          const bHas = b.unit_price > 0 ? 0 : 1;
          if (aHas !== bHas) return aHas - bHas;
          if (aHas === 1) return a.price - b.price;
          const dimDiff = a.unit_dimension.localeCompare(b.unit_dimension);
          if (dimDiff !== 0) return dimDiff;
          return a.unit_price - b.unit_price;
        }
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
        store_url: minSlot.store_url,
        icon: s.icon,
        item_id: minSlot.item_id,
        image_hash: minSlot.image_hash,
        anchor_id: minSlot.anchor_id,
        report_state: minSlot.report_state,
        raw_item_name: minSlot.raw_item_name,
        bonus_points: minSlot.bonus_points,
        unit_price_text: minSlot.unit_price_text,
        photo_url: s.photo_url,
        jan_code: s.jan_code,
        product_url: s.product_url,
      });
    });
    return Object.entries(groups)
      .map(([cat, items]) => ({ cat, items }))
      .sort(
        (a, b) =>
          stockOrderIndex(cleanCategoryLabel(a.cat)) - stockOrderIndex(cleanCategoryLabel(b.cat))
      );
  }, [data.stocks]);

  // 底値カレンダー: 配信された候補（最大20品）から、ユーザーが選んだ品目だけ表示する。
  // 未カスタマイズなら定番5品。定番が今週の特売に無い場合は先頭から5品出す
  const dailyOptions = useMemo(() => data.daily.map((d) => d.name), [data.daily]);
  const effectiveDailyPicks = dailyPicks ?? DEFAULT_DAILY_PICKS;
  const visibleDaily = useMemo(() => {
    const picked = data.daily.filter((d) => effectiveDailyPicks.includes(d.name));
    if (dailyPicks === null && picked.length === 0) return data.daily.slice(0, 5);
    return picked;
  }, [data.daily, dailyPicks, effectiveDailyPicks]);

  // ストック枠: ユーザーが選んだカテゴリのグループだけ表示（未カスタマイズなら全カテゴリ）
  const effectiveStockCats = stockCats ?? STOCK_CATEGORY_ORDER;
  const visibleStocks = useMemo(
    () => formattedStocks.filter((g) => effectiveStockCats.includes(cleanCategoryLabel(g.cat))),
    [formattedStocks, effectiveStockCats]
  );

  // 検索エンジン・AI 検索向けの構造化データ。いずれもページに表示している内容と一致させる
  const jsonLd = useMemo(() => {
    const products = [...initialData.highlights, ...initialData.general].slice(0, 10);
    const org = {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/icons/icon-512.png`,
      ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
    };
    return [
      { "@context": "https://schema.org", ...org },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: SITE_TITLE,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        inLanguage: "ja",
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: SITE_TITLE,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        inLanguage: "ja",
        dateModified: builtOn,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: {
          "@type": "Place",
          name: "大阪府豊中市 庄内・服部エリア",
          address: {
            "@type": "PostalAddress",
            addressRegion: "大阪府",
            addressLocality: "豊中市",
            addressCountry: "JP",
          },
        },
        mainEntity: { "@id": `${SITE_URL}/#deals` },
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${SITE_URL}/#deals`,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: p.name,
            ...(p.photo_url ? { image: p.photo_url } : {}),
            ...(p.jan_code ? { gtin13: p.jan_code } : {}),
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "JPY",
              availability: "https://schema.org/InStock",
              seller: { "@type": "Organization", name: p.shop },
            },
          },
        })),
      },
      FAQ_JSONLD,
    ];
  }, [initialData, builtOn]);

  const dayTabs = <DayTabs value={currentTab} onChange={setCurrentTab} today={today} />;
  const dayName = currentTab === "today" ? "今日" : currentTab === "tomorrow" ? "明日" : "今週";

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="北摂マルシェ" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        本文へ移動
      </a>
      <SiteHeader updated={data.lastUpdated} onTop />

      <main id="main">
        <Hero
          summary={summary}
          dateLong={longJa(today)}
          weekEn={weekEn(today)}
          updated={data.lastUpdated}
          onOpen={setSelectedItem}
        />
        <Ticker items={tickerItems} />

        {/* 01 底値カレンダー */}
        <section id="calendar" aria-labelledby="calendar-title" className={SECTION}>
          <SectionHead
            id="calendar-title"
            index="01"
            kicker="Bottom price calendar"
            eyebrow="毎日の必需品"
            title="1週間底値カレンダー"
            lead="卵・牛乳・食パンなどの定番品が、今週いつ・どの店で一番安いか。柿色の札が今週の底値です。日付のマスを押すと、その日の詳細が開きます。"
          />
          {dailyOptions.length > 0 && (
            <SectionPicker
              label="表示する品目を選ぶ"
              options={dailyOptions}
              selected={effectiveDailyPicks.filter((n) => dailyOptions.includes(n))}
              onChange={setDailyPicks}
            />
          )}
          <div className="border-t-2 rule-strong">
            {visibleDaily.length > 0 ? (
              visibleDaily.map((item, i) => (
                <DailyCarouselItem
                  key={item.name}
                  item={item}
                  index={i}
                  onClick={setSelectedItem}
                />
              ))
            ) : (
              <p className="py-12 text-center text-[13px] text-ink-mute">
                {data.daily.length > 0
                  ? "表示する品目が選ばれていません。右上の「表示する品目を選ぶ」から選択できます。"
                  : "データがありません"}
              </p>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10">
          <AdUnit slot={ADSENSE_SLOT_TOP} />
        </div>

        {/* 02 目玉品 */}
        <section id="picks" aria-labelledby="picks-title" className={SECTION}>
          <SectionHead
            id="picks-title"
            index="02"
            kicker="Today's highlights"
            eyebrow="見落とし厳禁！"
            title="エリア最高目玉品"
            lead="ふだんの平均価格から大きく下がった、今日・明日だけの目玉品。"
            aside={dayTabs}
          />
          {filteredHighlights.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHighlights.map((h, i) => (
                <HighlightCard
                  key={`${h.name}-${h.shop}-${i}`}
                  h={h}
                  index={i}
                  onClick={setSelectedItem}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-[22px] border border-dashed border-ink/25 py-12 text-center text-[13px] text-ink-mute">
              {dayName}の目玉品はありません
            </p>
          )}
        </section>

        {/* 03 ストック */}
        <section id="stock" aria-labelledby="stock-title" className={SECTION}>
          <SectionHead
            id="stock-title"
            index="03"
            kicker="Stock up"
            eyebrow="日持ちする品は、安い週に"
            title={
              <>
                ストック・
                <wbr />
                まとめ買いのチャンス
              </>
            }
            lead="お米・調味料・飲料・お酒など、買い溜めに向く品をカテゴリごとに。"
          />
          <StockAccordion
            stocks={visibleStocks}
            openIdx={openAccordion}
            onToggle={toggleAccordion}
            onClick={setSelectedItem}
            emptyMessage={
              formattedStocks.length > 0
                ? "表示するカテゴリが選ばれていません。右上の「表示するカテゴリを選ぶ」から選択できます。"
                : "今週のストック向け特売はありません。"
            }
            picker={
              <SectionPicker
                label="表示するカテゴリを選ぶ"
                options={STOCK_CATEGORY_ORDER}
                selected={effectiveStockCats}
                onChange={setStockCats}
              />
            }
          />
        </section>

        {/* 04 総合リスト */}
        <section id="list" aria-labelledby="list-title" className={SECTION}>
          <SectionHead
            id="list-title"
            index="04"
            kicker="All deals"
            eyebrow={`${dayName}の特売をすべて`}
            title="総合特売リスト"
            lead="商品名で探す・店やジャンルで絞る・安い順に並べる。☆を押すとお気に入りとして先頭に固定されます。"
            aside={dayTabs}
          />
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
        </section>

        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10">
          <AdUnit slot={ADSENSE_SLOT_BOTTOM} />
        </div>

        {/* 05 店舗 */}
        <section id="stores" aria-labelledby="stores-title" className={SECTION}>
          <SectionHead
            id="stores-title"
            index="05"
            kicker="Stores"
            eyebrow="お近くの店から"
            title="店舗から探す"
            lead="豊中市 庄内・服部エリアの対象スーパーとドラッグストア。店ごとの特売一覧と、公式チラシへのリンクをまとめています。"
          />
          <StoreDirectory general={data.general} />
        </section>

        {/* 06 しくみ */}
        <section id="how" aria-labelledby="how-title" className={SECTION}>
          <SectionHead
            id="how-title"
            index="06"
            kicker="How it works"
            title="毎朝の紙面ができるまで"
          />
          <HowItWorks />
        </section>

        {/* 07 よくある質問 */}
        <section id="faq" aria-labelledby="faq-title" className={SECTION}>
          <SectionHead id="faq-title" index="07" kicker="FAQ" title="よくある質問" />
          <FaqList />
        </section>
      </main>

      <SiteFooter />

      {/* 詳細シート */}
      <BottomSheet item={selectedItem} onClose={closeSheet} />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // ビルド時のデータ取得はSEO・初回表示用のベストエフォート。
  // 実データはページ表示後に Pages Function（KV）経由で取得・差し替えされるため、
  // ビルド環境からNASに到達できなくてもビルドは止めない（KVにデータがあれば表示は正常になる）。
  // かつては取得失敗時にビルドを中断していたが、KV配信の導入で不要になった。
  // 新規プロジェクトでは中断するとサイトが1つも公開されないため、必ずサンプルデータで通す。
  const data = await fetchSaleData();

  if (!data) {
    console.warn(
      "ビルド時のデータ取得に失敗しました。サンプルデータでビルドし、実データはページ表示後に" +
        "KVから取得します（API_URL未設定・NAS到達不能などの場合の正常なフォールバックです）。"
    );
  }

  return {
    props: {
      data: data || SAMPLE_DATA,
      builtOn: isoDate(jstToday()),
    },
  };
};
