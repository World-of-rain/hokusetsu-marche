// Cloudflare Pages Function: /api/prices/{area}
// NASのworkerがKVに書き込んだダッシュボードJSONをそのまま返す。
// ページは静的ビルド時のデータを初期表示し、このAPIで最新データに差し替える。

type KVNamespaceLike = {
  get(key: string): Promise<string | null>;
};

type Context = {
  params: { area: string | string[] };
  env: { SALE_DATA?: KVNamespaceLike };
};

export async function onRequestGet(context: Context): Promise<Response> {
  const areaParam = context.params.area;
  const area = Array.isArray(areaParam) ? areaParam[0] : areaParam;

  // エリアタグは英数字とハイフン/アンダースコアのみ許可（KVキーの安全性確保）
  if (!area || !/^[\w-]{1,50}$/.test(area)) {
    return jsonResponse({ error: "invalid_area" }, 400);
  }

  const kv = context.env.SALE_DATA;
  if (!kv) {
    // バインディング未設定（wrangler.toml反映前など）。フロントはビルド時データにフォールバックする
    return jsonResponse({ error: "kv_not_bound" }, 503);
  }

  const value = await kv.get(`prices:${area}`);
  if (!value) {
    // NASからまだ書き込まれていない。フロントはビルド時データにフォールバックする
    return jsonResponse({ error: "not_found" }, 404);
  }

  return new Response(value, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // エッジで60秒キャッシュ（KV読み取り回数の削減とレスポンス高速化）
      "Cache-Control": "public, max-age=60",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
