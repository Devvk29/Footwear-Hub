import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

  // Add to cart with Indian size & color selection
  const addToCart = (product, selectedSize, selectedColor = null, quantity = 1, onAddedCallback = null) => {
    if (!isLoggedIn) {
      openAuthModal('cart', (loggedInUser) => {
        // Execute add to cart after successful login
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

  const activeItems = user ? items : [];

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    if (user) {
      const userKey = `kf_cart_${user.id || user.phone || 'guest'}`;
      localStorage.removeItem(userKey);
    }
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    setCouponError('');
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

  const totalCount = activeItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = activeItems.reduce((sum, item) => sum + ((item.product?.price || 599) * item.quantity), 0);
  const totalMrp = activeItems.reduce((sum, item) => sum + ((item.product?.originalPrice || item.product?.price || 599) * item.quantity), 0);
  const mrpSavings = Math.max(0, totalMrp - subtotal);

  // Multi-Pair Tiered Savings (Buy 2: 10% Instant OFF, Buy 3+: 15% Instant OFF)
  let multiPairDiscountPercent = 0;
  let nextTierMessage = "";
  if (totalCount >= 3) {
    multiPairDiscountPercent = 15;
    nextTierMessage = "🔥 15% Multi-Pair Discount Applied! (Buy 3+ Get 15% OFF)";
  } else if (totalCount === 2) {
    multiPairDiscountPercent = 10;
    nextTierMessage = "🎉 10% Instant Discount Applied! Add 1 more pair to unlock 15% OFF!";
  } else if (totalCount === 1) {
    multiPairDiscountPercent = 0;
    nextTierMessage = "🎁 Add 1 more pair to unlock 10% INSTANT OFF (Buy 2: 10%, Buy 3+: 15%)!";
  }

  const multiPairDiscount = Math.round((subtotal * multiPairDiscountPercent) / 100);

  // Auto-Generated Coupon based on satisfaction of purchase criteria
  let suggestedCoupon = null;
  if (totalCount >= 3) {
    suggestedCoupon = { code: 'FESTIVE15', label: '15% Multi-Pair Discount', discountPercent: 15 };
  } else if (totalCount === 2) {
    suggestedCoupon = { code: 'PAIR10', label: '10% Double-Pair Savings', discountPercent: 10 };
  } else if (totalCount === 1) {
    suggestedCoupon = { code: 'WELCOME10', label: '10% Welcome Discount', discountPercent: 10 };
  }

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.round(((subtotal - multiPairDiscount) * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountFlat) {
      couponDiscount = Math.min(subtotal - multiPairDiscount, appliedCoupon.discountFlat);
    }
  }

  const FREE_SHIPPING_THRESHOLD = 999;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 99;
  const freeShippingAway = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const finalTotal = Math.max(0, subtotal - multiPairDiscount - couponDiscount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        items: activeItems,
        totalCount,
        subtotal,
        totalMrp,
        mrpSavings,
        multiPairDiscountPercent,
        multiPairDiscount,
        nextTierMessage,
        suggestedCoupon,
        couponDiscount,
        shippingFee,
        isFreeShipping,
        freeShippingAway,
        finalTotal,
        appliedCoupon,
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
