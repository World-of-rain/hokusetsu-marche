// 店舗名 → チラシページURL。フッターの一覧と詳細画面のリンクの両方で使う。
// 店舗を追加するときはここに1行足すだけでよい。
export const STORE_LINKS: { name: string; url: string }[] = [
  { name: "ライフ 庄内店", url: "https://tokubai.co.jp/%E3%83%A9%E3%82%A4%E3%83%95/7345" },
  {
    name: "ダイエー 豊中店",
    url: "https://tokubai.co.jp/%E3%83%80%E3%82%A4%E3%82%A8%E3%83%BC/10014",
  },
  { name: "サタケ 豊南店", url: "https://satake-takenoko.co.jp/flyer/index.html" },
  { name: "万代 豊中豊南店", url: "https://tokubai.co.jp/%E4%B8%87%E4%BB%A3/14011" },
  {
    name: "サンディ 庄内栄町店",
    url: "https://tokubai.co.jp/%E3%82%B5%E3%83%B3%E3%83%87%E3%82%A3/14012",
  },
  {
    name: "ジャパン 豊中庄内店",
    url: "https://tokubai.co.jp/%E3%82%B8%E3%83%A3%E3%83%91%E3%83%B3/14013",
  },
  {
    name: "スギ薬局 豊中庄内店",
    url: "https://tokubai.co.jp/%E3%82%B9%E3%82%AE%E8%96%AC%E5%B1%80/14014",
  },
];

export function getStoreUrl(shop: string | undefined): string | null {
  if (!shop || shop === "-") return null;
  const hit =
    STORE_LINKS.find((s) => s.name === shop) ||
    STORE_LINKS.find((s) => shop.includes(s.name) || s.name.includes(shop));
  return hit ? hit.url : null;
}
