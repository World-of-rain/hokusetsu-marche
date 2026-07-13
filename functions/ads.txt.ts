// /ads.txt を環境変数から動的に生成する Pages Function。
// AdSense の広告主認証に必要。パブリッシャーID（ca-pub-XXXX の "ca-" を除いた pub-XXXX）を
// NEXT_PUBLIC_ADSENSE_CLIENT から取り出して出力する。未設定時は空を返す。
type Env = { NEXT_PUBLIC_ADSENSE_CLIENT?: string; ADSENSE_CLIENT?: string };

export async function onRequestGet(context: { env: Env }): Promise<Response> {
  const client = context.env.NEXT_PUBLIC_ADSENSE_CLIENT || context.env.ADSENSE_CLIENT || "";
  const pubId = client.replace(/^ca-/, ""); // "ca-pub-XXXX" -> "pub-XXXX"

  const body = pubId ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n` : "";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
