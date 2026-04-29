// config/promocodes.ts
// Чтобы добавить новый промокод, просто добавь сюда запись
export const promoCodes: Record<string, { discountPercent: number }> = {
  "SUSHIMATE10": { discountPercent: 10 },
  "SALE15":      { discountPercent: 15 },
  "WELCOME20":   { discountPercent: 20 },
  "SPECIAL20":   { discountPercent: 20 },
};