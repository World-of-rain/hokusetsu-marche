/**
 * 販売終了日から残り日数を計算
 * @param {string} saleDateStr - 販売終了日文字列 (例: "7/4まで", "7/4")
 * @returns {object} { daysRemaining: number, isExpired: boolean, label: string }
 */
export function calculateDaysRemaining(saleDateStr) {
  if (!saleDateStr) {
    return { daysRemaining: null, isExpired: false, label: "" };
  }

  try {
    // "7/4まで" や "7/4" から日付部分を抽出
    const dateMatch = saleDateStr.match(/(\d+)\/(\d+)/);
    if (!dateMatch) {
      return { daysRemaining: null, isExpired: false, label: "" };
    }

    const [, month, day] = dateMatch;
    const now = new Date();
    const currentYear = now.getFullYear();

    // 販売終了日を作成（23:59:59まで有効と考える）
    const saleEndDate = new Date(currentYear, parseInt(month) - 1, parseInt(day), 23, 59, 59);

    // 年を越える場合の処理
    if (saleEndDate < now) {
      saleEndDate.setFullYear(currentYear + 1);
    }

    // 残り日数を計算（ミリ秒 -> 日数）
    const timeDiff = saleEndDate - now;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    let label = "";
    let isExpired = false;

    if (daysRemaining <= 0) {
      label = "本日限り";
      isExpired = true;
    } else if (daysRemaining === 1) {
      label = "あと1日";
    } else {
      label = `あと${daysRemaining}日`;
    }

    return { daysRemaining, isExpired, label };
  } catch (error) {
    console.error("Error calculating days remaining:", error);
    return { daysRemaining: null, isExpired: false, label: "" };
  }
}
