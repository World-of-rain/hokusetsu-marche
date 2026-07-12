import { useEffect, useState } from "react";
import { LiveDashboardSchema, type DashboardData } from "./types";

function formatJstTime(isoString: string): string | null {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * ビルド時に焼き込まれたデータを初期表示しつつ、表示後に
 * Pages Function（KV）から最新データを取得して差し替えるフック。
 * KVが未設定・未書き込み・オフライン等の場合はビルド時データのまま表示する
 * （再ビルドなしでデータが更新される、KV化の中核）。
 */
export function useLiveDashboardData(
  initial: DashboardData,
  area: string = "shonai"
): DashboardData {
  const [data, setData] = useState<DashboardData>(initial);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/prices/${area}`);
        if (!res.ok) return; // 404/503等はビルド時データにフォールバック

        const json: unknown = await res.json();
        const parsed = LiveDashboardSchema.safeParse(json);
        if (!parsed.success || cancelled) return;

        const live = parsed.data;
        const isAllEmpty =
          live.daily.length === 0 &&
          live.stocks.length === 0 &&
          live.highlights.length === 0 &&
          live.general.length === 0;
        if (isAllEmpty) return; // 空データでの上書きはしない

        const lastUpdated =
          (live.generated_at && formatJstTime(live.generated_at)) || initial.lastUpdated;

        setData({
          daily: live.daily,
          stocks: live.stocks,
          highlights: live.highlights,
          general: live.general,
          lastUpdated,
        });
      } catch {
        // ネットワークエラー時はビルド時データのまま
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initial, area]);

  return data;
}
