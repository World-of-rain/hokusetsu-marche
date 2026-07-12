import { DashboardResponseSchema, type DashboardData } from "./types";

export async function fetchSaleData(): Promise<DashboardData | null> {
  const apiUrl = process.env.API_URL || "http://localhost:8000/api/prices/shonai";

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const json = await res.json();

    // スキーマ検証。バックエンドとフロントの認識ズレ（フィールド欠落・型違い）を
    // ビルド時点で検出し、壊れたデータのままデプロイされるのを防ぐ
    const parsed = DashboardResponseSchema.safeParse(json);
    if (!parsed.success) {
      console.error(
        "API response failed schema validation:",
        JSON.stringify(parsed.error.issues.slice(0, 5), null, 2)
      );
      return null;
    }
    const data = parsed.data;

    // バックエンドが内部エラー時に「200 + 全セクション空配列」を返すケースを検知する。
    // このまま通すと「ビルドは成功するがページが空」という状態で公開されてしまうため、
    // 全セクションが空なら取得失敗として null を返し、getStaticProps 側の
    // 本番ビルド中断（前回の正常なデプロイを維持する）につなげる。
    // 意図的に空データでビルドしたい場合は ALLOW_EMPTY_DATA=true を設定する。
    const isAllEmpty =
      data.daily.length === 0 &&
      data.stocks.length === 0 &&
      data.highlights.length === 0 &&
      data.general.length === 0;
    if (isAllEmpty && process.env.ALLOW_EMPTY_DATA !== "true") {
      console.error(
        "API returned 200 but all sections are empty. " +
          "Treating as fetch failure to keep the previous deployment. " +
          "(Set ALLOW_EMPTY_DATA=true to build anyway.)"
      );
      return null;
    }

    // 更新時刻を日本時間で付与
    const lastUpdated = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

    return { ...data, lastUpdated };
  } catch (error) {
    console.error("Failed to fetch sale data:", error);
    return null;
  }
}
