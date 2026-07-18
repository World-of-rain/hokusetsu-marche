import { Html, Head, Main, NextScript } from "next/document";
import { ADSENSE_CLIENT } from "../lib/site";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Bing Webmaster Tools のサイト所有権確認 */}
        <meta name="msvalidate.01" content="AC887F1A2D1C5459AF3954683D218571" />
        {/* Google AdSense: サイト検証と広告配信（自動広告）。
            ADSENSE_CLIENT（既定値あり）がある場合に挿入される。
            - meta: AdSense のサイト所有確認（申請時の検証）
            - script: 広告配信・自動広告 */}
        {ADSENSE_CLIENT && (
          <>
            <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
