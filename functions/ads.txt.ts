// /ads.txt を生成する Pages Function。
// AdSense の広告主認証に必要。パブリッシャーID（ca-pub-XXXX の "ca-" を除いた pub-XXXX）を
// 出力する。環境変数があれば優先し、無ければ既定のクライアントID（公開情報）を使う。
type Env = { NEXT_PUBLIC_ADSENSE_CLIENT?: string; ADSENSE_CLIENT?: string };

export async function onRequestGet(context: { env: Env }): Promise<Response> {
  const client =
    context.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
    context.env.ADSENSE_CLIENT ||
    "ca-pub-3893504806371860";
  const pubId = client.replace(/^ca-/, ""); // "ca-pub-XXXX" -> "pub-XXXX"

  const body = pubId ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n` : "";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
