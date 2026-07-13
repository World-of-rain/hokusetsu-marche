import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  // PWA: Service Workerを登録（本番のみ）。オフライン時は最後に取得したデータを表示する
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 登録失敗（非対応ブラウザ等）は通常表示のまま
      });
    }
  }, []);

  return <Component {...pageProps} />;
}
