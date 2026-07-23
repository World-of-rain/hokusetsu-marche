// ラベル用の極小インラインSVGアイコン（絵文字の置き換え）。currentColor を継承するので
// 文字色に馴染む。装飾目的なので aria-hidden。
type GlyphName =
  "warning" | "calendar" | "bulb" | "sparkle" | "store" | "trend" | "hourglass" | "stop" | "clock";

const PATHS: Record<GlyphName, React.ReactNode> = {
  warning: (
    <>
      <path
        d="M12 3l9 16H3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.1" fill="currentColor" />
    </>
  ),
  calendar: (
    <>
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4 9h16M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </>
  ),
  bulb: (
    <>
      <path
        d="M9 15a5 5 0 1 1 6 0c-.8.6-1 1.2-1 2H10c0-.8-.2-1.4-1-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M10 20h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.8 4.9L18.5 9l-4.7 1.8L12 15l-1.8-4.2L5.5 9l4.7-1.1z" fill="currentColor" />
      <path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" fill="currentColor" />
    </>
  ),
  store: (
    <>
      <path
        d="M4 9l1.4-4h13.2L20 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 6 0 2.5 2.5 0 0 0 5 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 11v8h14v-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9 19v-4h4v4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  trend: (
    <>
      <path
        d="M4 15l5-5 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 6h4v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  hourglass: (
    <>
      <path d="M7 4h10M7 20h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M8 4c0 4 8 4 8 8s-8 4-8 8M16 4c0 4-8 4-8 8s8 4 8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </>
  ),
  stop: (
    <>
      <path
        d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.1" fill="currentColor" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 7v5l3.5 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
};

export default function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "w-3.5 h-3.5"}
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "-0.15em" }}
    >
      {PATHS[name]}
    </svg>
  );
}
