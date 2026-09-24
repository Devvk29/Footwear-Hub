import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

// Stable localStorage cache key — always keyed by phone (never by session-id)
const localKey = (phone) => `kf_wishlist_${phone}`;

// Write an array of product IDs to Firestore (non-blocking)
const syncToFirestore = async (phone, ids) => {
  if (!phone) return;
  try {
    await setDoc(
      doc(db, 'wishlists', phone),
      { productIds: ids, updatedAt: Date.now() },
      { merge: true }
    );
  } catch (e) {
    // Non-critical: localStorage cache still preserves it locally
    console.warn('Wishlist Firestore sync note:', e);
  }
};

export const WishlistProvider = ({ children }) => {
  const { user, isLoggedIn, openAuthModal } = useAuth();

  // Stable phone from the signed-in user (never changes across sessions for the same account)
  const userPhone = user?.phone || null;

  const [wishlistIds, setWishlistIds] = useState([]);
  // True while we are loading from Firestore — suppress writes during this window
  const [loading, setLoading] = useState(false);
  // Ref to skip the first save-to-Firestore triggered by the load itself
  const isInitialLoad = useRef(true);

  // --- Purge legacy global key (one-time cleanup) ---
  useEffect(() => {
    try { localStorage.removeItem('kf_wishlist'); } catch (_) {}
  }, []);

  // --- On user change: load wishlist from Firestore ---
  useEffect(() => {
    if (!userPhone) {
      // Guest or logged-out: clear in-memory list; do NOT touch localStorage cache
      setWishlistIds([]);
      setLoading(false);
      return;
    }

    // Start loading: read localStorage cache first (fast/optimistic), then Firestore
    setLoading(true);
    isInitialLoad.current = true;

    // 1. Warm from localStorage cache immediately so UI renders instantly
    let cached = [];
    try {
      const raw = localStorage.getItem(localKey(userPhone));
      cached = raw ? JSON.parse(raw) : [];
    } catch (_) { cached = []; }
    setWishlistIds(cached);

    // 2. Fetch from Firestore (authoritative) and merge
    getDoc(doc(db, 'wishlists', userPhone))
      .then((snap) => {
        if (snap.exists()) {
          const cloudIds = snap.data().productIds || [];
          // Union of local cache and cloud — handles offline edits from another device
          const merged = Array.from(new Set([...cached, ...cloudIds]));
          setWishlistIds(merged);
          try { localStorage.setItem(localKey(userPhone), JSON.stringify(merged)); } catch (_) {}
        } else if (cached.length > 0) {
          // No cloud record yet — seed Firestore with the local cache
          syncToFirestore(userPhone, cached);
        }
      })
      .catch((e) => {
        // Network error — local cache is the fallback; stay with it silently
        console.warn('Wishlist Firestore load note:', e);
      })
      .finally(() => {
        setLoading(false);
        // Writes are now safe
        isInitialLoad.current = false;
      });
  }, [userPhone]);

  // --- Persist to Firestore + localStorage on every change (skip during initial load) ---
  useEffect(() => {
    if (loading || isInitialLoad.current || !userPhone) return;
    try { localStorage.setItem(localKey(userPhone), JSON.stringify(wishlistIds)); } catch (_) {}
    syncToFirestore(userPhone, wishlistIds);
  }, [wishlistIds, userPhone, loading]);

  // --- Toggle (requires login) ---
  const performToggle = (productId) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleWishlist = (productId) => {
    if (!isLoggedIn || !user) {
      openAuthModal('wishlist', (loggedInUser) => {
        if (loggedInUser) {
          // Defer by 300 ms so the login-triggered useEffect above has time to hydrate
          setTimeout(() => performToggle(productId), 300);
        }
      });
      return;
    }
    performToggle(productId);
  };

  const isWishlisted = (productId) => {
    if (!isLoggedIn || !user) return false;
    return wishlistIds.includes(productId);
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    if (userPhone) {
      try { localStorage.removeItem(localKey(userPhone)); } catch (_) {}
      syncToFirestore(userPhone, []);
    }
  };

  const count = (isLoggedIn && user) ? wishlistIds.length : 0;

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds: (isLoggedIn && user) ? wishlistIds : [],
        wishlistLoading: loading,
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

