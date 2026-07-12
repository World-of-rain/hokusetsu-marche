import FallbackImage from "./FallbackImage";

type Props = {
  title: string;
  description: string;
  imgUrl: string;
};

export default function NativeAd({ title, description, imgUrl }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden relative flex p-3 gap-3 my-4">
      <span className="absolute top-0 right-0 bg-stone-200 text-stone-500 text-[9px] px-1.5 py-0.5 rounded-bl-lg font-bold z-10">
        スポンサーリンク
      </span>
      <FallbackImage
        src={imgUrl}
        alt="ad"
        className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
      />
      <div className="flex-1 pt-1">
        <h3 className="text-xs font-black text-stone-700 leading-tight">{title}</h3>
        <p className="text-[10px] text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
