// PWAアイコンとOG画像を生成するスクリプト（開発時に1回実行して成果物をコミットする）。
// 使い方: CHROMIUM_EXECUTABLE=/path/to/chrome node scripts/generate-assets.mjs
// フォントに依存しないSVGベクター描画のみで構成しているため、どの環境でも同じ絵が出る。
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

// 買い物かごのアイコン（rose系グラデーション＋白のかごモチーフ）
const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fb7185"/>
      <stop offset="1" stop-color="#e11d48"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="url(#bg)"/>
  <path d="M37 44 a13 15 0 0 1 26 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
  <path d="M26 46 h48 a3 3 0 0 1 3 3.5 l-4.5 24 a7 7 0 0 1 -6.9 5.5 h-31.2 a7 7 0 0 1 -6.9 -5.5 l-4.5 -24 a3 3 0 0 1 3 -3.5 z" fill="#fff"/>
  <line x1="41" y1="54" x2="42.5" y2="71" stroke="#fda4af" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="54" x2="50" y2="71" stroke="#fda4af" stroke-width="4" stroke-linecap="round"/>
  <line x1="59" y1="54" x2="57.5" y2="71" stroke="#fda4af" stroke-width="4" stroke-linecap="round"/>
  <circle cx="72" cy="34" r="11" fill="#fbbf24"/>
  <path d="M67.5 34 l3 3 l6 -6" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// OG画像（1200x630）。日本語テキストは環境のフォント差異を避けるためSVGパスではなく
// HTML+システムフォントで描き、フォントが無い環境でも成立するようアイコン主体の構図にする
const ogHtml = `
<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; }
  body { width: 1200px; height: 630px; overflow: hidden;
         font-family: "Hiragino Sans", "Noto Sans CJK JP", "Yu Gothic", sans-serif;
         background: linear-gradient(135deg, #ffe4e6 0%, #fef3c7 55%, #ccfbf1 100%);
         display: flex; align-items: center; justify-content: center; gap: 64px; }
  .icon { width: 260px; height: 260px; filter: drop-shadow(0 12px 24px rgba(225,29,72,.3)); }
  .text { max-width: 640px; }
  h1 { font-size: 72px; font-weight: 900; color: #1c1917; letter-spacing: -0.02em; }
  p  { font-size: 30px; font-weight: 700; color: #57534e; margin-top: 20px; line-height: 1.5; }
  .badge { display: inline-block; margin-top: 28px; background: #e11d48; color: #fff;
           font-size: 26px; font-weight: 800; padding: 12px 28px; border-radius: 999px; }
</style></head><body>
  <div class="icon">${iconSvg(260)}</div>
  <div class="text">
    <h1>北摂マルシェ</h1>
    <p>豊南エリアのスーパーのチラシ情報をAIが毎日集約</p>
    <div class="badge">今日の底値が一目でわかる</div>
  </div>
</body></html>`;

const iconHtml = (size) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0}body{width:${size}px;height:${size}px;overflow:hidden}</style></head><body>${iconSvg(size)}</body></html>`;

async function shoot(browser, html, width, height, path) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({ path, clip: { x: 0, y: 0, width, height } });
  await page.close();
  console.log(`generated: ${path}`);
}

const browser = await chromium.launch(
  process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}
);

await mkdir("public/icons", { recursive: true });
await shoot(browser, iconHtml(512), 512, 512, "public/icons/icon-512.png");
await shoot(browser, iconHtml(192), 192, 192, "public/icons/icon-192.png");
await shoot(browser, iconHtml(180), 180, 180, "public/icons/apple-touch-icon.png");
await shoot(browser, ogHtml, 1200, 630, "public/og-image.png");

await browser.close();
