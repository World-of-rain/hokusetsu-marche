import type { DashboardData, GeneralItem } from "./types";

// トップの「本日のまとめ」。数字と短い文章をデータから組み立てる。
// 文章はページ本文にそのまま出すので、JS を動かさない検索エンジン・AI 検索も読める
// （ビルド時のデータで静的書き出しされ、表示後に最新データで書き換わる）

export type DailyLow = { name: string; price: number; shop: string; day: string };

export type Summary = {
  storeCount: number;
  todayCount: number;
  weekCount: number;
  dailyLows: DailyLow[];
  topPick: GeneralItem | null;
  topPickDiscount: number;
  text: string;
};

export function discountRate(item: { price: number; avg_price?: number }): number {
  const avg = item.avg_price ?? 0;
  return avg > 0 && item.price > 0 && avg > item.price
    ? Math.round(((avg - item.price) / avg) * 100)
    : 0;
}

/** 曜日の表記「日(明日)」→「明日（日）」、「火」→「火曜」 */
export function dayPhrase(day: string): string {
  const m = day.match(/^(.)\((今日|明日)\)$/);
  if (m) return `${m[2]}（${m[1]}）`;
  return /^[月火水木金土日]$/.test(day) ? `${day}曜` : day;
}

export function buildSummary(data: DashboardData, dateLabel: string): Summary {
  const shops = new Set<string>();
  data.general.forEach((g) => shops.add(g.shop));
  data.highlights.forEach((g) => shops.add(g.shop));
  data.daily.forEach((d) => d.schedule.forEach((s) => s.price > 0 && shops.add(s.shop)));
  shops.delete("-");
  shops.delete("");

  const todayCount = data.general.filter((g) => g.day === "today").length;
  const weekCount = data.general.length;

  const dailyLows: DailyLow[] = data.daily
    .map((d) => {
      const slot = d.schedule.find((s) => s.isMin) ?? null;
      return slot && slot.price > 0
        ? { name: d.name, price: slot.price, shop: slot.shop, day: slot.day }
        : null;
    })
    .filter((x): x is DailyLow => !!x);

  // 今日の一押し: 今日の目玉品のうち平均からの値引きが最大のもの。無ければ今日の特売の値引き最大
  const pool = data.highlights.filter((h) => h.day === "today");
  const fallback = data.general.filter((g) => g.day === "today");
  const candidates = pool.length ? pool : fallback.length ? fallback : data.highlights;
  const topPick =
    [...candidates].sort(
      (a, b) => discountRate(b) - discountRate(a) || b.bonus_points - a.bonus_points
    )[0] ?? null;

  const parts: string[] = [];
  if (shops.size > 0) {
    parts.push(
      `${dateLabel}の豊中市 庄内・服部エリアでは、${shops.size}店舗のチラシから${weekCount}品の特売を掲載しています（うち今日買えるもの${todayCount}品）。`
    );
  }
  if (dailyLows.length > 0) {
    const lows = dailyLows
      .slice(0, 3)
      .map((l) => `${l.name}は${dayPhrase(l.day)}の${l.shop}で${l.price}円`)
      .join("、");
    parts.push(`今週の底値は、${lows}です。`);
  }
  if (topPick) {
    const d = discountRate(topPick);
    parts.push(
      `今日の一押しは${topPick.shop}の「${topPick.name}」${topPick.price}円${d > 0 ? `（ふだんより${d}%安い）` : ""}。`
    );
  }

  return {
    storeCount: shops.size,
    todayCount,
    weekCount,
    dailyLows,
    topPick,
    topPickDiscount: topPick ? discountRate(topPick) : 0,
    text: parts.join(""),
  };
}
