import Link from "next/link";
import { STORE_LINKS } from "../lib/storeLinks";
import { SITE_NAME } from "../lib/site";

// 全ページ共通のフッター。AdSense審査で重視される「明確なナビゲーション」と
// 必須ページ（プライバシーポリシー・運営者情報）への導線を提供する。
export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 border-t border-stone-200 pt-6 pb-10 px-4 text-center">
      <div className="mb-3">
        <p className="text-[11px] text-stone-600 font-bold mb-2">【データ取得対象スーパー】</p>
        <div className="flex flex-wrap justify-center gap-2 text-[10px]">
          {STORE_LINKS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              {s.name}
            </a>
          ))}
        </div>
      </div>

      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold text-stone-600 mb-3">
        <Link href="/" className="hover:text-rose-600">
          ホーム
        </Link>
        <Link href="/guide" className="hover:text-rose-600">
          使い方ガイド
        </Link>
        <Link href="/privacy" className="hover:text-rose-600">
          プライバシーポリシー
        </Link>
        <Link href="/about" className="hover:text-rose-600">
          運営者情報・お問い合わせ
        </Link>
      </nav>

      <p className="text-[10px] text-stone-500 leading-relaxed max-w-md mx-auto">
        掲載価格は各店舗のチラシをもとにAIが自動集計したもので、実際の店頭価格・在庫を保証する
        ものではありません。ご購入前に各店舗の情報をご確認ください。
      </p>
      <p className="text-[10px] text-stone-400 mt-2">
        © {year} {SITE_NAME}
      </p>
    </footer>
  );
}
