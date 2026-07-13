type Props = {
  title: string;
  description: string;
  emoji: string;
};

export default function NativeAd({ title, description, emoji }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden relative flex p-3 gap-3 my-4">
      <span className="absolute top-0 right-0 bg-stone-200 text-stone-600 text-[10px] px-1.5 py-0.5 rounded-bl-lg font-bold z-10">
        スポンサーリンク
      </span>
      <div
        aria-hidden="true"
        className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-teal-50 to-amber-50 border border-stone-100"
      >
        <span className="text-3xl">{emoji}</span>
      </div>
      <div className="flex-1 pt-1">
        <h3 className="text-xs font-black text-stone-700 leading-tight">{title}</h3>
        <p className="text-[10px] text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
