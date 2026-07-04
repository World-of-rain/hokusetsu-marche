export async function fetchSaleData() {
  const apiUrl = process.env.API_URL || "http://localhost:8000/api/prices/shonai";
  try {
    const res = await fetch(apiUrl, {
      cache: "no-store", 
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    const now = new Date();
    const lastUpdated = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return { ...data, lastUpdated };
  } catch (error) {
    console.error("Failed to fetch sale data:", error);
    return null;
  }
}
