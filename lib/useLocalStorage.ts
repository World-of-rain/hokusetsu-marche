import { useEffect, useRef, useState } from "react";

/**
 * localStorageに永続化されるuseState。
 * SSR/静的エクスポートと整合させるため、初期描画はサーバと同じ initial を使い、
 * マウント後に保存値を読み込んで差し替える（ハイドレーション不一致を防ぐ）。
 */
export function useLocalStorageState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initial);
  const loadedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // 破損データ等は無視して初期値のまま
    }
    loadedRef.current = true;
  }, [key]);

  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // プライベートブラウズ等で保存できない場合は無視
    }
  }, [key, value]);

  return [value, setValue];
}
