import FallbackImage from "./FallbackImage";
import PriceSparkline from "./PriceSparkline";
import { getStoreUrl } from "../lib/storeLinks";
import type { SelectedItem } from "../lib/types";

type Props = {
  item: SelectedItem | null;
  onClose: () => void;
};

// 商品タップ時の詳細情報モーダル
export default function BottomSheet({ item, onClose }: Props) {
  if (!item) return null;

  const avgPrice = item.avg_price ?? 0;
  const minPrice = item.min_price ?? 0;
  const discountRate =
    avgPrice > 0 && item.price > 0 ? Math.round(((avgPrice - item.price) / avgPrice) * 100) : 0;

  const storeUrl = getStoreUrl(item.shop);

  return (
    <>
      {/* 背景のオーバーレイ */}
      <div className="fixed inset-0 bg-black/40 z-[100] transition-opacity" onClick={onClose}></div>

      {/* ボトムシート本体 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[101] p-5 pb-8 shadow-2xl transform transition-transform max-w-md mx-auto">
        <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-4"></div>

        <div className="flex gap-4 items-start mb-4">
          <FallbackImage
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-2xl shadow-sm"
          />
          <div>
            <h3 className="font-black text-stone-800 text-lg leading-tight">{item.name}</h3>
            <p className="text-stone-500 text-xs mt-1">
              {item.shop}
              {item.slot_day && (
                <span className="ml-1.5 bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.slot_day}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="bg-[#faf9f8] rounded-2xl p-4 mb-4 border border-stone-100">
          <div className="flex justify-between items-end mb-2">
            <span className="text-stone-500 text-xs font-bold">特売価格</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-rose-600 leading-none">{item.price}</span>
              <span className="text-rose-600 font-bold">円</span>
            </div>
          </div>

          {avgPrice > 0 && (
            <div className="flex justify-between items-center py-2 border-t border-stone-200/60 border-dashed">
              <span className="text-stone-500 text-[11px]">過去の平均価格</span>
              <span className="text-stone-700 text-xs font-bold">{avgPrice}円</span>
            </div>
          )}
          {minPrice > 0 && (
            <div className="flex justify-between items-center py-2 border-t border-stone-200/60 border-dashed">
              <span className="text-stone-500 text-[11px]">過去最安値</span>
              <span className="text-stone-700 text-xs font-bold">{minPrice}円</span>
            </div>
          )}

          {discountRate > 0 && (
            <div className="mt-2 bg-rose-100 text-rose-700 text-xs font-bold text-center py-1.5 rounded-xl">
              平均より {discountRate}% お得！🎉
            </div>
          )}
        </div>

        {/* 価格推移グラフ（主要セクションの商品のみ price_history が入っている） */}
        <PriceSparkline history={item.price_history} avgPrice={avgPrice} />

        <div className="space-y-3">
          {item.purchase_condition && (
            <div className="flex gap-2 items-start bg-amber-50 p-3 rounded-xl border border-amber-100">
              <span className="text-amber-500 mt-0.5">⚠️</span>
              <div>
                <div className="text-[10px] font-bold text-amber-700 mb-0.5">購入条件・備考</div>
                <div className="text-xs text-amber-900 font-medium">{item.purchase_condition}</div>
              </div>
            </div>
          )}

          {(item.sale_start_date || item.sale_end_date) && (
            <div className="flex gap-2 items-center text-xs text-stone-600 bg-stone-50 p-3 rounded-xl">
              <span>📅</span>
              <span className="font-medium">
                販売期間: {item.sale_start_date || "本日"} 〜{" "}
                {item.sale_end_date ? item.sale_end_date.replace("まで", "") : "未定"}
              </span>
            </div>
          )}

          {item.comment && (
            <div className="flex gap-2 items-start text-xs text-teal-800 bg-teal-50 p-3 rounded-xl">
              <span>💡</span>
              <span className="font-medium leading-relaxed">{item.comment}</span>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {storeUrl && (
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full bg-white border-2 border-stone-200 text-stone-700 font-bold py-3 rounded-2xl active:bg-stone-100 transition-colors"
            >
              🏪 {item.shop} のチラシページを開く ↗
            </a>
          )}
          <button
            onClick={onClose}
            className="w-full bg-stone-800 text-white font-bold py-3.5 rounded-2xl active:bg-stone-700 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </>
  );
}
