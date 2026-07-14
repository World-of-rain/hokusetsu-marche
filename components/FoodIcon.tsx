import { iconSvg, pickIconKey, normalizeIconKey, ICON_TINT } from "../lib/foodIcons";
import type { IconKey } from "../lib/foodIcons";

type Props = {
  name: string;
  category?: string;
  /** バックエンド（LLM選定）が返したアイコンキー。あれば最優先で使う */
  icon?: string;
  className?: string;
  /** 内側SVGの余白調整（省略時 p-[15%]） */
  padClassName?: string;
};

// 商品アイコン。自前のデュオトーンSVGイラストを、カテゴリ色の淡いタイルに載せて表示する。
// 絵文字を使わず、外部画像にも依存しない（オフライン・CSP・ライセンス面で安全）。
export default function FoodIcon({ name, category, icon, className, padClassName }: Props) {
  const key: IconKey = normalizeIconKey(icon) ?? pickIconKey(name, category);
  const tint = ICON_TINT[key];

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{
        background: `linear-gradient(135deg, ${tint}22, ${tint}0d 60%, #ffffff)`,
        boxShadow: `inset 0 0 0 1px ${tint}26`,
      }}
    >
      <svg
        viewBox="0 0 48 48"
        className={`w-full h-full ${padClassName ?? "p-[15%]"}`}
        role="img"
        aria-hidden="true"
      >
        {iconSvg(key)}
      </svg>
    </div>
  );
}
