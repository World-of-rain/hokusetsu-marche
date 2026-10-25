import { Fraunces, Zen_Old_Mincho } from "next/font/google";

// フォントはビルド時に Google Fonts から取り込み、自サイトから配信する（next/font の自己ホスト）。
// 外部への読み込みが発生しないので、CSP（font-src 'self'）を変えずに済む。
//
// 取り込むのは見出しの明朝と数字の欧文だけ。本文のゴシックは端末のフォント（ヒラギノ・Noto 等）に任せる。
// 日本語フォントは文字の範囲ごとに百個前後のファイルに分かれ、届くたびに組み直しが起きる。本文まで
// 取り込むと、低速の端末では描画が数秒遅れた（Lighthouse のスマホ条件で Style & Layout 5.6 秒）

// 見出し: 紙面の見出しのような明朝
export const display = Zen_Old_Mincho({
  weight: ["700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-display",
});

// 価格の数字・欧文: 光学サイズ軸を持つセリフ。大きな数字ほど表情が出る
export const numeral = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-num",
});

export const fontVariables = `${display.variable} ${numeral.variable}`;
