import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { calculateCartDiscount } from '../utils/discountUtils';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn, openAuthModal } = useAuth();
  
  // Cart items are strictly isolated per logged-in user
  const [items, setItems] = useState(() => {
    if (!user) return [];
    try {
      const userKey = `kf_cart_${user.id || user.phone || 'guest'}`;
      const saved = localStorage.getItem(userKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Sync cart when user logs in or logs out
  useEffect(() => {
    if (!user) {
      setItems([]);
      setAppliedCoupon(null);
      setCouponError('');
    } else {
      try {
        const userKey = `kf_cart_${user.id || user.phone || 'guest'}`;
        const saved = localStorage.getItem(userKey);
        setItems(saved ? JSON.parse(saved) : []);
      } catch {
        setItems([]);
      }
    }
  }, [user]);

  // Persist items for the active user
  useEffect(() => {
    if (user) {
      const userKey = `kf_cart_${user.id || user.phone || 'guest'}`;
      localStorage.setItem(userKey, JSON.stringify(items));
    }
  }, [items, user]);

  const activeItems = user ? items : [];
  const currentTotalPairs = activeItems.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);

  // If a coupon was applied and total quantity drops below 2, automatically remove coupon
  useEffect(() => {
    if (appliedCoupon && currentTotalPairs < 2) {
      setAppliedCoupon(null);
      setCouponError('Add 1 more pair to unlock the discount');
    }
  }, [currentTotalPairs, appliedCoupon]);

  // Add to cart with Indian size & color selection
  const addToCart = (product, selectedSize, selectedColor = null, quantity = 1, onAddedCallback = null) => {
    if (!isLoggedIn) {
      openAuthModal('cart', () => {
        performAddToCart(product, selectedSize, selectedColor, quantity);
        setIsCartOpen(true);
        if (onAddedCallback) onAddedCallback();
      });
      return false;
    }

    performAddToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(true);
    if (onAddedCallback) onAddedCallback();
    return true;
  };

  const performAddToCart = (product, selectedSize, selectedColor, quantity) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || 8;
    const color = selectedColor || (product.colors && product.colors[0]) || "Standard";
    const cartItemId = `${product.id}-IND${size}-${color}`;

    setItems(prev => {
      const existing = prev.find(i => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map(i =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          size,
          color,
          quantity
        }
      ];
    });
  };

  const buyNow = (product, selectedSize, selectedColor = null, onBuyNowProceed = null) => {
    if (!isLoggedIn) {
      openAuthModal('buy_now', () => {
        performAddToCart(product, selectedSize, selectedColor, 1);
        if (onBuyNowProceed) onBuyNowProceed();
      });
      return false;
    }

    performAddToCart(product, selectedSize, selectedColor, 1);
    if (onBuyNowProceed) onBuyNowProceed();
    return true;
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i))
    );
  };

  const removeFromCart = (cartItemId) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError('');
    if (user) {
      const userKey = `kf_cart_${user.id || user.phone || 'guest'}`;
      localStorage.removeItem(userKey);
    }
  };

  const applyCoupon = (code) => {
    const clean = (code || '').trim().toUpperCase();
    setCouponError('');

    if (currentTotalPairs < 2) {
      setCouponError('Add 1 more pair to unlock the discount (Coupons require 2 or more pairs)');
      return false;
    }

    if (clean === 'HERITAGE10' || clean === 'KOTHARI10') {
      setAppliedCoupon({ code: clean, discountPercent: 10, label: '10% Artisanal Savings' });
      return true;
    } else if (clean === 'FESTIVE15' || clean === 'SAVINGS15') {
      setAppliedCoupon({ code: clean, discountPercent: 15, label: '15% Multi-Pair Savings' });
      return true;
    } else if (clean === 'MEGA25' || clean === 'HERITAGE25') {
      setAppliedCoupon({ code: clean, discountPercent: 25, label: '25% Mega Order Savings' });
      return true;
    } else if (clean === 'FIRSTECO') {
      setAppliedCoupon({ code: 'FIRSTECO', discountFlat: 200, label: '₹200 Eco-Welcome Savings' });
      return true;
    } else if (clean === 'FATHER99') {
      setAppliedCoupon({ code: 'FATHER99', discountFlat: 300, label: '₹300 Legacy Customer Gift' });
      return true;
    } else {
      setCouponError('Invalid coupon. Try HERITAGE10, FESTIVE15, MEGA25 or FIRSTECO');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Central Single Source of Truth calculation
  const discountCalc = calculateCartDiscount(activeItems, appliedCoupon);

  // Suggested coupon based on purchase criteria (only suggest if >= 2 pairs)
  let suggestedCoupon = null;
  if (discountCalc.totalCount >= 3) {
    suggestedCoupon = { code: 'FESTIVE15', label: '15% Multi-Pair Discount', discountPercent: 15 };
  } else if (discountCalc.totalCount === 2) {
    suggestedCoupon = { code: 'PAIR10', label: '10% Double-Pair Savings', discountPercent: 10 };
  }

  return (
    <CartContext.Provider
      value={{
        items: activeItems,
        totalCount: discountCalc.totalCount,
        subtotal: discountCalc.subtotal,
        totalMrp: discountCalc.totalMrp,
        mrpSavings: discountCalc.mrpSavings,
        multiPairDiscountPercent: discountCalc.multiPairDiscountPercent,
        multiPairDiscount: discountCalc.multiPairDiscount,
        discountPercent: discountCalc.discountPercent,
        discountAmount: discountCalc.discountAmount,
        nextTierMessage: discountCalc.nextTierMessage,
        hintMessage: discountCalc.hintMessage,
        isEligibleForDiscount: discountCalc.isEligibleForDiscount,
        suggestedCoupon,
        couponDiscount: discountCalc.couponDiscount,
        shippingFee: discountCalc.shippingFee,
        isFreeShipping: discountCalc.isFreeShipping,
        freeShippingAway: discountCalc.freeShippingAway,
        finalTotal: discountCalc.finalTotal,
        total: discountCalc.total,
        appliedCoupon: discountCalc.validCoupon,
        couponError,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        buyNow,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

