import Link from "next/link";
import BrandMark from "./BrandMark";
import { STORE_LINKS } from "../lib/storeLinks";
import { SITE_NAME } from "../lib/site";

// 全ページ共通のフッター。墨の地に大きな題字。AdSense 審査で重視される明確な導線
// （プライバシーポリシー・運営者情報）と、データ取得対象スーパーの一覧を置く
export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-page px-4 pb-10 pt-16 sm:px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <BrandMark className="h-10 w-10" />
              <p className="font-display text-2xl">{SITE_NAME}</p>
            </div>
            <p className="mt-5 max-w-sm text-[13px] leading-[1.9] text-paper/70">
              豊中市
              庄内・服部エリアのスーパーのチラシを、AIが毎朝一枚の紙面にまとめる特売情報サイト。登録不要・無料でお使いいただけます。
            </p>
          </div>
          <nav aria-label="サイト内のページ" className="md:col-span-3">
            <p className="text-[11px] font-bold tracking-[0.2em] text-paper/50">PAGES</p>
            <ul className="mt-4 space-y-2.5 text-[14px] font-bold">
              <li>
                <Link href="/" className="link-draw">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/guide" className="link-draw">
                  使い方ガイド
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="link-draw">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/about" className="link-draw">
                  運営者情報・お問い合わせ
                </Link>
              </li>
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="text-[11px] font-bold tracking-[0.2em] text-paper/50">
              【データ取得対象スーパー】
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]">
              {STORE_LINKS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/stores/${s.slug}`}
                    className="link-draw text-paper/85 hover:text-paper"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          aria-hidden="true"
          data-wordmark="北摂マルシェ"
          className="wordmark pointer-events-none mt-16 select-none whitespace-nowrap font-display text-[22vw] leading-[0.8] tracking-tightest text-paper/[0.07] md:text-[15vw]"
        />

        <div className="mt-8 flex flex-col gap-3 border-t border-paper/15 pt-6 text-[11px] leading-relaxed text-paper/55 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl">
            掲載価格は各店舗のチラシをもとにAIが自動集計したもので、実際の店頭価格・在庫を保証するものではありません。ご購入前に各店舗の情報をご確認ください。
          </p>
          <div className="flex shrink-0 items-center gap-4">
            {/* Yahoo!ショッピングAPI利用のクレジット表記（規約必須） */}
            <a
              href="https://developer.yahoo.co.jp/sitemap/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-paper"
            >
              Web Services by Yahoo! JAPAN
            </a>
            <span>
              © {year} {SITE_NAME}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
