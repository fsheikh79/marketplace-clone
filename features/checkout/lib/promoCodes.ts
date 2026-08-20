export interface PromoResult {
  code: string;
  label: string;
  percentOff?: number;
  freeShipping?: boolean;
}

// MOCK: hardcoded promo codes. Replace with a real promotions API in
// Phase 2.
const PROMO_CODES: Record<string, PromoResult> = {
  SAVE10: { code: "SAVE10", label: "10% off", percentOff: 10 },
  FREESHIP: { code: "FREESHIP", label: "Free shipping", freeShipping: true },
};

export function resolvePromoCode(input: string): PromoResult | undefined {
  return PROMO_CODES[input.trim().toUpperCase()];
}
