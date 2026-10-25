// しくみの3段。チラシ → AI の読み取り → 底値の比較
const STEPS = [
  {
    n: "01",
    t: "チラシを集める",
    d: "各スーパーが公開しているチラシを、4時間ごとに自動で取得します。",
  },
  {
    n: "02",
    t: "AIが読み取る",
    d: "商品名・価格・売り出し期間をAIが読み取り、品目ごとに名寄せします。",
  },
  {
    n: "03",
    t: "底値を比べる",
    d: "過去30日の価格と見比べ、今週いつ・どの店が一番安いかを毎朝まとめます。",
  },
];

export default function HowItWorks() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-[22px] border border-ink/15 bg-ink/15 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <li key={s.n} className="bg-paper p-7" data-reveal data-reveal-delay={String(i * 0.1)}>
          <p className="num text-[3.5rem] leading-none text-persimmon">{s.n}</p>
          <h3 className="mt-5 font-display text-2xl text-ink">{s.t}</h3>
          <p className="mt-3 text-[14px] leading-[1.9] text-ink-soft">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}
