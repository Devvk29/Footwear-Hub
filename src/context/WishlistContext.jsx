import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, isLoggedIn, openAuthModal } = useAuth();

  // Purge any old global wishlist key that leaks into guest/other users
  useEffect(() => {
    try {
      localStorage.removeItem('kf_wishlist');
    } catch (e) {
      // safe ignore
    }
  }, []);

  // Wishlist strictly belongs to the signed-in user only
  const [wishlistIds, setWishlistIds] = useState(() => {
    if (!user) return [];
    try {
      const userKey = `kf_wishlist_${user.id || user.phone}`;
      const saved = localStorage.getItem(userKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // When user logs in, load ONLY that user's wishlist; on logout, clear wishlist immediately
  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
    } else {
      try {
        const userKey = `kf_wishlist_${user.id || user.phone}`;
        const saved = localStorage.getItem(userKey);
        setWishlistIds(saved ? JSON.parse(saved) : []);
      } catch {
        setWishlistIds([]);
      }
    }
  }, [user]);

  // Persist wishlist items scoped strictly to the current user
  useEffect(() => {
    if (user) {
      try {
        const userKey = `kf_wishlist_${user.id || user.phone}`;
        localStorage.setItem(userKey, JSON.stringify(wishlistIds));
      } catch (e) {
        // safe ignore
      }
    }
  }, [wishlistIds, user]);

  const toggleWishlist = (productId) => {
    if (!isLoggedIn || !user) {
      // Must open login flow instead of saving for guest
      openAuthModal('wishlist', (loggedInUser) => {
        if (loggedInUser) {
          const userKey = `kf_wishlist_${loggedInUser.id || loggedInUser.phone}`;
          let existing = [];
          try {
            const saved = localStorage.getItem(userKey);
            existing = saved ? JSON.parse(saved) : [];
          } catch {
            existing = [];
          }
          const updated = existing.includes(productId)
            ? existing.filter(id => id !== productId)
            : [...existing, productId];
          setWishlistIds(updated);
          try {
            localStorage.setItem(userKey, JSON.stringify(updated));
          } catch (e) {}
        }
      });
      return;
    }
    performToggle(productId);
  };

  const performToggle = (productId) => {
    setWishlistIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId) => {
    if (!isLoggedIn || !user) return false;
    return wishlistIds.includes(productId);
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    if (user) {
      try {
        const userKey = `kf_wishlist_${user.id || user.phone}`;
        localStorage.removeItem(userKey);
      } catch (e) {}
    }
  };

  const count = (isLoggedIn && user) ? wishlistIds.length : 0;

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds: (isLoggedIn && user) ? wishlistIds : [],
        toggleWishlist,
        isWishlisted,
        wishlistCount: count,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
