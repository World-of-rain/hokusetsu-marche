import { useEffect, useRef, useState } from "react";
import ProductImage from "./ProductImage";
import Glyph from "./Glyph";
import PriceSparkline from "./PriceSparkline";
import { getStoreUrl } from "../lib/storeLinks";
import type { SelectedItem } from "../lib/types";

type Props = {
  item: SelectedItem | null;
  onClose: () => void;
};

const CLOSE_DRAG_THRESHOLD = 110; // これ以上下にドラッグしたら閉じる（px）

// 商品タップ時の詳細情報モーダル（ボトムシート）
export default function BottomSheet({ item, onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null); // スクロールする本文領域
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // 下スワイプで閉じるためのドラッグ状態
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(0);
  const dragYRef = useRef(0); // しきい値判定はstateの遅延を避けてrefで行う
  const activeRef = useRef(false);

  // アクセシビリティ: Escapeで閉じる・開いた時に閉じるボタンへフォーカス・
  // Tabキーのフォーカスをシート内に閉じ込める・背景スクロールをロック
  useEffect(() => {
    if (!item) return;

    setDragY(0);
    setDragging(false);
    dragYRef.current = 0;
    // 開いた時は必ず本文を最上部に戻す。閉じるボタンへのフォーカスは preventScroll を
    // 付けて、本文が下に自動スクロールするのを防ぐ。
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    closeButtonRef.current?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && sheetRef.current) {
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [item, onClose]);

  if (!item) return null;

  const avgPrice = item.avg_price ?? 0;
  const minPrice = item.min_price ?? 0;
  const discountRate =
    avgPrice > 0 && item.price > 0 ? Math.round(((avgPrice - item.price) / avgPrice) * 100) : 0;

  // バックエンド（config.yaml）由来のURLを最優先。無ければフロントの店舗一覧で補完する。
  const storeUrl = item.store_url || getStoreUrl(item.shop);

  // 下スワイプで閉じる。ヘッダー（ハンドル部）を掴んだ時は常に、本文を掴んだ時は
  // 本文が最上部までスクロール済みの時だけドラッグを開始する（内側スクロールと競合させない）。
  // これにより「詳細が長くスクロールが出る場合でも、ハンドルを下げれば必ず閉じる」ようにする。
  // ポインタキャプチャで、シートが下に動いてもmove/upイベントが届き続けるようにする。
  const onPointerDown = (e: React.PointerEvent) => {
    const body = bodyRef.current;
    if (body && body.contains(e.target as Node) && body.scrollTop > 0) return;
    activeRef.current = true;
    startYRef.current = e.clientY;
    dragYRef.current = 0;
    setDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // 一部環境で未対応でも致命的ではない
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!activeRef.current) return;
    const delta = e.clientY - startYRef.current;
    dragYRef.current = delta > 0 ? delta : 0;
    setDragY(dragYRef.current);
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!activeRef.current) return;
    activeRef.current = false;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // no-op
    }
    if (dragYRef.current > CLOSE_DRAG_THRESHOLD) {
      onClose();
    } else {
      dragYRef.current = 0;
      setDragY(0);
    }
  };

  return (
    <>
      {/* 背景のオーバーレイ */}
      <div
        className="fixed inset-0 bg-black/40 z-[100] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* ボトムシート本体（外枠はスクロールしない。本文だけが内部でスクロールする） */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name}の詳細`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragging ? "none" : "transform 0.25s ease",
        }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[101] shadow-2xl max-w-md mx-auto max-h-[88dvh] flex flex-col"
      >
        {/* 常に表示されるヘッダー兼ドラッグゾーン（ここを下スワイプすればいつでも閉じる） */}
        <div className="flex-shrink-0 px-4 pt-3 pb-2 cursor-grab" style={{ touchAction: "none" }}>
          {/* ドラッグハンドル（下スワイプで閉じられる目印） */}
          <div className="w-10 h-1.5 bg-stone-300 rounded-full mx-auto mb-3"></div>

          <div className="flex gap-3 items-center">
            <ProductImage
              name={item.name}
              category={item.category}
              icon={item.icon}
              width={200}
              className="w-14 h-14 rounded-2xl shadow-sm flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-black text-stone-800 text-base leading-tight truncate">
                {item.name}
              </h3>
              <p className="text-stone-600 text-xs mt-0.5">
                {item.shop}
                {item.slot_day && (
                  <span className="ml-1.5 bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.slot_day}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* スクロールする本文 */}
        <div
          ref={bodyRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 pb-6"
          style={{ touchAction: "pan-y", overscrollBehavior: "contain" }}
        >
          <div className="bg-[#faf9f8] rounded-2xl p-3 mb-3 border border-stone-100">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-stone-600 text-xs font-bold">特売価格</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-rose-600 leading-none">{item.price}</span>
                <span className="text-rose-600 font-bold text-sm">円</span>
              </div>
            </div>

            {avgPrice > 0 && (
              <div className="flex justify-between items-center py-1.5 border-t border-stone-200/60 border-dashed">
                <span className="text-stone-600 text-[11px]">過去の平均価格</span>
                <span className="text-stone-700 text-xs font-bold">{avgPrice}円</span>
              </div>
            )}
            {minPrice > 0 && (
              <div className="flex justify-between items-center py-1.5 border-t border-stone-200/60 border-dashed">
                <span className="text-stone-600 text-[11px]">過去最安値</span>
                <span className="text-stone-700 text-xs font-bold">{minPrice}円</span>
              </div>
            )}

            {discountRate > 0 && (
              <div className="mt-1.5 bg-rose-100 text-rose-700 text-xs font-bold text-center py-1.5 rounded-xl flex items-center justify-center gap-1">
                <Glyph name="sparkle" className="w-3.5 h-3.5" />
                平均より {discountRate}% お得！
              </div>
            )}
          </div>

          {/* 価格推移グラフ（主要セクションの商品のみ price_history が入っている） */}
          <PriceSparkline history={item.price_history} avgPrice={avgPrice} />

          <div className="space-y-2.5">
            {item.purchase_condition && (
              <div className="flex gap-2 items-start bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                <span className="text-amber-500 mt-0.5">
                  <Glyph name="warning" className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-[10px] font-bold text-amber-700 mb-0.5">購入条件・備考</div>
                  <div className="text-xs text-amber-900 font-medium">
                    {item.purchase_condition}
                  </div>
                </div>
              </div>
            )}

            {(item.sale_start_date || item.sale_end_date) && (
              <div className="flex gap-2 items-center text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl">
                <span className="text-stone-400">
                  <Glyph name="calendar" className="w-4 h-4" />
                </span>
                <span className="font-medium">
                  販売期間: {item.sale_start_date || "本日"} 〜{" "}
                  {item.sale_end_date ? item.sale_end_date.replace("まで", "") : "未定"}
                </span>
              </div>
            )}

            {item.comment && (
              <div className="flex gap-2 items-start text-xs text-teal-800 bg-teal-50 p-2.5 rounded-xl">
                <span className="text-teal-500 mt-0.5">
                  <Glyph name="bulb" className="w-4 h-4" />
                </span>
                <span className="font-medium leading-relaxed">{item.comment}</span>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-2.5">
            {storeUrl && (
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full bg-white border-2 border-stone-200 text-stone-700 font-bold py-2.5 rounded-2xl active:bg-stone-100 transition-colors text-sm"
              >
                <Glyph name="store" className="w-4 h-4 text-rose-500" />
                {item.shop} のチラシを見る ↗
              </a>
            )}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="w-full bg-stone-800 text-white font-bold py-3 rounded-2xl active:bg-stone-700 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
