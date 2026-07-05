export async function fetchSaleData() {
  const apiUrl = process.env.API_URL || "http://localhost:8000/api/prices/shonai";
  
  try {
    const res = await fetch(apiUrl, {
      cache: "no-store", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    
    // 更新時刻を日本時間で付与
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit'
    });
    const lastUpdated = formatter.format(now);
    
    return { ...data, lastUpdated };
  } catch (error) {
    console.error("Failed to fetch sale data:", error);
    return null;
  }
}