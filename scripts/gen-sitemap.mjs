// ビルド時に public/sitemap.xml を生成する。
// サイトは毎朝5時(JST)に再ビルドされるため、トップページの lastmod が毎日進み、
// 「毎日更新されているサイト」であることをクローラに正しく伝えられる。
// （npm run build 経由で実行される。直接 `npx next build` した場合は
//   コミット済みの sitemap.xml がそのまま使われるだけで、壊れはしない）
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hokusetsu-marche.com";

// JSTの今日の日付（YYYY-MM-DD）
const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());

const pages = [
  { path: "/", changefreq: "daily", priority: "1.0", lastmod: today },
  { path: "/guide", changefreq: "monthly", priority: "0.7" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/about", changefreq: "yearly", priority: "0.3" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((p) =>
    [
      "  <url>",
      `    <loc>${SITE_URL}${p.path}</loc>`,
      ...(p.lastmod ? [`    <lastmod>${p.lastmod}</lastmod>`] : []),
      `    <changefreq>${p.changefreq}</changefreq>`,
      `    <priority>${p.priority}</priority>`,
      "  </url>",
    ].join("\n")
  )
  .join("\n")}
</urlset>
`;

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sitemap.xml");
writeFileSync(out, xml);
console.log(`sitemap.xml generated (lastmod=${today})`);
