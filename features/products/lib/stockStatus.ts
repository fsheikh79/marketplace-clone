const LOW_STOCK_THRESHOLD = 5;

export type StockLevel = "out" | "low" | "in";

export function getStockLevel(stock: number): StockLevel {
  if (stock <= 0) return "out";
  if (stock < LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export function getStockLabel(stock: number): string {
  const level = getStockLevel(stock);
  if (level === "out") return "Out of stock";
  if (level === "low") return `Only ${stock} left in stock`;
  return "In stock";
}

export function getStockColorClass(stock: number): string {
  const level = getStockLevel(stock);
  if (level === "out") return "text-zinc-400";
  if (level === "low") return "text-red-600";
  return "text-secondary-600";
}
