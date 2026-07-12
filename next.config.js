/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  // バックエンドAPIは応答時にLLM処理（ストック品判定・コメント生成）を
  // 同期実行するため60秒を超えることがある。デフォルトの60秒だと
  // ビルドがタイムアウトで失敗するため余裕を持たせる。
  staticPageGenerationTimeout: 300,
};
module.exports = nextConfig;
