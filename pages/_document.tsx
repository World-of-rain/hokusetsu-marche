import { Html, Head, Main, NextScript } from "next/document";
import { ADSENSE_CLIENT } from "../lib/site";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Google AdSense: サイト検証と広告配信（自動広告）。
            NEXT_PUBLIC_ADSENSE_CLIENT が設定されている場合のみ挿入される */}
        {ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
