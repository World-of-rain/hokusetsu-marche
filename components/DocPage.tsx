import { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import SiteFooter from "./SiteFooter";
import { SITE_URL, SITE_NAME } from "../lib/site";

type Props = {
  title: string;
  description: string;
  path: string; // 先頭スラッシュ付き（例: "/privacy"）
  children: ReactNode;
};

// プライバシーポリシー・運営者情報・使い方ガイドなどの読み物ページ用の共通シェル。
export default function DocPage({ title, description, path, children }: Props) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return (
    <div className="bg-[#f5f4f1] font-sans antialiased text-stone-800 min-h-screen">
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}${path}`} />
        <meta name="theme-color" content="#e11d48" />
        <link rel="icon" href="/icons/icon-192.png" type="image/png" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}${path}`} />
        <meta property="og:locale" content="ja_JP" />
      </Head>

      <div className="max-w-md mx-auto bg-[#faf9f8] min-h-screen shadow-xl">
        <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-40 p-4">
          <Link href="/" className="text-sm font-black text-stone-800 flex items-center gap-1">
            🛒 {SITE_NAME}
          </Link>
        </header>

        <main className="p-5">
          <h1 className="text-xl font-black text-stone-800 mb-1">{title}</h1>
          <div className="w-10 h-1 bg-rose-400 rounded-full mb-5"></div>
          <div className="doc-body text-sm text-stone-700 leading-relaxed space-y-4">
            {children}
          </div>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-block bg-stone-800 text-white text-sm font-bold px-5 py-2.5 rounded-2xl active:bg-stone-700"
            >
              ← トップに戻る
            </Link>
          </div>
        </main>

        <SiteFooter />
      </div>

      <style jsx global>{`
        .doc-body h2 {
          font-size: 1rem;
          font-weight: 800;
          color: #292524;
          margin-top: 1.5rem;
          margin-bottom: 0.25rem;
        }
        .doc-body p {
          margin-bottom: 0.5rem;
        }
        .doc-body ul {
          list-style: disc;
          padding-left: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .doc-body li {
          margin-bottom: 0.25rem;
        }
        .doc-body a {
          color: #1d4ed8;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
