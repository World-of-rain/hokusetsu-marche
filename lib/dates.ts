// 日付の表示。ビルド時（静的書き出し）と表示時で日付がずれないよう、日本時間で決める
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

/** 日本時間の今日（時刻は0時） */
export function jstToday(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [y, m, d] = parts.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** 「10/25」 */
export function md(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** 「2026年10月25日（日）」 */
export function longJa(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WEEK[d.getDay()]}）`;
}

/** 「SUN」 */
export function weekEn(d: Date): string {
  return ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][d.getDay()];
}

/** ISO の日付（YYYY-MM-DD） */
export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
