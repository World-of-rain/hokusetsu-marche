/**
 * 検索用のテキスト正規化。
 * - NFKC正規化（全角英数→半角など）
 * - 小文字化
 * - ひらがな→カタカナ変換（「とまと」で「トマト」がヒットするように）
 */
export function normalizeForSearch(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ぁ-ゖ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
}

export function matchesSearch(target: string, query: string): boolean {
  if (!query) return true;
  return normalizeForSearch(target).includes(normalizeForSearch(query));
}
