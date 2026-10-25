import type { ReactNode } from "react";

type Props = {
  /** 紙面の面番号（"01"） */
  index: string;
  /** 欧文の小見出し（"BOTTOM PRICE"） */
  kicker: string;
  /** 和文の前置き（"毎日の必需品"） */
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** 右肩に置く操作（タブ・選択） */
  aside?: ReactNode;
  id?: string;
};

// セクションの見出し。面番号・欧文キッカー・明朝の大見出し・リードを紙面の柱のように組む
export default function SectionHead({ index, kicker, eyebrow, title, lead, aside, id }: Props) {
  return (
    <header className="mb-8 md:mb-12" data-reveal>
      <div className="flex items-center gap-3 border-t-2 rule-strong pt-3 text-[11px] tracking-[0.18em] text-ink-soft">
        <span className="num text-sm font-semibold text-persimmon">{index}</span>
        <span className="uppercase">{kicker}</span>
        <span className="flex-1 border-t rule" aria-hidden="true" />
      </div>
      <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="mb-2 text-sm font-bold text-ink-soft">{eyebrow}</p>}
          <h2
            id={id}
            className="phrase font-display text-[2rem] leading-[1.15] tracking-tight text-ink sm:text-[2.6rem] md:text-[3.2rem]"
          >
            {title}
          </h2>
          {lead && <p className="phrase mt-4 text-[15px] leading-relaxed text-ink-soft">{lead}</p>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </header>
  );
}
