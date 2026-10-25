import { FAQ } from "../lib/faq";

// よくある質問。<details> で開閉する（JS 不要。検索エンジン・AI 検索にも本文として見える）
export default function FaqList({ headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  const H = `h${headingLevel}` as "h3" | "h4";
  return (
    <div className="border-t-2 rule-strong">
      {FAQ.map((f, i) => (
        <details
          key={f.q}
          className="group border-b rule"
          data-reveal
          data-reveal-delay={String(i * 0.04)}
        >
          <summary className="flex cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden">
            <span className="num pt-1 text-sm text-persimmon">Q{i + 1}</span>
            <H className="flex-1 text-[17px] font-bold leading-snug text-ink">{f.q}</H>
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/25 text-lg transition-transform duration-500 ease-out group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-paper"
            >
              +
            </span>
          </summary>
          <p className="pb-6 pl-10 pr-12 text-[15px] leading-[1.9] text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
