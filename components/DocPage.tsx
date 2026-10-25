import { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { SITE_URL, SITE_NAME } from "../lib/site";

type Props = {
  title: string;
  description: string;
  path: string; // 先頭スラッシュ付き（例: "/privacy"）
  children: ReactNode;
  // ページ固有の追加構造化データ（例: 使い方ガイドのFAQPage）
  structuredData?: object[];
  /** 見出しの上の欧文キッカー */
  kicker?: string;
};

// プライバシーポリシー・運営者情報・使い方ガイドなどの読み物ページ用の共通シェル。
// 紙面の囲み記事のように、細い段組みに明朝の大見出しで組む
export default function DocPage({
  title,
  description,
  path,
  children,
  structuredData,
  kicker,
}: Props) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  // パンくず（トップ → 当ページ）。検索結果のパス表示を安定させる
  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}${path}` },
      ],
    },
    ...(structuredData || []),
  ];
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}${path}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}${path}`} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <SiteHeader />

      <main id="main" className="mx-auto max-w-page px-4 sm:px-6 lg:px-10">
        <nav aria-label="パンくずリスト" className="pt-8 text-[12px] text-ink-mute">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="link-draw hover:text-ink">
                {SITE_NAME}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink-soft">
              {title}
            </li>
          </ol>
        </nav>
        <div className="grid gap-10 pb-10 pt-10 lg:grid-cols-12">
          <header className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="border-t-2 rule-strong pt-3 text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                {kicker ?? "Notes"}
              </p>
              <h1 className="rise mt-5 font-display text-[2.6rem] leading-[1.1] text-ink md:text-[3.4rem]">
                {title}
              </h1>
              <p className="mt-5 text-[14px] leading-[1.9] text-ink-mute">{description}</p>
            </div>
          </header>
          <div className="doc-body max-w-2xl text-[15px] leading-[2] text-ink-soft lg:col-span-7 lg:col-start-6">
            {children}
            <div className="mt-14">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper transition-colors hover:bg-persimmon"
              >
                ← トップに戻る
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      <style jsx global>{`
        .doc-body > * + * {
          margin-top: 1.1rem;
        }
        .doc-body h2 {
          font-family: var(--font-display), serif;
          font-size: 1.6rem;
          line-height: 1.35;
          color: #1c1a16;
          margin-top: 3rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(28, 26, 22, 0.14);
        }
        .doc-body h3 {
          font-weight: 700;
          color: #1c1a16;
          margin-top: 1.6rem;
        }
        .doc-body ul {
          list-style: none;
          padding-left: 0;
        }
        .doc-body li {
          position: relative;
          padding-left: 1.2rem;
          margin-top: 0.4rem;
        }
        .doc-body li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.85em;
          width: 0.45rem;
          height: 0.45rem;
          border-radius: 9999px;
          background: #e2482a;
        }
        .doc-body a {
          color: #1c1a16;
          text-decoration: underline;
          text-decoration-color: #e2482a;
          text-underline-offset: 3px;
        }
      `}</style>
    </>
  );
}
