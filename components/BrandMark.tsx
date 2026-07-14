// ヘッダーのロゴマーク（絵文字🛒の置き換え）。買い物かご＋新芽のイラスト。
export default function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl shadow-sm ${className ?? "w-7 h-7"}`}
      style={{ background: "linear-gradient(135deg,#fb7185,#f59e0b)" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="w-[70%] h-[70%]">
        {/* 新芽 */}
        <path
          d="M12 8c0-2-1.6-3.4-3.4-3.4C9 6.4 10.4 8 12 8zm0 0c0-2 1.6-3.4 3.4-3.4C15 6.4 13.6 8 12 8zm0 0v3"
          fill="#fff"
          stroke="#fff"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        {/* かご */}
        <path d="M5 11h14l-1.4 7.4a2 2 0 0 1-2 1.6H8.4a2 2 0 0 1-2-1.6z" fill="#fff" />
        <path d="M9 13.5l.6 4M15 13.5l-.6 4M12 13.5v4" stroke="#fb7185" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    </span>
  );
}
