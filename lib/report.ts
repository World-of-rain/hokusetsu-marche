import { DEFAULT_AREA } from "./site";
import type { SelectedItem } from "./types";

// 商品情報の誤り通報。詳細ポップアップから理由を選んで送るだけの軽い導線にする。
export type ReportReason = "price" | "name" | "period" | "ended" | "other";

export const REPORT_REASONS: { code: ReportReason; label: string }[] = [
  { code: "price", label: "価格が違う" },
  { code: "name", label: "商品名が違う" },
  { code: "period", label: "販売期間が違う" },
  { code: "ended", label: "もう売っていない" },
  { code: "other", label: "その他" },
];

// Cloudflare Pages Function (/api/report) へ通報を送る。成否だけ返す。
export async function submitReport(
  item: SelectedItem,
  reason: ReportReason,
  comment: string
): Promise<boolean> {
  try {
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_id: item.item_id ?? 0,
        image_hash: item.image_hash ?? "",
        anchor_id: item.anchor_id ?? "",
        name: item.name,
        shop: item.shop,
        price: item.price,
        area: DEFAULT_AREA,
        reason,
        comment: (comment || "").slice(0, 300),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
