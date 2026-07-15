// Cloudflare Pages Function: POST /api/report
// フロントの詳細ポップアップからの「情報が違う」通報を受け取り、KVに1件ずつ積む。
// NAS側が1時間ごとに prefix "report:" を list→取り込み→削除する（受け口はここだけ）。
// - NASを直接公開しないための緩衝（KV経由）。
// - 直接DBは触らない。取り込み後にLLM再チェックを挟んでから補正する設計。

type KVNamespaceLike = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

type Env = {
  SALE_DATA?: KVNamespaceLike;
  // 設定されている場合のみ Turnstile 検証を行う（未設定なら検証はスキップ）
  TURNSTILE_SECRET?: string;
};

type Context = {
  request: Request;
  env: Env;
};

const REASONS = new Set(["price", "name", "period", "ended", "other"]);
const REPORT_TTL = 60 * 60 * 24 * 7; // 7日でKVから自動失効（取り込み漏れの掃除）
const RATE_WINDOW = 600; // 10分
const RATE_MAX = 20; // 同一IPからの上限（best-effort）
const DEDUP_TTL = 3600; // 同一IP×同一item×同一理由は1時間デデュープ

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  try {
    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);
    if (ip) form.append("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function onRequestPost(context: Context): Promise<Response> {
  const { request, env } = context;
  const kv = env.SALE_DATA;
  if (!kv) return json({ error: "kv_not_bound" }, 503);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const reason = str(body.reason, 20);
  if (!REASONS.has(reason)) return json({ error: "invalid_reason" }, 400);

  const name = str(body.name, 200);
  if (!name) return json({ error: "missing_name" }, 400);

  const area = str(body.area, 50);
  if (area && !/^[\w-]{1,50}$/.test(area)) return json({ error: "invalid_area" }, 400);

  const ip = request.headers.get("CF-Connecting-IP") || "";

  // 任意: Turnstile（シークレット設定時のみ検証）
  if (env.TURNSTILE_SECRET) {
    const token = str(body.turnstile_token, 2048);
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET, token, ip);
    if (!ok) return json({ error: "turnstile_failed" }, 403);
  }

  const ipHash = ip ? await sha256Hex(`${ip}:hm-report`) : "";

  // best-effort レート制限（KVは結果整合なので厳密ではない）
  if (ipHash) {
    const rlKey = `rl:${ipHash}`;
    const current = parseInt((await kv.get(rlKey)) || "0", 10) || 0;
    if (current >= RATE_MAX) return json({ error: "rate_limited" }, 429);
    await kv.put(rlKey, String(current + 1), { expirationTtl: RATE_WINDOW });
  }

  const itemId = Number.isFinite(body.item_id) ? Number(body.item_id) : 0;

  // 同一IP×同一item×同一理由の短時間重複は受理扱いにして積まない（スパム/連打抑制）
  if (ipHash) {
    const dedupKey = `dedup:${ipHash}:${itemId || name}:${reason}`;
    if (await kv.get(dedupKey)) return json({ ok: true, deduped: true }, 200);
    await kv.put(dedupKey, "1", { expirationTtl: DEDUP_TTL });
  }

  const record = {
    item_id: itemId,
    image_hash: str(body.image_hash, 64),
    anchor_id: str(body.anchor_id, 64),
    name,
    shop: str(body.shop, 100),
    price: Number.isFinite(body.price) ? Number(body.price) : 0,
    area,
    reason,
    comment: str(body.comment, 300),
    reporter_hash: ipHash.slice(0, 32),
    ts: new Date().toISOString(),
  };

  const key = `report:${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  await kv.put(key, JSON.stringify(record), { expirationTtl: REPORT_TTL });

  return json({ ok: true }, 200);
}
