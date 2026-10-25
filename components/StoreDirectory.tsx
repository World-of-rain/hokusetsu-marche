import Link from "next/link";
import { STORE_LINKS, isSameStore } from "../lib/storeLinks";
import type { GeneralItem } from "../lib/types";

// 店舗の索引。チェーン名を明朝で大きく、今週の掲載数と、店舗ページ・公式チラシへの導線を置く
export default function StoreDirectory({ general }: { general: GeneralItem[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[22px] border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
      {STORE_LINKS.map((s, i) => {
        const count = general.filter((g) => isSameStore(g.shop, s)).length;
        const branch = s.name.replace(s.chain, "").trim();
        return (
          <li
            key={s.slug}
            className="bg-paper"
            data-reveal
            data-reveal-delay={String((i % 4) * 0.06)}
          >
            <div className="group relative flex h-full flex-col p-6 transition-colors duration-500 hover:bg-paper-light">
              <p className="num text-sm text-ink-mute">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-[1.9rem] leading-none text-ink">
                <Link
                  href={`/stores/${s.slug}`}
                  className="after:absolute after:inset-0 hover:text-persimmon focus:outline-none"
                >
                  {s.chain}
                </Link>
              </h3>
              <p className="mt-2 text-[13px] font-bold text-ink-soft">{branch}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="num text-4xl leading-none text-ink">{count}</span>
                <span className="text-[12px] text-ink-mute">品を掲載中</span>
              </p>
              <div className="relative z-10 mt-5 flex items-center justify-between border-t border-dashed border-ink/20 pt-4 text-[12px] font-bold">
                <Link href={`/stores/${s.slug}`} className="link-draw text-ink">
                  この店の特売 →
                </Link>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw text-ink-mute hover:text-ink"
                >
                  公式チラシ ↗
                </a>
              </div>
            </div>
          </li>
        );
      })}
      {STORE_LINKS.length % 4 !== 0 && (
        <li
          className="hidden bg-ink text-paper lg:block"
          style={{
            gridColumn: `span ${4 - (STORE_LINKS.length % 4)} / span ${4 - (STORE_LINKS.length % 4)}`,
          }}
        >
          <a href="#list" className="group flex h-full flex-col justify-between p-6">
            <p className="text-[11px] font-bold tracking-[0.2em] text-paper/50">ALL STORES</p>
            <p className="font-display text-[1.9rem] leading-tight">
              全店の特売を、
              <br />
              ひとつの表で。
            </p>
            <span className="text-[12px] font-bold">
              総合特売リストへ{" "}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </a>
        </li>
      )}
    </ul>
  );
}
