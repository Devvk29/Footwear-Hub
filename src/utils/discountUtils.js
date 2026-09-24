/**
 * Single-source-of-truth calculation helper for Kothari Footwear cart & order discounts.
 * Rules:
 * - Multi-pair discount & coupons apply ONLY when total pairs (quantity sum) >= 2.
 * - qty < 2: 0% discount, no coupon accepted.
 * - qty == 2: 10% discount.
 * - qty >= 3: 15% discount.
 */

export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 99;

export function calculateCartDiscount(items = [], appliedCoupon = null) {
  const safeItems = Array.isArray(items) ? items : [];

  // Total quantity of pairs (sum of item quantities)
  const totalCount = safeItems.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);

  // Subtotal (before discounts)
  const subtotal = safeItems.reduce((sum, item) => {
    const price = Number(item?.product?.price ?? item?.price ?? 599);
    const qty = Number(item?.quantity) || 1;
    return sum + (price * qty);
  }, 0);

  const totalMrp = safeItems.reduce((sum, item) => {
    const origPrice = Number(item?.product?.originalPrice ?? item?.originalPrice ?? item?.product?.price ?? item?.price ?? 599);
    const qty = Number(item?.quantity) || 1;
    return sum + (origPrice * qty);
  }, 0);

  const mrpSavings = Math.max(0, totalMrp - subtotal);

  // Multi-Pair Tiered Savings
  let discountPercent = 0;
  let nextTierMessage = '';
  let hintMessage = '';
  const isEligibleForDiscount = totalCount >= 2;

  if (totalCount >= 3) {
    discountPercent = 15;
    nextTierMessage = '🔥 15% Multi-Pair Discount Applied! (Buy 3+ Get 15% OFF)';
  } else if (totalCount === 2) {
    discountPercent = 10;
    nextTierMessage = '🎉 10% Instant Discount Applied! Add 1 more pair to unlock 15% OFF!';
  } else if (totalCount === 1) {
    discountPercent = 0;
    hintMessage = 'Add 1 more pair to get 10% OFF';
    nextTierMessage = '🎁 Add 1 more pair to get 10% OFF (Buy 2: 10%, Buy 3+: 15%)!';
  } else {
    discountPercent = 0;
    nextTierMessage = '🎁 Add 2+ pairs to unlock 10% - 15% Instant Multi-Pair OFF!';
  }

  // Calculate multi-pair discount amount
  const discountAmount = isEligibleForDiscount
    ? Math.round((subtotal * discountPercent) / 100)
    : 0;

  // Coupon logic: ONLY valid if totalCount >= 2
  let couponDiscountAmount = 0;
  let validCoupon = null;

  if (isEligibleForDiscount && appliedCoupon) {
    validCoupon = appliedCoupon;
    if (appliedCoupon.discountPercent) {
      couponDiscountAmount = Math.round(((subtotal - discountAmount) * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountFlat) {
      couponDiscountAmount = Math.min(subtotal - discountAmount, appliedCoupon.discountFlat);
    }
  }

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingAway = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Total payable amount
  const total = Math.max(0, subtotal - discountAmount - couponDiscountAmount + shippingFee);

  return {
    totalCount,
    totalPairs: totalCount,
    subtotal,
    totalMrp,
    mrpSavings,
    discountPercent,
    discountAmount,
    multiPairDiscountPercent: discountPercent,
    multiPairDiscount: discountAmount,
    couponDiscount: couponDiscountAmount,
    couponDiscountAmount,
    validCoupon,
    isEligibleForDiscount,
    hintMessage,
    nextTierMessage,
    shippingFee,
    isFreeShipping,
    freeShippingAway,
    total,
    finalTotal: total
  };
}
