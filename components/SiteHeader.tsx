import Link from "next/link";
import BrandMark from "./BrandMark";
import ScrollProgress from "./ScrollProgress";

type Props = {
  /** 最終更新時刻（"07:50"）。無ければ出さない */
  updated?: string;
  /** トップでは同じページ内の見出しへ、他のページではトップの見出しへ移る */
  onTop?: boolean;
};

const NAV = [
  { id: "calendar", label: "底値カレンダー" },
  { id: "picks", label: "今日の目玉" },
  { id: "stock", label: "まとめ買い" },
  { id: "list", label: "特売リスト" },
  { id: "stores", label: "店舗" },
];

// 全ページ共通の上部バー。紙の地に墨の細い罫線で区切り、スクロールしても上に残る
export default function SiteHeader({ updated, onTop }: Props) {
  return (
    <div className="sticky top-0 z-50 border-b rule bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex h-14 max-w-page items-center gap-4 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-2.5">
          <BrandMark className="h-8 w-8 transition-transform duration-500 ease-out group-hover:rotate-[-12deg]" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[17px] tracking-wide text-ink">北摂マルシェ</span>
            <span className="mt-1 text-[9px] tracking-[0.28em] text-ink-mute">
              HOKUSETSU MARCHÉ
            </span>
          </span>
        </Link>
        <nav aria-label="ページ内の見出し" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-7 text-[13px] font-bold text-ink-soft">
            {NAV.map((n) => (
              <li key={n.id}>
                <Link
                  href={onTop ? `#${n.id}` : `/#${n.id}`}
                  className="link-draw inline-block py-2 hover:text-ink"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {updated && (
          <span className="ml-auto flex items-center gap-2 rounded-full border rule bg-paper-light px-3 py-1 text-[11px] font-bold text-ink-soft lg:ml-6">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
            <span>
              <span className="hidden sm:inline">最終更新 </span>
              <span className="num text-[13px] text-ink">{updated}</span>
            </span>
          </span>
        )}
      </div>
      <ScrollProgress />
      {/* 狭い画面では見出しへの移動を横スクロールの帯に */}
      <nav aria-label="ページ内の見出し（小さい画面）" className="lg:hidden">
        <ul className="no-sb flex gap-5 overflow-x-auto border-t rule px-4 py-0.5 text-[12px] font-bold text-ink-soft sm:px-6">
          {NAV.map((n) => (
            <li key={n.id} className="shrink-0">
              <Link
                href={onTop ? `#${n.id}` : `/#${n.id}`}
                className="inline-block py-2 hover:text-ink"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
