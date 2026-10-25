import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { fontVariables } from "../lib/fonts";
import { useReveal } from "../lib/useReveal";

export default function App({ Component, pageProps }: AppProps) {
  // PWA: Service Workerを登録（本番のみ）。オフライン時は最後に取得したデータを表示する
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 登録失敗（非対応ブラウザ等）は通常表示のまま
      });
    }
  }, []);
  useReveal();

  return (
    <div className={`${fontVariables} font-sans grain min-h-screen`}>
      <Component {...pageProps} />
    </div>
  );
}
