// 自前のイラストヒーロー（絵文字の散らしを廃止）。マルシェ（青空市場）の雰囲気を
// SVGシーンで表現する。外部画像に依存せず軽量・高精細・オフライン対応。
export default function HeroBanner() {
  return (
    <div aria-hidden="true" className="h-44 w-full relative overflow-hidden">
      <svg
        viewBox="0 0 400 176"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff1f2" />
            <stop offset="0.55" stopColor="#fff7ed" />
            <stop offset="1" stopColor="#ecfeff" />
          </linearGradient>
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.55" stopColor="#faf9f8" stopOpacity="0" />
            <stop offset="1" stopColor="#faf9f8" stopOpacity="1" />
          </linearGradient>
        </defs>

        <rect width="400" height="176" fill="url(#sky)" />

        {/* やわらかい太陽と雲 */}
        <circle cx="330" cy="34" r="20" fill="#fde68a" opacity="0.7" />
        <g fill="#ffffff" opacity="0.85">
          <ellipse cx="70" cy="30" rx="26" ry="11" />
          <ellipse cx="92" cy="24" rx="18" ry="9" />
          <ellipse cx="250" cy="20" rx="22" ry="9" />
        </g>

        {/* ストライプの日よけテント */}
        <g>
          <rect x="24" y="40" width="352" height="12" rx="4" fill="#e11d48" />
          <path d="M28 52h344l-10 22H38z" fill="#fff1f2" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <path
              key={i}
              d={`M${44 + i * 42} 52l-9 22h20l9-22z`}
              fill="#fb7185"
              opacity="0.9"
            />
          ))}
          <path d="M28 52h344" stroke="#be123c" strokeWidth="1.5" />
        </g>

        {/* 木箱の八百屋台 */}
        <g>
          <rect x="120" y="120" width="160" height="40" rx="6" fill="#c68a4e" />
          <rect x="120" y="120" width="160" height="40" rx="6" fill="none" stroke="#a56a34" strokeWidth="2" />
          <path d="M120 134h160M152 120v40M208 120v40M244 120v40" stroke="#a56a34" strokeWidth="1.6" />

          {/* 野菜・果物の山盛り */}
          {/* トマト */}
          <circle cx="150" cy="112" r="13" fill="#ef4444" />
          <path d="M150 101c-3 0-4-2-4-2m4 2c3 0 4-2 4-2m-4 2v3" stroke="#3f9142" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* 葉物 */}
          <circle cx="178" cy="110" r="15" fill="#86efac" />
          <path d="M178 96c-5 3-8 8-7 13m7-13c5 3 8 8 7 13m-7-13v16" stroke="#4ade80" strokeWidth="1.6" fill="none" />
          {/* りんご */}
          <path d="M210 110c-2-2-8-1-8 5 0 5 4 9 8 9s8-4 8-9c0-6-6-7-8-5z" fill="#f43f5e" />
          <path d="M210 110v-2c0-2 2-3 4-3" stroke="#7c3f16" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* にんじん */}
          <path d="M236 100l7-1 1 3-10 12c-1.4 1.4-4-1-2.6-2.6z" fill="#fb923c" />
          <path d="M243 99l-1-4M245 101l3-3M246 103l4-1" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" />
          {/* パン */}
          <path d="M256 116c0-4 4-6 9-6s9 2 9 6v6h-18z" fill="#e8b982" />
          <path d="M256 118h18" stroke="#c68a4e" strokeWidth="1.4" />
        </g>

        {/* ぶら下がった値札 */}
        <g transform="rotate(-14 300 96)">
          <path d="M292 88h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-20l-8-11z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <circle cx="290" cy="99" r="2.4" fill="#fff7e6" stroke="#d97706" strokeWidth="1.4" />
          <path d="M298 96h12M298 102h9" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
        </g>
        <path d="M300 60v22" stroke="#a56a34" strokeWidth="1.4" />

        {/* 下端を背景色になじませる */}
        <rect y="96" width="400" height="80" fill="url(#fade)" />
      </svg>
    </div>
  );
}
