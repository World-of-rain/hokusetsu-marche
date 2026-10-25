// 店舗名 → チラシページURL。フッターの一覧・詳細画面のリンク・店舗別ページ（/stores/<slug>）で使う。
// 店舗を追加するときはここに1行足すだけでよい（slug は URL になるので変えない）。
export type StoreLink = {
  name: string;
  url: string;
  slug: string;
  /** チェーン名（店舗ページの見出し・構造化データの brand） */
  chain: string;
  /** 業態（店舗ページの構造化データの型） */
  kind: "GroceryStore" | "Pharmacy" | "Store";
};

export const STORE_LINKS: StoreLink[] = [
  {
    name: "ライフ 庄内店",
    url: "https://tokubai.co.jp/%E3%83%A9%E3%82%A4%E3%83%95/7345",
    slug: "life-shonai",
    chain: "ライフ",
    kind: "GroceryStore",
  },
  {
    name: "ダイエー 豊中店",
    url: "https://tokubai.co.jp/%E3%83%80%E3%82%A4%E3%82%A8%E3%83%BC/10014",
    slug: "daiei-toyonaka",
    chain: "ダイエー",
    kind: "GroceryStore",
  },
  {
    name: "サタケ 豊南店",
    url: "https://satake-takenoko.co.jp/flyer/index.html",
    slug: "satake-honan",
    chain: "サタケ",
    kind: "GroceryStore",
  },
  {
    name: "万代 豊中豊南店",
    url: "https://tokubai.co.jp/%E4%B8%87%E4%BB%A3/14011",
    slug: "mandai-toyonaka-honan",
    chain: "万代",
    kind: "GroceryStore",
  },
  {
    name: "サンディ 庄内栄町店",
    url: "https://tokubai.co.jp/%E3%82%B5%E3%83%B3%E3%83%87%E3%82%A3/14012",
    slug: "sunday-shonai-sakaemachi",
    chain: "サンディ",
    kind: "GroceryStore",
  },
  {
    name: "ジャパン 豊中庄内店",
    url: "https://tokubai.co.jp/%E3%82%B8%E3%83%A3%E3%83%91%E3%83%B3/14013",
    slug: "japan-toyonaka-shonai",
    chain: "ジャパン",
    kind: "Store",
  },
  {
    name: "スギ薬局 豊中庄内店",
    url: "https://tokubai.co.jp/%E3%82%B9%E3%82%AE%E8%96%AC%E5%B1%80/14014",
    slug: "sugi-toyonaka-shonai",
    chain: "スギ薬局",
    kind: "Pharmacy",
  },
];

// 全角/半角スペースを除去して照合の表記ゆれ（例:「ライフ 庄内店」と「ライフ庄内店」）を吸収する
function normalizeStoreName(s: string): string {
  return s.replace(/[\s　]/g, "");
}

export function getStoreUrl(shop: string | undefined): string | null {
  if (!shop || shop === "-") return null;
  const target = normalizeStoreName(shop);
  const hit =
    STORE_LINKS.find((s) => normalizeStoreName(s.name) === target) ||
    STORE_LINKS.find((s) => {
      const n = normalizeStoreName(s.name);
      return target.includes(n) || n.includes(target);
    });
  return hit ? hit.url : null;
}

/** 商品の店舗名（データ側の表記）が、この店舗のものか（表記ゆれ・支店名の省略を吸収する） */
export function isSameStore(shop: string | undefined, store: StoreLink): boolean {
  if (!shop) return false;
  const a = normalizeStoreName(shop);
  const b = normalizeStoreName(store.name);
  return a === b || a.includes(b) || b.includes(a);
}

export function storeBySlug(slug: string): StoreLink | undefined {
  return STORE_LINKS.find((s) => s.slug === slug);
}

/** 商品の店舗名から店舗ページを探す（無ければ undefined） */
export function storeForShop(shop: string | undefined): StoreLink | undefined {
  return STORE_LINKS.find((s) => isSameStore(shop, s));
}
