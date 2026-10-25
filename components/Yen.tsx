// 価格の表示。数字は欧文セリフの等幅数字で大きく、「円」は小さく添える（紙面の値札の組み方）
type Props = {
  value: number;
  className?: string;
  /** 「円」の大きさ（数字に対する比） */
  unitClassName?: string;
};

export default function Yen({ value, className, unitClassName }: Props) {
  return (
    <span className={`num whitespace-nowrap ${className ?? ""}`}>
      {value.toLocaleString("ja-JP")}
      <span className={`font-sans font-bold ml-[0.08em] ${unitClassName ?? "text-[0.42em]"}`}>
        円
      </span>
    </span>
  );
}
