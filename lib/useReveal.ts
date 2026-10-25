import { useEffect } from "react";

/**
 * data-reveal を付けた要素を、画面に入ったときに現す（.is-in を付ける）。
 * - JS が動かない環境（クローラ・JS 無効）では .js クラスが付かないので最初から見えている
 * - データの差し替えで後から増えた要素も MutationObserver で拾う
 * - data-reveal-delay（秒）で現れる順をずらせる
 */
export function useReveal() {
  useEffect(() => {
    const w = window as unknown as { __revealReady?: boolean };
    w.__revealReady = true;
    if (!("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("js");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
        const d = el.dataset.revealDelay;
        if (d) el.style.setProperty("--reveal-delay", `${d}s`);
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
