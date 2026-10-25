import Head from "next/head";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { SITE_NAME } from "../lib/site";

// 見つからないページ。紙面の「休刊のお知らせ」のように組み、トップと店舗の索引へ戻す
export default function NotFound() {
  return (
    <>
      <Head>
        <title>{`ページが見つかりません | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-page px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 border-b-2 rule-strong py-20 lg:grid-cols-12 lg:py-28">
          <p className="num rise text-[9rem] leading-[0.8] text-persimmon lg:col-span-5 lg:text-[14rem]">
            404
          </p>
          <div className="lg:col-span-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink-soft">Not found</p>
            <h1 className="mt-4 font-display text-[2.4rem] leading-[1.15] text-ink md:text-[3.2rem]">
              この紙面は、
              <br />
              見つかりませんでした。
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-[1.9] text-ink-soft">
              お探しのページは移動したか、なくなった可能性があります。今日の特売はトップの紙面からご覧ください。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper transition-colors hover:bg-persimmon"
              >
                今日の紙面へ
              </Link>
              <Link
                href="/#stores"
                className="rounded-full border border-ink px-6 py-3 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                店舗から探す
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
