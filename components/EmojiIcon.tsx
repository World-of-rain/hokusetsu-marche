import { getItemEmoji } from "../lib/categoryIcons";

type Props = {
  name: string;
  category?: string;
  className?: string;
  emojiClassName?: string;
};

// 商品アイコン。外部画像に依存せず、カテゴリに応じた絵文字＋淡色タイルで表現する
export default function EmojiIcon({ name, category, className, emojiClassName }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-gradient-to-br from-amber-50 to-rose-50 border border-stone-100 ${className ?? ""}`}
    >
      <span className={emojiClassName ?? "text-xl"}>{getItemEmoji(name, category)}</span>
    </div>
  );
}
