import { Html, Head, Main, NextScript } from "next/document";
import { ADSENSE_CLIENT } from "../lib/site";

// スクロールで現れる演出は .js クラスがあるときだけ効かせる。描画前に付けてちらつきを防ぎ、
// 3秒たっても演出の準備ができなければ外して全部を見せる（JS の読み込み失敗で中身が消えないように）
const REVEAL_BOOT = `(function(d){d.documentElement.classList.add('js');setTimeout(function(){if(!window.__revealReady)d.documentElement.classList.remove('js')},3000)})(document)`;

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
        <meta name="theme-color" content="#f3eee4" />
        <link rel="icon" href="/icons/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
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
