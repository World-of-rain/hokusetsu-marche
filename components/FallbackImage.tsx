import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
  className?: string;
};

export default function FallbackImage({ src, alt, className }: Props) {
  const [error, setError] = useState(false);

  if (error || !src) {
    const initial = alt ? alt.charAt(0) : "🛒";
    return (
      <div
        className={`flex items-center justify-center bg-stone-200 text-stone-500 font-bold ${className ?? ""}`}
      >
        {initial}
      </div>
    );
  }

  // 外部ドメインの画像を静的エクスポートで扱うため next/image は使わない
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
}
