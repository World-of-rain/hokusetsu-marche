// ロゴマーク。柿の実（柿色の円）に若葉とヘタ。値札の穴を思わせる白い点を添える
export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className ?? "w-8 h-8"} aria-hidden="true">
      <circle cx="20" cy="22" r="15" fill="#e2482a" />
      <path
        d="M13 12.5c2.6-3.4 5.4-4.3 7-4.3s4.4.9 7 4.3c-2.6.6-4.6 1-7 1s-4.4-.4-7-1z"
        fill="#2f6b4f"
      />
      <path d="M20 8.2V4.5" stroke="#1c1a16" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M21 5.2c2.8-1.8 6-1.5 7.5.3-2.2 1.6-5 1.8-7.5-.3z" fill="#2f6b4f" />
      <circle cx="27.5" cy="27" r="2.4" fill="#f3eee4" />
    </svg>
  );
}
