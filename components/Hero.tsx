import ProductImage from "./ProductImage";
import Yen from "./Yen";
import CountUp from "./CountUp";
import type { Summary } from "../lib/summary";
import type { SelectedItem } from "../lib/types";

type Props = {
  summary: Summary;
  dateLong: string;
  weekEn: string;
  updated: string;
  onOpen: (item: SelectedItem) => void;
};

// 冒頭の紙面。題字（大見出し）・本日のまとめ・今日の一押しの値札・数字の柱で組む
export default function Hero({ summary, dateLong, weekEn, updated, onOpen }: Props) {
  const pick = summary.topPick;
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10">
        {/* 題字の上の柱（新聞の日付欄） */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-y-2 rule-strong py-2 text-[11px] font-bold tracking-[0.14em] text-ink-soft">
          <span>
            <span className="num text-[12px] tracking-[0.2em]">MORNING EDITION</span>
            <span className="mx-2 text-ink-line">|</span>
            豊中市 庄内・服部版
          </span>
          <span className="flex items-center gap-2">
            <time dateTime={dateLong}>{dateLong}</time>
            <span className="num tracking-[0.2em] text-persimmon">{weekEn}</span>
          </span>
        </div>

        <div className="grid gap-10 pb-12 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-12 lg:pb-20">
          <div className="lg:col-span-7">
            <h1 id="hero-title">
              <span className="mb-5 flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] text-persimmon">
                <span className="h-px w-8 bg-persimmon" aria-hidden="true" />
                北摂マルシェ ── 豊中市 庄内・服部のスーパー特売・チラシまとめ
              </span>
              <span className="block font-display text-[3.1rem] leading-[1.02] tracking-tightest text-ink sm:text-[4.4rem] md:text-[5.6rem] xl:text-[6.6rem]">
                <span className="rise block" style={{ animationDelay: "0.05s" }}>
                  今日の
                  <span className="relative inline-block">
                    底値
                    <svg
                      viewBox="0 0 200 20"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      className="absolute -bottom-[0.06em] left-0 h-[0.18em] w-full text-persimmon"
                    >
                      <path
                        className="draw"
                        pathLength={1}
                        d="M2 14 C 50 4, 120 4, 198 11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  を、
                </span>
                <span className="rise block" style={{ animationDelay: "0.18s" }}>
                  朝いちばんに。
                </span>
              </span>
            </h1>
            <p
              className="rise mt-8 max-w-xl text-[15px] leading-[1.9] text-ink-soft md:text-base"
              style={{ animationDelay: "0.32s" }}
            >
              {summary.text ||
                "豊中市 庄内・服部エリアのスーパーのチラシをAIが毎朝読み取り、卵・牛乳などの必需品が今週いつ・どの店で一番安いかを一枚の紙面にまとめます。"}
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.44s" }}>
              <a
                href="#calendar"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper transition-colors hover:bg-persimmon"
              >
                底値カレンダーを見る
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </a>
              <a
                href="#stores"
                className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                店舗から探す
              </a>
            </div>
          </div>

          {/* 今日の一押し（値札） */}
          <div className="lg:col-span-5">
            {pick ? (
              <button
                type="button"
                onClick={() => onOpen(pick)}
                className="rise group relative block w-full text-left"
                style={{ animationDelay: "0.25s" }}
              >
                <div className="relative rotate-[1.2deg] rounded-[28px] border border-ink bg-paper-light p-6 shadow-lift transition-transform duration-700 ease-out group-hover:rotate-0 sm:p-8">
                  {/* 値札の穴と紐 */}
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-6 h-4 w-4 rounded-full border border-ink bg-paper"
                  />
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 60"
                    className="absolute -left-16 -top-8 hidden h-16 w-32 text-ink sm:block"
                  >
                    <path
                      d="M118 44 C 80 40, 40 10, 2 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                  <div className="flex items-start justify-between pl-8">
                    <p className="text-[11px] font-bold tracking-[0.22em] text-ink-mute">
                      TODAY&apos;S PICK
                    </p>
                    <span className="stamp grid h-20 w-20 place-items-center rounded-full border-2 border-persimmon text-center font-display text-[13px] leading-tight text-persimmon">
                      本日の
                      <br />
                      一押し
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <ProductImage
                      name={pick.name}
                      category={pick.category}
                      icon={pick.icon}
                      photoUrl={pick.photo_url}
                      width={240}
                      className="h-20 w-20 shrink-0 rounded-2xl border rule sm:h-24 sm:w-24"
                    />
                    <div className="min-w-0">
                      <p className="phrase font-display text-2xl leading-snug text-ink sm:text-[1.75rem]">
                        {pick.name}
                      </p>
                      <p className="mt-1 text-sm font-bold text-ink-soft">{pick.shop}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-dashed border-ink/30 pt-5">
                    <Yen
                      value={pick.price}
                      className="text-[4.6rem] leading-[0.85] text-persimmon sm:text-[5.6rem]"
                    />
                    {summary.topPickDiscount > 0 && (
                      <div className="mb-1 text-right">
                        <p className="num text-3xl leading-none text-leaf">
                          −{summary.topPickDiscount}%
                        </p>
                        <p className="mt-1 text-[11px] font-bold text-ink-mute">
                          ふだんの平均 {pick.avg_price}円
                        </p>
                      </div>
                    )}
                  </div>
                  {pick.comment && (
                    <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">{pick.comment}</p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-1 text-[12px] font-bold text-ink underline decoration-ink/30 underline-offset-4 group-hover:decoration-persimmon">
                    詳しく見る →
                  </span>
                </div>
              </button>
            ) : (
              <div className="rounded-[28px] border border-dashed border-ink/40 p-8 text-sm text-ink-mute">
                今日の一押しは、チラシの読み取りが終わりしだい掲載します。
              </div>
            )}
          </div>
        </div>

        {/* 数字の柱 */}
        <dl className="grid grid-cols-2 border-t-2 rule-strong md:grid-cols-4">
          {[
            { k: "掲載店舗", v: summary.storeCount, u: "店" },
            { k: "今日の特売", v: summary.todayCount, u: "品" },
            { k: "今週の特売", v: summary.weekCount, u: "品" },
          ].map((s, i) => (
            <div
              key={s.k}
              data-reveal
              data-reveal-delay={String(i * 0.08)}
              className={`border-b rule py-5 pr-4 md:border-b-0 ${i % 2 === 1 ? "pl-4 md:pl-6" : "md:pl-6"} ${i > 0 ? "md:border-l" : ""} ${i % 2 === 1 ? "border-l md:border-l" : ""} md:first:pl-0`}
            >
              <dt className="text-[11px] font-bold tracking-[0.12em] text-ink-mute">{s.k}</dt>
              <dd className="mt-1 flex items-baseline gap-1">
                <CountUp value={s.v} className="num text-5xl leading-none text-ink md:text-6xl" />
                <span className="text-sm font-bold text-ink-soft">{s.u}</span>
              </dd>
            </div>
          ))}
          <div data-reveal data-reveal-delay="0.24" className="border-l rule py-5 pl-4 md:pl-6">
            <dt className="text-[11px] font-bold tracking-[0.12em] text-ink-mute">最終更新</dt>
            <dd className="mt-1 num text-5xl leading-none text-ink md:text-6xl">{updated}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
