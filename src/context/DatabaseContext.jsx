// Save this file as: src/context/DatabaseContext.jsx  (replace the old one)
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  increment
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { db, auth } from '../firebase';
import { INITIAL_PRODUCTS, createDefaultStockForSizes } from '../data/products';
import { calculateCartDiscount } from '../utils/discountUtils';
import { normalizeProduct, normalizeProducts, getAssetUrl } from '../utils/assetUrl';

const DatabaseContext = createContext();

// The Google account of the store owner (set in .env as VITE_OWNER_EMAIL)
const OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL || '').toLowerCase();

// Firestore does not accept "undefined" values, so strip them out
const clean = (obj) => JSON.parse(JSON.stringify(obj));

const readLocal = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const INITIAL_CUSTOMERS = [
  {
    id: "usr-01",
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@example.in",
    securityPin: "1234",
    city: "Ahmedabad, Gujarat",
    addresses: [
      {
        id: "addr-01",
        fullName: "Rahul Sharma",
        phone: "9876543210",
        street: "B-402, Satellite Road",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
        isDefault: true
      }
    ],
    signupDate: "12 Sep 2026",
    ordersCount: 2,
    loginCount: 5,
    lastLogin: "Today, 10:30 AM",
    lastLoginTimestamp: Date.now() - 3600000,
    lastDevice: "Mobile Device",
    role: "Customer"
  },
  {
    id: "usr-02",
    name: "Priya Verma",
    phone: "9123456780",
    email: "priya.verma@example.in",
    securityPin: "4321",
    city: "Surat, Gujarat",
    addresses: [
      {
        id: "addr-02",
        fullName: "Priya Verma",
        phone: "9123456780",
        street: "701, Ring Road Complex",
        city: "Surat",
        state: "Gujarat",
        pincode: "395002",
        isDefault: true
      }
    ],
    signupDate: "18 Sep 2026",
    ordersCount: 1,
    loginCount: 3,
    lastLogin: "Yesterday, 04:15 PM",
    lastLoginTimestamp: Date.now() - 86400000,
    lastDevice: "Mobile Device",
    role: "Customer"
  },
  {
    id: "usr-03",
    name: "Vikram Malhotra",
    phone: "9820112233",
    email: "vikram.malhotra@example.in",
    securityPin: "9988",
    city: "Mumbai, Maharashtra",
    addresses: [
      {
        id: "addr-03",
        fullName: "Vikram Malhotra",
        phone: "9820112233",
        street: "Flat 12B, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        isDefault: true
      }
    ],
    signupDate: "14 Sep 2026",
    ordersCount: 2,
    loginCount: 4,
    lastLogin: "20 Sep 2026, 02:40 PM",
    lastLoginTimestamp: Date.now() - 172800000,
    lastDevice: "Desktop / Laptop",
    role: "Customer"
  },
  {
    id: "usr-04",
    name: "Ananya Sharma",
    phone: "9814055667",
    email: "ananya.sharma@example.in",
    securityPin: "2026",
    city: "Jaipur, Rajasthan",
    addresses: [
      {
        id: "addr-04",
        fullName: "Ananya Sharma",
        phone: "9814055667",
        street: "24, Malviya Nagar",
        city: "Jaipur",
        state: "Rajasthan",
        pincode: "302017",
        isDefault: true
      }
    ],
    signupDate: "02 Sep 2026",
    ordersCount: 1,
    loginCount: 2,
    lastLogin: "19 Sep 2026, 11:20 AM",
    lastLoginTimestamp: Date.now() - 259200000,
    lastDevice: "Mobile Device",
    role: "Customer"
  },
  {
    id: "usr-05",
    name: "Siddharth Patil",
    phone: "9890123456",
    email: "siddharth.patil@example.in",
    securityPin: "1122",
    city: "Pune, Maharashtra",
    addresses: [
      {
        id: "addr-05",
        fullName: "Siddharth Patil",
        phone: "9890123456",
        street: "18, Deccan Gymkhana",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411004",
        isDefault: true
      }
    ],
    signupDate: "28 Aug 2026",
    ordersCount: 3,
    loginCount: 6,
    lastLogin: "Today, 09:10 AM",
    lastLoginTimestamp: Date.now() - 7200000,
    lastDevice: "Desktop / Laptop",
    role: "Customer"
  },
  {
    id: "usr-06",
    name: "Dr. Meenakshi Sundaram",
    phone: "9845012345",
    email: "dr.meenakshi@example.in",
    securityPin: "7788",
    city: "Bengaluru, Karnataka",
    addresses: [
      {
        id: "addr-06",
        fullName: "Dr. Meenakshi Sundaram",
        phone: "9845012345",
        street: "105, Indiranagar 100ft Rd",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
        isDefault: true
      }
    ],
    signupDate: "19 Aug 2026",
    ordersCount: 2,
    loginCount: 3,
    lastLogin: "21 Sep 2026, 08:30 PM",
    lastLoginTimestamp: Date.now() - 120000000,
    lastDevice: "Mobile Device",
    role: "Customer"
  },
  {
    id: "usr-07",
    name: "Arjun Nambiar",
    phone: "9447012345",
    email: "arjun.nambiar@example.in",
    securityPin: "3344",
    city: "Kochi, Kerala",
    addresses: [
      {
        id: "addr-07",
        fullName: "Arjun Nambiar",
        phone: "9447012345",
        street: "Marine Drive Promenade",
        city: "Kochi",
        state: "Kerala",
        pincode: "682031",
        isDefault: true
      }
    ],
    signupDate: "10 Aug 2026",
    ordersCount: 1,
    loginCount: 2,
    lastLogin: "15 Sep 2026, 01:15 PM",
    lastLoginTimestamp: Date.now() - 600000000,
    lastDevice: "Mobile Device",
    role: "Customer"
  },
  {
    id: "owner-01",
    name: "Manak Kothari",
    phone: "9427644222",
    email: "manakkothari132@gmail.com",
    securityPin: "2580",
    city: "Idar, Gujarat",
    addresses: [
      {
        id: "addr-owner",
        fullName: "Shri Manak Kothari",
        phone: "9427644222",
        street: "134, Near Tiranga Circle",
        city: "Idar",
        state: "Gujarat",
        pincode: "383430",
        isDefault: true
      }
    ],
    signupDate: "01 Jan 1998",
    ordersCount: 0,
    loginCount: 15,
    lastLogin: "Active Now",
    lastLoginTimestamp: Date.now(),
    lastDevice: "Desktop / Laptop",
    role: "Owner / Master Shoemaker"
  }
];

export const DatabaseProvider = ({ children }) => {
  // ---------- State ----------
  // Products live in Firestore. Until they load, show the default catalog.
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Owner (signed in with Google) can see ALL orders from Firestore.
  const [ownerUser, setOwnerUser] = useState(null);
  const [cloudOrders, setCloudOrders] = useState([]);

  // Every customer keeps a copy of their own orders on their own device.
  const [myOrders, setMyOrders] = useState(() => readLocal('kf_db_orders', []));

  // Customer accounts stay on the device for now (same as before).
  const [customers, setCustomers] = useState(() =>
    readLocal('kf_db_customers', INITIAL_CUSTOMERS)
  );

  const ownerSignedIn = !!ownerUser;

  // ---------- Owner sign-in (Google) ----------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const isOwner =
        user && user.email && user.email.toLowerCase() === OWNER_EMAIL;
      setOwnerUser(isOwner ? user : null);
    });
    return unsub;
  }, []);

  const signInOwner = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      if ((result.user.email || '').toLowerCase() !== OWNER_EMAIL) {
        await signOut(auth);
        alert('This Google account is not the store owner account.');
      }
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        console.error('Google sign-in failed:', err);
        alert('Google sign-in failed: ' + (err?.code || err?.message || 'unknown error'));
      }
    }
  };

  const signOutOwner = () => signOut(auth);

  // ---------- Live products from Firestore (with Initial Catalog Fallback & Real-time Multi-Device Sync) ----------
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        if (!snap.empty && snap.docs.length > 0) {
          const cloudMap = new Map();
          snap.docs.forEach((d) => {
            const data = d.data();
            const id = String(data.id ?? d.id);
            cloudMap.set(id, normalizeProduct({ ...data, id }));
          });

          const unifiedMap = new Map();
          // 1. Merge INITIAL_PRODUCTS with any cloud updates
          INITIAL_PRODUCTS.forEach((base) => {
            const cloud = cloudMap.get(String(base.id));
            if (cloud) {
              const customGallery = (cloud.gallery && cloud.gallery.length > 0)
                ? cloud.gallery
                : (cloud.image ? [cloud.image] : null);

              const merged = normalizeProduct({
                ...base,
                ...cloud,
                image: cloud.image || base.image,
                gallery: customGallery || base.gallery || [base.image],
                colorImages: { ...(base.colorImages || {}), ...(cloud.colorImages || {}) },
                id: base.id
              });
              unifiedMap.set(String(base.id), merged);
            } else {
              unifiedMap.set(String(base.id), normalizeProduct({ ...base }));
            }
          });

          // 2. Append any newly added custom products from the cloud that aren't in INITIAL_PRODUCTS
          cloudMap.forEach((cloud, id) => {
            if (!unifiedMap.has(String(id))) {
              unifiedMap.set(String(id), normalizeProduct(cloud));
            }
          });

          const list = Array.from(unifiedMap.values()).map(normalizeProduct);
          list.sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));
          setProducts(list);
        } else {
          setProducts(normalizeProducts(INITIAL_PRODUCTS));
        }
        setProductsLoaded(true);
      },
      (err) => {
        console.warn('Could not load products from Firestore, using initial catalog:', err);
        setProducts(normalizeProducts(INITIAL_PRODUCTS));
      }
    );
    return unsub;
  }, []);

  // ---------- Live orders (cloud synced for store owner & customer personal invoices) ----------
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty && snap.docs.length > 0) {
          const list = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
          setCloudOrders(list);
        } else {
          setCloudOrders([]);
        }
      },
      (err) => {
        console.warn('Orders cloud subscription note:', err?.message || err);
      }
    );
    return unsub;
  }, []);

  // ---------- Live customers from Firestore & Bidirectional Multi-Device Sync ----------
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'customers'),
      (snap) => {
        if (!snap.empty && snap.docs.length > 0) {
          const cloudCusts = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
          setCustomers((prev) => {
            const map = new Map();
            const getCustKey = (c) => {
              const raw = c.phone ? String(c.phone).replace(/\D/g, '') : '';
              return (raw.length >= 10 ? raw.slice(-10) : raw) || c.id;
            };

            INITIAL_CUSTOMERS.forEach((c) => map.set(getCustKey(c), c));
            prev.forEach((c) => map.set(getCustKey(c), c));
            cloudCusts.forEach((c) => {
              const key = getCustKey(c);
              const existing = map.get(key) || {};
              map.set(key, { ...existing, ...c });
            });
            return Array.from(map.values());
          });
        } else {
          // If Firestore customers collection is empty on a fresh setup, seed it with INITIAL_CUSTOMERS
          INITIAL_CUSTOMERS.forEach((c) => {
            const raw = c.phone ? String(c.phone).replace(/\D/g, '') : '';
            const key = (raw.length >= 10 ? raw.slice(-10) : raw) || c.id;
            setDoc(doc(db, 'customers', String(key)), clean(c), { merge: true }).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Could not sync customers from Firestore:', err);
      }
    );
    return unsub;
  }, []);

  // Sync any local customers (e.g. from laptop localStorage or initial catalog) to Firestore
  useEffect(() => {
    if (customers && customers.length > 0) {
      customers.forEach((c) => {
        const key = c.phone || c.id;
        if (key) {
          setDoc(doc(db, 'customers', String(key)), clean(c), { merge: true }).catch(() => {});
        }
      });
    }
  }, []); // Run on initial load to seed any missing customers to Firestore

  // Extract & unify customers from cloud orders so every buyer is in the customers database
  useEffect(() => {
    if (cloudOrders && cloudOrders.length > 0) {
      setCustomers((prev) => {
        let hasChanges = false;
        const map = new Map();
        INITIAL_CUSTOMERS.forEach((c) => map.set(c.phone || c.id, c));
        prev.forEach((c) => map.set(c.phone || c.id, c));

        cloudOrders.forEach((ord) => {
          const rawPhone = (ord.customerPhone || ord.customer?.phone || ord.shippingAddress?.phone || '').replace(/\D/g, '');
          const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : rawPhone;
          const key = cleanPhone || ord.customer?.id || ord.id;
          if (!key) return;

          const existing = map.get(key);
          const fullName = ord.shippingAddress?.fullName || ord.customer?.name || (cleanPhone ? `Customer +91 ${cleanPhone}` : 'Customer');
          const email = ord.customerEmail || ord.customer?.email || ord.shippingAddress?.email || '';
          const city = ord.shippingAddress?.city
            ? `${ord.shippingAddress.city}, ${ord.shippingAddress.state || 'Gujarat'}`
            : (ord.customer?.city || 'Gujarat, India');

          if (!existing) {
            hasChanges = true;
            const newCust = {
              id: `usr-${key}`,
              name: fullName,
              phone: cleanPhone,
              email: email,
              securityPin: ord.customer?.securityPin || '1234',
              city: city,
              addresses: ord.shippingAddress ? [ord.shippingAddress] : [],
              signupDate: ord.date ? ord.date.split(',')[0] : 'Sep 2026',
              ordersCount: 1,
              loginCount: 1,
              lastLogin: ord.date || 'Recent Order Placed',
              lastLoginTimestamp: ord.createdAt || Date.now(),
              lastDevice: 'Order Placed',
              role: 'Customer'
            };
            map.set(key, newCust);
            setDoc(doc(db, 'customers', String(key)), clean(newCust), { merge: true }).catch(() => {});
          } else {
            // Update order count and details if needed
            let updated = false;
            const updatedCust = { ...existing };
            if (!updatedCust.phone && cleanPhone) { updatedCust.phone = cleanPhone; updated = true; }
            if (!updatedCust.email && email) { updatedCust.email = email; updated = true; }
            if (!updatedCust.addresses || updatedCust.addresses.length === 0) {
              if (ord.shippingAddress) { updatedCust.addresses = [ord.shippingAddress]; updated = true; }
            }
            if (updated) {
              hasChanges = true;
              map.set(key, updatedCust);
              setDoc(doc(db, 'customers', String(key)), clean(updatedCust), { merge: true }).catch(() => {});
            }
          }
        });

        return hasChanges ? Array.from(map.values()) : prev;
      });
    }
  }, [cloudOrders]);

  // ---------- Save device-only data ----------
  useEffect(() => {
    localStorage.setItem('kf_db_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('kf_db_orders', JSON.stringify(myOrders));
  }, [myOrders]);

  // ---------- Helper for owner-only cloud writes ----------
  const safeWrite = async (action) => {
    try {
      await action();
      return true;
    } catch (err) {
      console.warn('Cloud save status:', err?.message || err);
      // Only show alert to the owner during admin portal actions
      if (ownerSignedIn) {
        alert(
          err?.code === 'permission-denied'
            ? 'Owner permission note: Please check Google sign-in credentials.'
            : 'Cloud sync issue: Saved locally on this browser.'
        );
      }
      return false;
    }
  };

  // ---------- Product functions (owner) ----------
  const addProduct = async (newProduct) => {
    const id = newProduct.id || `item-${Date.now()}`;
    const topIndex = products.length
      ? Math.min(...products.map((p) => p.sortIndex ?? 0)) - 1
      : 0;
    const item = normalizeProduct({
      ...newProduct,
      id: String(id),
      rating: newProduct.rating || 4.9,
      reviewCount: newProduct.reviewCount || 1,
      inStock: newProduct.inStock ?? true,
      gallery: (newProduct.gallery && newProduct.gallery.length > 0) ? newProduct.gallery : [newProduct.image],
      sortIndex: topIndex,
      createdAt: Date.now()
    });
    setProducts((prev) => [item, ...prev]);
    try {
      await setDoc(doc(db, 'products', String(id)), clean(item), { merge: true });
    } catch (err) {
      console.warn('Add product cloud sync note:', err?.message || err);
    }
    return item;
  };

  const updateProduct = async (id, updatedFields) => {
    const existing = products.find((p) => p.id === id) || {};
    const merged = normalizeProduct({
      ...existing,
      ...updatedFields,
      id: String(id),
      updatedAt: Date.now()
    });

    // Immediately update local state on the current device
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? merged : p))
    );

    // Save directly to Firestore with merge:true so all other devices receive the live update instantly
    try {
      await setDoc(doc(db, 'products', String(id)), clean(merged), { merge: true });
    } catch (err) {
      console.warn('Cloud update product sync note:', err?.message || err);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', String(id)));
    } catch (err) {
      console.warn('Delete product sync note:', err?.message || err);
    }
  };

  const toggleProductStock = async (id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const newStockState = !p.inStock;
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: newStockState } : item))
    );
    try {
      await setDoc(doc(db, 'products', String(id)), { inStock: newStockState }, { merge: true });
    } catch (err) {
      console.warn('Toggle stock cloud note:', err?.message || err);
    }
  };

  // Update stock for a specific size (stepper +1/-1 or direct count)
  const updateStockPerSize = (productId, size, value, isAbsolute = false) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const currentStockObj = prod.stockPerSize ? { ...prod.stockPerSize } : createDefaultStockForSizes(prod.sizes || [7, 8, 9, 10]);
    const currentQty = Number(currentStockObj[size] ?? 8);
    const newQty = isAbsolute ? Math.max(0, Number(value)) : Math.max(0, currentQty + Number(value));
    currentStockObj[size] = newQty;

    const totalStock = Object.values(currentStockObj).reduce((sum, q) => sum + Number(q), 0);
    const inStock = totalStock > 0;

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockPerSize: currentStockObj, inStock } : p))
    );

    if (ownerSignedIn) {
      safeWrite(() =>
        updateDoc(doc(db, 'products', String(productId)), {
          stockPerSize: currentStockObj,
          inStock
        })
      );
    }
  };

  // 1-Click Advance Restock Batch Adder (e.g. +5, +10, +25, +50 to all sizes or specific size)
  const batchAdvanceRestock = (productId, addQty, specificSize = null, arrivalNote = '') => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const currentStockObj = prod.stockPerSize ? { ...prod.stockPerSize } : createDefaultStockForSizes(prod.sizes || [7, 8, 9, 10]);
    const sizesToUpdate = specificSize !== null ? [Number(specificSize)] : (prod.sizes || Object.keys(currentStockObj).map(Number));

    sizesToUpdate.forEach((s) => {
      const cur = Number(currentStockObj[s] ?? 8);
      currentStockObj[s] = Math.max(0, cur + Number(addQty));
    });

    const totalStock = Object.values(currentStockObj).reduce((sum, q) => sum + Number(q), 0);
    const inStock = totalStock > 0;
    
    const updatePayload = {
      stockPerSize: currentStockObj,
      inStock,
      lastRestockDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    if (arrivalNote) {
      updatePayload.advanceStockNote = arrivalNote;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatePayload } : p))
    );

    safeWrite(() => updateDoc(doc(db, 'products', String(productId)), clean(updatePayload)));
  };

  // Schedule an advance incoming shipment batch for advance stock notice
  const scheduleAdvanceRestock = (productId, incomingQty, arrivalDate, status = 'Incoming Batch Confirmed') => {
    const advanceInfo = {
      incomingQty: Number(incomingQty),
      arrivalDate,
      status,
      scheduledAt: Date.now()
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, advanceRestock: advanceInfo } : p))
    );

    safeWrite(() =>
      updateDoc(doc(db, 'products', String(productId)), {
        advanceRestock: clean(advanceInfo)
      })
    );
  };

  // Loads the default catalog into the cloud (use once to fill an empty database)
  const resetToDefaultCatalog = async () => {
    await safeWrite(async () => {
      const batch = writeBatch(db);
      products.forEach((p) => batch.delete(doc(db, 'products', String(p.id))));
      INITIAL_PRODUCTS.forEach((p, i) =>
        batch.set(
          doc(db, 'products', String(p.id)),
          clean({ ...p, sortIndex: i })
        )
      );
      await batch.commit();
    });
  };

  // ---------- Record User Sign-In Activity & Device (Multi-Device Live Sync) ----------
  const recordUserSignInActivity = async (userData) => {
    if (!userData) return;
    const rawDigits = userData.phone ? String(userData.phone).replace(/\D/g, '') : '';
    const phone = rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'Mobile Device' : 'Desktop / Laptop';
    const nowStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isOwner = userData.isOwner || phone === '9427644222' || (userData.id && String(userData.id).includes('owner'));
    const roleName = isOwner ? 'Owner / Master Shoemaker' : (userData.role || 'Customer');
    const docKey = phone || (isOwner ? '9427644222' : userData.id) || 'usr-guest';

    // 1. Update local state immediately
    setCustomers((prev) => {
      let matched = false;
      const updated = prev.map((c) => {
        const cDigits = c.phone ? String(c.phone).replace(/\D/g, '') : '';
        const cPhone = cDigits.length >= 10 ? cDigits.slice(-10) : cDigits;
        if (
          (phone && cPhone === phone) ||
          (userData.id && c.id === userData.id) ||
          (isOwner && (c.id === 'owner-01' || c.id === 'owner-manak-kothari' || cPhone === '9427644222'))
        ) {
          matched = true;
          return {
            ...c,
            name: userData.name || c.name,
            email: userData.email || c.email,
            lastLogin: nowStr,
            lastLoginTimestamp: Date.now(),
            loginCount: (c.loginCount || 0) + 1,
            lastDevice: deviceType,
            role: roleName
          };
        }
        return c;
      });

      if (!matched) {
        updated.unshift({
          id: userData.id || (isOwner ? 'owner-01' : `usr-${phone || Date.now()}`),
          name: userData.name || (isOwner ? 'Shri Manak Kothari' : 'Valued Customer'),
          phone: phone || (isOwner ? '9427644222' : ''),
          email: userData.email || (isOwner ? 'manakkothari132@gmail.com' : ''),
          securityPin: userData.securityPin || (isOwner ? '2580' : '1234'),
          city: userData.city || (isOwner ? 'Idar, Gujarat' : 'Gujarat, India'),
          addresses: userData.addresses || [],
          signupDate: nowStr.split(',')[0],
          ordersCount: 0,
          loginCount: 1,
          lastLogin: nowStr,
          lastLoginTimestamp: Date.now(),
          lastDevice: deviceType,
          role: roleName
        });
      }
      return updated;
    });

    // 2. Push immediately to Firestore so other devices (laptop/mobile) see the login in real time
    try {
      const syncPayload = {
        name: userData.name || (isOwner ? 'Shri Manak Kothari' : 'Valued Customer'),
        phone: phone || (isOwner ? '9427644222' : ''),
        email: userData.email || (isOwner ? 'manakkothari132@gmail.com' : ''),
        role: roleName,
        city: userData.city || (isOwner ? 'Idar, Gujarat' : 'Gujarat, India'),
        lastLogin: nowStr,
        lastLoginTimestamp: Date.now(),
        loginCount: increment(1),
        lastDevice: deviceType,
        isOwner: !!isOwner
      };
      if (userData.securityPin) {
        syncPayload.securityPin = userData.securityPin;
      }
      await setDoc(doc(db, 'customers', String(docKey)), clean(syncPayload), { merge: true });
    } catch (err) {
      console.warn('Record sign in activity sync note:', err);
    }
  };

  // ---------- Customer accounts (Saved to Firestore & Local Storage) ----------
  const registerCustomer = async (userData) => {
    const custId = userData.id || `usr-${Date.now()}`;
    const rawDigits = userData.phone ? String(userData.phone).replace(/\D/g, '') : '';
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'Mobile Device' : 'Desktop / Laptop';

    const newCustomer = {
      id: custId,
      name: userData.name || '',
      phone: rawDigits,
      email: userData.email || '',
      securityPin: userData.securityPin || '',
      city: userData.city || "Gujarat, India",
      addresses: userData.addresses || [
        {
          id: `addr-${Date.now()}`,
          fullName: userData.name || '',
          phone: rawDigits,
          street: 'Main Road',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001',
          isDefault: true
        }
      ],
      signupDate: userData.signupDate || new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      signupTimestamp: Date.now(),
      ordersCount: userData.ordersCount || 0,
      loginCount: userData.loginCount || 0,
      lastLogin: 'Never (Newly Registered)',
      lastLoginTimestamp: null,
      lastDevice: deviceType,
      role: userData.role || "Customer"
    };

    setCustomers((prev) => {
      const filtered = prev.filter(
        (c) => c.phone !== newCustomer.phone && c.id !== newCustomer.id
      );
      return [newCustomer, ...filtered];
    });

    // Save directly to Firestore customers collection (using phone as primary doc id for reliable uniqueness)
    const docKey = newCustomer.phone || custId;
    try {
      await setDoc(doc(db, 'customers', String(docKey)), clean(newCustomer), { merge: true });
    } catch (err) {
      console.warn('Firestore customer registration sync note:', err?.message || err);
    }

    return newCustomer;
  };

  // Update Customer Information (Admin access)
  const updateCustomerInfo = async (customerIdOrPhone, updatedFields) => {
    const cleanFields = clean(updatedFields);
    let targetPhone = '';

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerIdOrPhone || c.phone === customerIdOrPhone) {
          targetPhone = c.phone;
          return { ...c, ...cleanFields };
        }
        return c;
      })
    );

    const docKey = targetPhone || customerIdOrPhone;
    if (docKey) {
      try {
        await setDoc(doc(db, 'customers', String(docKey)), cleanFields, { merge: true });
      } catch (err) {
        console.warn('Firestore customer update note:', err);
      }
    }

    try {
      const regSaved = localStorage.getItem('kf_registered_users');
      if (regSaved) {
        const users = JSON.parse(regSaved);
        const updatedUsers = users.map((u) => {
          if (u.id === customerIdOrPhone || u.phone === customerIdOrPhone) {
            return { ...u, ...cleanFields };
          }
          return u;
        });
        localStorage.setItem('kf_registered_users', JSON.stringify(updatedUsers));
      }
    } catch (e) {}

    return { success: true };
  };

  // Delete Customer Account (Admin access)
  const deleteCustomer = async (customerIdOrPhone) => {
    let targetPhone = '';

    setCustomers((prev) => {
      const match = prev.find(c => c.id === customerIdOrPhone || c.phone === customerIdOrPhone);
      if (match) targetPhone = match.phone;
      return prev.filter((c) => c.id !== customerIdOrPhone && c.phone !== customerIdOrPhone);
    });

    const docKey = targetPhone || customerIdOrPhone;
    if (docKey) {
      try {
        await deleteDoc(doc(db, 'customers', String(docKey)));
      } catch (err) {
        console.warn('Firestore customer delete note:', err);
      }
    }

    try {
      const regSaved = localStorage.getItem('kf_registered_users');
      if (regSaved) {
        const users = JSON.parse(regSaved);
        const filtered = users.filter((u) => u.id !== customerIdOrPhone && u.phone !== customerIdOrPhone);
        localStorage.setItem('kf_registered_users', JSON.stringify(filtered));
      }
    } catch (e) {}

    return { success: true };
  };

  // ---------- Orders ----------
  const createOrder = (orderData) => {
    const id = `KF-${Math.floor(100000 + Math.random() * 900000)}`;
    const custPhone = orderData.customer?.phone ? String(orderData.customer.phone).replace(/\D/g, '') : '';
    
    // Recalculate discount and pricing strictly at order creation (Single Source of Truth)
    const orderItems = orderData.items || [];
    const couponToApply = orderData.appliedCoupon || (orderData.pricing?.couponDiscount > 0 ? orderData.pricing?.appliedCoupon : null);
    const calculatedPricing = calculateCartDiscount(orderItems, couponToApply);

    const safePricing = {
      subtotal: calculatedPricing.subtotal,
      multiPairDiscountPercent: calculatedPricing.multiPairDiscountPercent,
      multiPairDiscount: calculatedPricing.multiPairDiscount,
      couponDiscount: calculatedPricing.couponDiscount,
      shippingFee: calculatedPricing.shippingFee,
      finalTotal: calculatedPricing.finalTotal
    };

    const newOrder = {
      ...orderData,
      id,
      customerPhone: custPhone,
      customerEmail: orderData.customer?.email || '',
      pricing: safePricing,
      total: safePricing.finalTotal,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      createdAt: Date.now(),
      status: 'Order Placed - Handcrafted & Packing'
    };

    // Copy on the customer's own device
    setMyOrders((prev) => [newOrder, ...prev.filter(o => o.id !== id)]);

    // Copy in the cloud for cross-device sync (silent background sync)
    setDoc(doc(db, 'orders', id), clean(newOrder)).catch((err) => {
      console.warn('Background store cloud sync note:', err?.message || err);
    });

    // Register or update customer profile in Firestore & state
    if (custPhone) {
      const orderCustomer = {
        id: `usr-${custPhone}`,
        name: orderData.shippingAddress?.fullName || orderData.customer?.name || `Customer +91 ${custPhone}`,
        phone: custPhone,
        email: orderData.shippingAddress?.email || orderData.customer?.email || '',
        securityPin: orderData.customer?.securityPin || '1234',
        city: orderData.shippingAddress?.city
          ? `${orderData.shippingAddress.city}, ${orderData.shippingAddress.state || 'Gujarat'}`
          : (orderData.customer?.city || 'Gujarat, India'),
        addresses: orderData.shippingAddress ? [orderData.shippingAddress] : [],
        signupDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        ordersCount: increment(1),
        lastLogin: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        lastLoginTimestamp: Date.now(),
        lastDevice: /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? 'Mobile Device' : 'Desktop / Laptop',
        role: 'Customer'
      };

      setCustomers((prev) => {
        const match = prev.find(c => c.phone === custPhone);
        if (match) {
          return prev.map(c => c.phone === custPhone ? { ...c, ordersCount: (c.ordersCount || 0) + 1 } : c);
        } else {
          return [orderCustomer, ...prev];
        }
      });

      setDoc(doc(db, 'customers', custPhone), clean(orderCustomer), { merge: true }).catch(() => {});
    }

    // Auto-decrement inventory stock for purchased sizes
    if (Array.isArray(orderData.items)) {
      orderData.items.forEach((item) => {
        if (item.id && item.size) {
          updateStockPerSize(item.id, item.size, -(item.quantity || 1));
        } else if (item.name && item.size) {
          const match = products.find((p) => p.name === item.name);
          if (match) {
            updateStockPerSize(match.id, item.size, -(item.quantity || 1));
          }
        }
      });
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    safeWrite(() =>
      updateDoc(doc(db, 'orders', orderId), { status: newStatus })
    );
    setMyOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setCloudOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Merge cloud orders and local device orders into allOrders (cloud takes priority, sorted newest first)
  const allOrdersMap = new Map();
  myOrders.forEach((o) => allOrdersMap.set(o.id, o));
  cloudOrders.forEach((o) => allOrdersMap.set(o.id, { ...(allOrdersMap.get(o.id) || {}), ...o }));
  const allOrders = Array.from(allOrdersMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  // ---------- Backup ----------
  const exportDatabase = () => {
    const data = {
      store: "Kothari Footwear - Idar",
      exportDate: new Date().toISOString(),
      products,
      customers,
      allOrders
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kothari_footwear_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DatabaseContext.Provider
      value={{
        products,
        productsLoaded,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        updateStockPerSize,
        batchAdvanceRestock,
        scheduleAdvanceRestock,
        resetToDefaultCatalog,
        customers,
        registerCustomer,
        recordUserSignInActivity,
        updateCustomerInfo,
        deleteCustomer,
        allOrders,
        createOrder,
        updateOrderStatus,
        exportDatabase,
        ownerSignedIn,
        signInOwner,
        signOutOwner
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);