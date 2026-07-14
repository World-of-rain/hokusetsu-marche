import type { ReactNode } from "react";

// セクション見出し。単独の絵文字をやめ、小さなイラストグリフ＋見出し＋
// グラデーションのアクセント下線で「作り込まれた」統一感を出す。
type Variant = "calendar" | "stock" | "flame" | "list";

const GLYPHS: Record<Variant, ReactNode> = {
  calendar: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="3" fill="#fff" opacity="0.9" />
      <path d="M4 10h16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4v4M16 4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="14" r="1.4" fill="currentColor" />
      <circle cx="14" cy="14" r="1.4" fill="currentColor" />
    </>
  ),
  stock: (
    <>
      <path d="M4 9l8-4 8 4-8 4z" fill="#fff" opacity="0.9" />
      <path d="M4 9v7l8 4 8-4V9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 13v7" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  flame: (
    <>
      <path
        d="M13 3c1 3-1 4-2 6-1-1-1-2-1-3-2 2-4 4-4 8a6 6 0 0 0 12 0c0-4-3-6-5-11z"
        fill="#fff"
        opacity="0.9"
      />
      <path d="M12 20a3 3 0 0 0 3-3c0-2-1.5-3-3-4.5C10.5 14 9 15 9 17a3 3 0 0 0 3 3z" fill="currentColor" />
    </>
  ),
  list: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="3" fill="#fff" opacity="0.9" />
      <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
};

type Props = {
  variant: Variant;
  title: ReactNode;
  tint: string; // Tailwindのテキスト色クラス（例: "text-rose-500"）
  chipBg: string; // チップ背景（例: "from-rose-400 to-orange-400"）
};

export default function SectionHeading({ variant, title, tint, chipBg }: Props) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br ${chipBg} text-white shadow-sm`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="w-[68%] h-[68%]">
          {GLYPHS[variant]}
        </svg>
      </span>
      <h2 className={`text-[13px] font-black tracking-tight ${tint}`}>{title}</h2>
      <span className="flex-1 h-px bg-gradient-to-r from-stone-200 to-transparent" />
    </div>
  );
}
