import { useEffect, useRef, useState } from "react";
import ProductImage from "./ProductImage";
import Glyph from "./Glyph";
import PriceSparkline from "./PriceSparkline";
import Yen from "./Yen";
import { getStoreUrl } from "../lib/storeLinks";
import { REPORT_REASONS, submitReport, type ReportReason } from "../lib/report";
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

  // 情報の誤り通報
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason | null>(null);
  const [reportComment, setReportComment] = useState("");
  const [reportStatus, setReportStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  // アクセシビリティ: Escapeで閉じる・開いた時に閉じるボタンへフォーカス・
  // Tabキーのフォーカスをシート内に閉じ込める・背景スクロールをロック
  useEffect(() => {
    if (!item) return;

    setDragY(0);
    setDragging(false);
    dragYRef.current = 0;
    setReportOpen(false);
    setReportReason(null);
    setReportComment("");
    setReportStatus("idle");
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

  const handleSubmitReport = async () => {
    if (!reportReason || reportStatus === "sending") return;
    setReportStatus("sending");
    const ok = await submitReport(item, reportReason, reportComment);
    setReportStatus(ok ? "done" : "error");
  };

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
        className="fade-in fixed inset-0 z-[100] bg-ink/45 backdrop-blur-[2px]"
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
        className="sheet-in fixed bottom-0 left-0 right-0 z-[101] mx-auto flex max-h-[90dvh] max-w-lg flex-col rounded-t-[28px] border border-ink/20 bg-paper shadow-lift md:bottom-0 md:top-0 md:my-auto md:h-fit md:max-h-[86dvh] md:rounded-[28px]"
      >
        {/* 常に表示されるヘッダー兼ドラッグゾーン（ここを下スワイプすればいつでも閉じる） */}
        <div
          className="flex-shrink-0 cursor-grab px-5 pb-3 pt-3 md:px-7 md:pt-7"
          style={{ touchAction: "none" }}
        >
          {/* ドラッグハンドル（下スワイプで閉じられる目印） */}
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/20 md:hidden"></div>

          <div className="flex gap-3 items-center">
            <ProductImage
              name={item.name}
              category={item.category}
              icon={item.icon}
              photoUrl={item.photo_url}
              width={200}
              className="h-16 w-16 flex-shrink-0 rounded-2xl border rule"
            />
            <div className="min-w-0">
              <h3 className="font-display text-[1.6rem] leading-tight text-ink">{item.name}</h3>
              {item.raw_item_name && item.raw_item_name !== item.name && (
                <p className="mt-1 line-clamp-2 text-[11px] leading-tight text-ink-mute">
                  {item.raw_item_name}
                </p>
              )}
              <p className="mt-1 text-[13px] font-bold text-ink-soft">
                {item.shop}
                {item.slot_day && (
                  <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-paper">
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
          className="min-h-0 flex-1 overflow-y-auto px-5 pb-7 md:px-7"
          style={{ touchAction: "pan-y", overscrollBehavior: "contain" }}
        >
          {/* 通報の状態（ユーザーへの結果表示） */}
          {item.report_state === "checking" && (
            <div className="mb-3 flex items-center gap-2 rounded-2xl border border-mustard/50 bg-mustard-tint p-3 text-[12px] text-ink">
              <Glyph name="clock" className="h-3.5 w-3.5 flex-shrink-0" />
              この商品情報にはユーザーからの報告があり、確認中です。
            </div>
          )}
          {item.report_state === "fixed" && (
            <div className="mb-3 flex items-center gap-2 rounded-2xl bg-leaf-tint p-3 text-[12px] text-leaf-deep">
              <Glyph name="sparkle" className="h-3.5 w-3.5 flex-shrink-0" />
              ユーザーからの報告を受けて、この商品情報は修正済みです。
            </div>
          )}

          <div className="mb-4 rounded-[20px] border border-ink/15 bg-paper-light p-4">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[12px] font-bold tracking-[0.12em] text-ink-mute">
                特売価格
              </span>
              <div className="text-right">
                <Yen value={item.price} className="text-[3.2rem] leading-none text-persimmon" />
                {item.unit_price_text && (
                  <div className="mt-1 text-[11px] text-ink-mute">（{item.unit_price_text}）</div>
                )}
              </div>
            </div>

            {avgPrice > 0 && (
              <div className="flex items-center justify-between border-t border-dashed border-ink/20 py-2">
                <span className="text-[12px] text-ink-soft">過去の平均価格</span>
                <span className="num text-lg text-ink">{avgPrice}円</span>
              </div>
            )}
            {minPrice > 0 && (
              <div className="flex items-center justify-between border-t border-dashed border-ink/20 py-2">
                <span className="text-[12px] text-ink-soft">過去最安値</span>
                <span className="num text-lg text-ink">{minPrice}円</span>
              </div>
            )}

            {discountRate > 0 && (
              <div className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-leaf py-2 text-[13px] font-bold text-white">
                <Glyph name="sparkle" className="w-3.5 h-3.5" />
                平均より {discountRate}% お得！
              </div>
            )}
          </div>

          {/* この日に複数店舗で特売がある場合は全店舗を表示 */}
          {item.offers && item.offers.length > 1 && (
            <div className="mb-4 rounded-[20px] border border-ink/15 p-4">
              <div className="mb-2 text-[12px] font-bold tracking-[0.08em] text-ink-mute">
                {item.slot_day ? `${item.slot_day}の取扱店` : "この日の取扱店"}
              </div>
              <div className="space-y-1">
                {[...item.offers]
                  .sort((a, b) => a.price - b.price)
                  .map((o, oi) => (
                    <div
                      key={oi}
                      className="flex items-start justify-between gap-2 border-b border-dashed border-ink/15 py-2 text-xs last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-bold text-ink">{o.shop}</div>
                        {o.raw_item_name && (
                          <div className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-ink-mute">
                            {o.raw_item_name}
                          </div>
                        )}
                        {o.store_url && (
                          <a
                            href={o.store_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-persimmon underline-offset-2 hover:underline"
                          >
                            <Glyph name="store" className="w-3 h-3" />
                            チラシを見る ↗
                          </a>
                        )}
                      </div>
                      <div className="text-right whitespace-nowrap flex-shrink-0">
                        <span
                          className={`num text-xl ${
                            o.price === item.price ? "text-persimmon" : "text-ink-soft"
                          }`}
                        >
                          {o.price}円
                        </span>
                        {o.bonus_points > 0 && (
                          <div className="mt-0.5">
                            <span className="rounded-full bg-plum px-1.5 py-0.5 text-[9px] font-bold text-white">
                              +{o.bonus_points}pt
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 価格推移グラフ（主要セクションの商品のみ price_history が入っている） */}
          <PriceSparkline history={item.price_history} avgPrice={avgPrice} />

          <div className="space-y-2.5">
            {item.purchase_condition && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-mustard/50 bg-mustard-tint p-3">
                <span className="mt-0.5 text-ink">
                  <Glyph name="warning" className="w-4 h-4" />
                </span>
                <div>
                  <div className="mb-0.5 text-[11px] font-bold text-ink-soft">購入条件・備考</div>
                  <div className="text-[13px] font-bold text-ink">{item.purchase_condition}</div>
                </div>
              </div>
            )}

            {(item.sale_start_date || item.sale_end_date) && (
              <div className="flex items-center gap-2.5 rounded-2xl border border-ink/10 bg-paper-light p-3 text-[13px] text-ink-soft">
                <span className="text-ink-mute">
                  <Glyph name="calendar" className="w-4 h-4" />
                </span>
                <span className="font-medium">
                  販売期間:{" "}
                  {item.sale_start_date
                    ? `${item.sale_start_date} 〜 ${
                        item.sale_end_date ? item.sale_end_date.replace("まで", "") : "未定"
                      }`
                    : item.sale_end_date
                      ? `${item.sale_end_date.replace("まで", "")}まで`
                      : "未定"}
                </span>
              </div>
            )}

            {item.comment && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-leaf-tint p-3 text-[13px] text-leaf-deep">
                <span className="mt-0.5 text-leaf">
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
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-ink py-3 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <Glyph name="store" className="h-4 w-4" />
                {item.shop} のチラシを見る ↗
              </a>
            )}
            {item.product_url && (
              <a
                href={item.product_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex w-full flex-col items-center justify-center rounded-full border border-ink/20 py-2.5 text-ink-soft transition-colors hover:border-ink"
              >
                <span className="text-[12px] font-bold text-ink">
                  Yahoo!ショッピングで商品を見る ↗
                </span>
                <span className="mt-0.5 text-[10px] text-ink-mute">
                  商品画像・情報: Yahoo!ショッピング
                  {item.jan_code ? ` / JAN ${item.jan_code}` : ""}
                </span>
              </a>
            )}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="w-full rounded-full bg-ink py-3.5 font-bold text-paper transition-colors hover:bg-persimmon"
            >
              閉じる
            </button>
          </div>

          {/* 情報の誤り通報（理由を選ぶだけの軽い導線） */}
          <div className="mt-4 border-t rule pt-4">
            {reportStatus === "done" ? (
              <p className="flex items-center justify-center gap-1 py-1 text-[12px] font-bold text-leaf">
                <Glyph name="sparkle" className="w-3.5 h-3.5" />
                ご報告ありがとうございます。確認して修正します。
              </p>
            ) : item.report_state === "checking" ? (
              <p className="py-1 text-center text-[12px] text-ink-mute">
                この商品への報告はすでに受付済みで、確認中です。
              </p>
            ) : !reportOpen ? (
              <button
                onClick={() => setReportOpen(true)}
                className="flex w-full items-center justify-center gap-1 py-1 text-[12px] text-ink-mute hover:text-ink"
              >
                <Glyph name="warning" className="w-3 h-3" />
                この商品の情報が違う場合は報告する
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-[13px] font-bold text-ink">どこが違いますか？</p>
                <div className="flex flex-wrap gap-1.5">
                  {REPORT_REASONS.map((r) => (
                    <button
                      key={r.code}
                      onClick={() => setReportReason(r.code)}
                      aria-pressed={reportReason === r.code}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors ${
                        reportReason === r.code
                          ? "border-persimmon bg-persimmon text-white"
                          : "border-ink/20 text-ink-soft hover:border-ink"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  maxLength={300}
                  rows={2}
                  placeholder="補足があれば（任意）"
                  aria-label="補足（任意）"
                  className="w-full resize-none rounded-2xl border border-ink/20 bg-paper-light p-3 text-[13px] focus:border-ink focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setReportOpen(false)}
                    className="flex-1 rounded-full border border-ink/20 py-2.5 text-[12px] font-bold text-ink-soft hover:border-ink"
                  >
                    やめる
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    disabled={!reportReason || reportStatus === "sending"}
                    className="flex-1 rounded-full bg-persimmon py-2.5 text-[12px] font-bold text-white hover:bg-persimmon-deep disabled:opacity-40"
                  >
                    {reportStatus === "sending" ? "送信中…" : "報告する"}
                  </button>
                </div>
                {reportStatus === "error" && (
                  <p className="text-center text-[11px] text-persimmon">
                    送信に失敗しました。時間をおいて再度お試しください。
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
