import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";

import { fetchSaleData } from "../../lib/db";
import { useLiveDashboardData } from "../../lib/useLiveData";
import { SITE_URL, SITE_NAME, DEFAULT_AREA } from "../../lib/site";
import { STORE_LINKS, isSameStore, storeBySlug, type StoreLink } from "../../lib/storeLinks";
import { discountRate } from "../../lib/summary";
import { isoDate, jstToday, longJa } from "../../lib/dates";
import type { DashboardData, GeneralItem, SelectedItem } from "../../lib/types";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import BottomSheet from "../../components/BottomSheet";
import HighlightCard from "../../components/HighlightCard";
import ProductImage from "../../components/ProductImage";
import SectionHead from "../../components/SectionHead";

type Props = { slug: string; data: DashboardData; builtOn: string };

const EMPTY: DashboardData = {
  lastUpdated: "取得失敗",
  daily: [],
  stocks: [],
  highlights: [],
  general: [],
};
const DAY_ORDER: GeneralItem["day"][] = ["today", "tomorrow", "week"];
const DAY_NAME: Record<string, string> = { today: "今日", tomorrow: "明日", week: "今週" };

function storeText(store: StoreLink, items: GeneralItem[], dateLabel: string): string {
  if (items.length === 0) {
    return `${store.name}（大阪府豊中市）の特売情報のページです。${dateLabel}時点で掲載中の特売はありません。新しいチラシを読み取りしだい、このページに掲載します。`;
  }
  const cheap = [...items]
    .sort((a, b) => discountRate(b) - discountRate(a) || a.price - b.price)
    .slice(0, 3)
    .map((g) => `${g.name}（${g.price}円）`)
    .join("、");
  return `${dateLabel}の${store.name}では、チラシから読み取った${items.length}品の特売を掲載しています。値引きが大きいのは${cheap}など。底値の比較は北摂マルシェのトップの底値カレンダーで確かめられます。`;
}

export default function StorePage({ slug, data: initialData, builtOn }: Props) {
  const store = storeBySlug(slug) as StoreLink;
  const data = useLiveDashboardData(initialData, DEFAULT_AREA);
  const [today, setToday] = useState(() => {
    const [y, m, d] = builtOn.split("-").map(Number);
    return new Date(y, m - 1, d);
  });
  useEffect(() => setToday(jstToday()), []);
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const items = useMemo(
    () => data.general.filter((g) => isSameStore(g.shop, store)),
    [data.general, store]
  );
  const picks = useMemo(
    () => data.highlights.filter((g) => isSameStore(g.shop, store)),
    [data.highlights, store]
  );
  const lows = useMemo(
    () =>
      data.daily
        .map((d) => ({ d, slot: d.schedule.find((s) => s.isMin && isSameStore(s.shop, store)) }))
        .filter((x) => x.slot),
    [data.daily, store]
  );
  const initialItems = initialData.general.filter((g) => isSameStore(g.shop, store));

  const title = `${store.name}の特売・チラシ情報｜${SITE_NAME}`;
  const description = `${store.name}（大阪府豊中市）の今日・明日・今週の特売品と価格を、チラシからAIが毎日まとめています。卵・牛乳などの底値、値引きの大きい目玉品、公式チラシへのリンク。`;
  const url = `${SITE_URL}/stores/${slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "店舗から探す", item: `${SITE_URL}/#stores` },
        { "@type": "ListItem", position: 3, name: store.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": store.kind,
      name: store.name,
      brand: { "@type": "Brand", name: store.chain },
      address: {
        "@type": "PostalAddress",
        addressRegion: "大阪府",
        addressLocality: "豊中市",
        addressCountry: "JP",
      },
      sameAs: [store.url],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${store.name}の特売品`,
      dateModified: builtOn,
      itemListElement: initialItems.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          ...(p.photo_url ? { image: p.photo_url } : {}),
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "JPY",
            seller: { "@type": "Organization", name: store.name },
          },
        },
      })),
    },
  ];

  const branch = store.name.replace(store.chain, "").trim();
  const others = STORE_LINKS.filter((s) => s.slug !== slug);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <SiteHeader updated={data.lastUpdated} />

      <main id="main" className="mx-auto max-w-page px-4 sm:px-6 lg:px-10">
        <nav aria-label="パンくずリスト" className="pt-8 text-[12px] text-ink-mute">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="link-draw hover:text-ink">
                {SITE_NAME}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#stores" className="link-draw hover:text-ink">
                店舗から探す
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink-soft">
              {store.name}
            </li>
          </ol>
        </nav>

        <header className="grid gap-8 border-b-2 rule-strong pb-12 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-[13px] font-bold tracking-[0.08em] text-persimmon">
              豊中市の{store.kind === "Pharmacy" ? "ドラッグストア" : "スーパー"}
            </p>
            <h1 className="rise mt-3 font-display text-[3.2rem] leading-[1.02] tracking-tightest text-ink md:text-[5.2rem]">
              {store.chain}
              <span className="mt-3 block text-[1.4rem] tracking-normal text-ink-soft md:text-[2rem]">
                {branch}の特売・チラシ情報
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-[1.9] text-ink-soft">
              {storeText(store, items, longJa(today))}
            </p>
          </div>
          <div className="flex flex-col justify-end gap-6 lg:col-span-4">
            <p className="flex items-baseline gap-2">
              <span className="num text-[5rem] leading-none text-ink">{items.length}</span>
              <span className="text-sm font-bold text-ink-soft">品を掲載中</span>
            </p>
            <a
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-paper transition-colors hover:bg-persimmon"
            >
              {store.name}の公式チラシを見る ↗
            </a>
          </div>
        </header>

        {lows.length > 0 && (
          <section aria-labelledby="lows-title" className="pt-20">
            <SectionHead
              id="lows-title"
              index="01"
              kicker="Bottom price"
              title="この店が今週の底値"
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {lows.map(({ d, slot }) => (
                <li
                  key={d.name}
                  data-reveal
                  className="rounded-[22px] border border-persimmon bg-persimmon p-5 text-white"
                >
                  <p className="text-[12px] font-bold text-white/80">{slot!.day}</p>
                  <p className="mt-1 font-display text-2xl">{d.name}</p>
                  <p className="num mt-4 text-5xl leading-none">
                    {slot!.price}
                    <span className="font-sans text-sm font-bold">円</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {picks.length > 0 && (
          <section aria-labelledby="picks-title" className="pt-20">
            <SectionHead
              id="picks-title"
              index={lows.length ? "02" : "01"}
              kicker="Highlights"
              title="この店の目玉品"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((h, i) => (
                <HighlightCard key={i} h={h} index={i} onClick={setSelected} />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="all-title" className="pt-20">
          <SectionHead id="all-title" index="—" kicker="All deals" title="掲載中の特売品" />
          {items.length === 0 ? (
            <p className="rounded-[22px] border border-dashed border-ink/25 py-12 text-center text-[13px] text-ink-mute">
              いま掲載中の特売はありません。
            </p>
          ) : (
            DAY_ORDER.map((day) => {
              const rows = items.filter((g) => g.day === day).sort((a, b) => a.price - b.price);
              if (rows.length === 0) return null;
              return (
                <div key={day} className="mb-12">
                  <h3 className="mb-3 flex items-baseline gap-3 font-display text-2xl text-ink">
                    {DAY_NAME[day]}
                    <span className="num text-sm text-ink-mute">{rows.length}品</span>
                  </h3>
                  <ul className="grid border-t-2 rule-strong md:grid-cols-2 md:gap-x-10">
                    {rows.map((g, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => setSelected(g)}
                          className="group flex w-full items-center gap-3 border-b rule py-3 text-left hover:bg-paper-light"
                        >
                          <ProductImage
                            name={g.name}
                            category={g.category}
                            icon={g.icon}
                            photoUrl={g.photo_url}
                            width={120}
                            className="h-11 w-11 shrink-0 rounded-xl border rule"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] font-bold text-ink group-hover:text-persimmon">
                              {g.name}
                            </span>
                            {g.sale_end_date && (
                              <span className="block text-[11px] text-ink-mute">
                                {g.sale_end_date}
                              </span>
                            )}
                          </span>
                          <span className="num text-2xl text-persimmon">
                            {g.price}
                            <span className="font-sans text-[11px] font-bold">円</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </section>

        <section aria-labelledby="others-title" className="pt-16">
          <h2
            id="others-title"
            className="border-t-2 rule-strong pt-3 text-[11px] uppercase tracking-[0.2em] text-ink-soft"
          >
            ほかの店舗
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/stores/${s.slug}`}
                  className="inline-block rounded-full border border-ink/20 px-4 py-2 text-[13px] font-bold text-ink-soft transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
      <BottomSheet item={selected} onClose={close} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: STORE_LINKS.map((s) => ({ params: { slug: s.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.slug);
  const data = await fetchSaleData();
  return { props: { slug, data: data || EMPTY, builtOn: isoDate(jstToday()) } };
};
