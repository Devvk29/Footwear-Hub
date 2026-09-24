import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useDatabase } from './DatabaseContext';

const AuthContext = createContext();

const OWNER_PHONE = "9427644222";
const OWNER_EMAILS = ["manakkothari132@gmail.com", "973dev@gmail.com"];

export const AuthProvider = ({ children }) => {
  const { registerCustomer, recordUserSignInActivity, customers, allOrders } = useDatabase();

  // Always start with no user — every page load requires fresh sign-in
  const [user, setUser] = useState(null);

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('kf_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    reason: '', // 'cart', 'buy_now', 'wishlist', 'profile', 'admin'
    pendingAction: null
  });

  // Dynamic OTP state
  const [activeOtpSession, setActiveOtpSession] = useState(null);

  // Clear any stored session immediately on mount — fresh login required every visit
  useEffect(() => {
    try {
      localStorage.removeItem('kf_active_user');
    } catch (e) {}
  }, []);

  // Keep user state synced in memory only (no localStorage persistence between sessions)
  // We do NOT write to kf_active_user anymore to prevent auto-login

  useEffect(() => {
    try {
      localStorage.setItem('kf_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  const openAuthModal = (reason = 'login', pendingAction = null) => {
    setAuthModalState({
      isOpen: true,
      reason,
      pendingAction
    });
  };

  const closeAuthModal = () => {
    setAuthModalState({
      isOpen: false,
      reason: '',
      pendingAction: null
    });
    setActiveOtpSession(null);
  };

  // Generate real dynamic OTP
  const requestOtp = (identifier, fullName = '') => {
    const isPhone = /^[6-9]\d{9}$/.test(identifier.replace(/\D/g, ''));
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(identifier);

    if (!isPhone && !isEmail) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number (starts with 6-9) or real email.' };
    }

    // Generate dynamic 4-digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const session = {
      identifier: identifier.trim(),
      isPhone,
      otp: generatedOtp,
      fullName: fullName.trim(),
      createdAt: Date.now(),
      expiresAt: Date.now() + 3 * 60 * 1000 // 3 minutes
    };

    setActiveOtpSession(session);
    return {
      success: true,
      otp: generatedOtp,
      target: isPhone ? `+91 ${identifier}` : identifier
    };
  };

  // Verify OTP and complete login / signup
  const verifyOtpAndLogin = async (enteredOtp) => {
    if (!activeOtpSession) {
      return { success: false, error: 'Session expired. Please request a new OTP.' };
    }

    if (Date.now() > activeOtpSession.expiresAt) {
      return { success: false, error: 'OTP has expired. Please request a fresh OTP.' };
    }

    if (enteredOtp.trim() !== activeOtpSession.otp) {
      return { success: false, error: 'Incorrect OTP. Please check the 4-digit code sent.' };
    }

    // Check if logging in as Father (Mr. Manak Kothari)
    const rawClean = activeOtpSession.identifier.replace(/\D/g, '');
    const isOwner =
      rawClean === OWNER_PHONE ||
      OWNER_EMAILS.includes(activeOtpSession.identifier.toLowerCase());

    const loggedInUser = {
      id: isOwner ? 'owner-manak-kothari' : `usr-${Date.now().toString().slice(-6)}`,
      name: isOwner ? 'Shri Manak Kothari' : (activeOtpSession.fullName || 'Valued Customer'),
      phone: isOwner ? OWNER_PHONE : (activeOtpSession.isPhone ? activeOtpSession.identifier : ''),
      email: isOwner ? 'manakkothari132@gmail.com' : (!activeOtpSession.isPhone ? activeOtpSession.identifier : `${activeOtpSession.identifier}@kothariclient.in`),
      isOwner,
      city: isOwner ? 'Idar, Gujarat' : 'Gujarat, India',
      addresses: [
        {
          id: `addr-${Date.now()}`,
          fullName: isOwner ? 'Shri Manak Kothari' : (activeOtpSession.fullName || 'Valued Customer'),
          phone: isOwner ? OWNER_PHONE : activeOtpSession.identifier,
          street: isOwner ? '134, Near Tiranga Circle' : 'Main Road',
          city: isOwner ? 'Idar' : 'Ahmedabad',
          state: 'Gujarat',
          pincode: isOwner ? '383430' : '380001',
          isDefault: true
        }
      ]
    };

    setUser(loggedInUser);

    // Persist to permanent Customer database
    // Persist to permanent Customer database and track sign-in activity
    if (!isOwner && registerCustomer) {
      await registerCustomer({
        id: loggedInUser.id,
        name: loggedInUser.name,
        phone: loggedInUser.phone,
        email: loggedInUser.email,
        city: loggedInUser.city
      });
    }

    if (recordUserSignInActivity) {
      recordUserSignInActivity(loggedInUser);
    }

    // Execute pending callback
    if (authModalState.pendingAction && typeof authModalState.pendingAction === 'function') {
      authModalState.pendingAction(loggedInUser);
    }

    closeAuthModal();
    return { success: true, user: loggedInUser };
  };

  // Unified Smart Login: Strictly validate Manak Kothari (PIN: 2580) or registered customer account
  const loginWithCredentials = async ({ name = '', identifier = '', securityPin = '' }) => {
    const trimmedName = name.trim();
    const cleanId = identifier.trim();
    const rawDigits = cleanId.replace(/\D/g, '') || trimmedName.replace(/\D/g, '');
    const cleanPin = securityPin.trim();

    if (!trimmedName && !rawDigits && !cleanId) {
      return { success: false, error: 'Please enter your registered Name or Mobile Number.' };
    }

    if (!cleanPin) {
      return { success: false, error: 'Please enter your Security PIN.' };
    }

    const isNameManak = trimmedName.toLowerCase().replace(/^(shri|mr|shree)\s+/, '') === 'manak kothari';
    const isOwnerPhone = rawDigits === OWNER_PHONE || OWNER_EMAILS.includes(cleanId.toLowerCase());

    // 1. Strict Owner / Admin Check
    if (isNameManak || isOwnerPhone) {
      if (cleanPin === '2580' || cleanPin === '1998') {
        const ownerUser = {
          id: 'owner-manak-kothari',
          name: 'Shri Manak Kothari',
          phone: OWNER_PHONE,
          email: 'manakkothari132@gmail.com',
          isOwner: true,
          city: 'Idar, Gujarat',
          addresses: [
            {
              id: 'addr-kothari-shop',
              fullName: 'Shri Manak Kothari',
              phone: OWNER_PHONE,
              street: '134, Kothari Footwear, Near Tiranga Circle',
              city: 'Idar',
              state: 'Gujarat',
              pincode: '383430',
              isDefault: true
            }
          ]
        };

        setUser(ownerUser);
        if (recordUserSignInActivity) {
          recordUserSignInActivity(ownerUser);
        }
        if (authModalState.pendingAction && typeof authModalState.pendingAction === 'function') {
          authModalState.pendingAction(ownerUser);
        }
        closeAuthModal();
        return { success: true, user: ownerUser, isOwner: true };
      } else {
        return {
          success: false,
          error: 'Incorrect Security PIN for Shri Manak Kothari (Owner Suite).'
        };
      }
    }

    // 2. Customer Validation against all customer stores (local, Firestore, registered)
    let localSaved = [];
    try {
      localSaved = JSON.parse(localStorage.getItem('kf_registered_users') || '[]');
    } catch (e) {
      localSaved = [];
    }

    let dbCustomers = [];
    try {
      dbCustomers = JSON.parse(localStorage.getItem('kf_db_customers') || '[]');
    } catch (e) {
      dbCustomers = [];
    }

    const allCustomerPool = [...localSaved, ...dbCustomers, ...(customers || []), ...registeredUsers];

    // Search in memory by full name, phone number, or email
    let matchedUser = allCustomerPool.find(
      u => (trimmedName && u.name && u.name.toLowerCase().trim() === trimmedName.toLowerCase()) ||
           (rawDigits && u.phone === rawDigits) ||
           (cleanId && u.email && u.email.toLowerCase() === cleanId.toLowerCase())
    );

    // Fallback: If opening on a fresh mobile browser where local memory hasn't hydrated yet, check Firestore directly!
    if (!matchedUser) {
      if (rawDigits && rawDigits.length >= 10) {
        try {
          const directSnap = await getDoc(doc(db, 'customers', rawDigits));
          if (directSnap.exists()) {
            matchedUser = { ...directSnap.data(), id: directSnap.id };
          }
        } catch (e) {
          console.warn('Direct Firestore customer lookup by phone note:', e);
        }
      }

      if (!matchedUser && trimmedName) {
        try {
          const nameQ = query(collection(db, 'customers'), where('name', '==', trimmedName));
          const nameSnap = await getDocs(nameQ);
          if (!nameSnap.empty) {
            matchedUser = { ...nameSnap.docs[0].data(), id: nameSnap.docs[0].id };
          }
        } catch (e) {
          console.warn('Direct Firestore customer lookup by name note:', e);
        }
      }
    }

    if (!matchedUser) {
      return {
        success: false,
        error: `No registered account found for "${trimmedName || cleanId}". Please click 'Sign Up' to create your account.`
      };
    }

    // Check PIN match
    if (matchedUser.securityPin && cleanPin && matchedUser.securityPin !== cleanPin) {
      return {
        success: false,
        error: 'Incorrect Security PIN. Please check your 4-digit PIN and try again.'
      };
    }

    const customerUser = {
      id: matchedUser.id || `usr-${Date.now().toString().slice(-6)}`,
      name: matchedUser.name,
      phone: matchedUser.phone || rawDigits || '9876543210',
      email: matchedUser.email || `${(matchedUser.name || 'user').toLowerCase().replace(/\s+/g, '')}@kothariclient.in`,
      isOwner: false,
      city: matchedUser.city || 'Gujarat, India',
      addresses: matchedUser.addresses || [
        {
          id: `addr-${Date.now()}`,
          fullName: matchedUser.name,
          phone: matchedUser.phone || rawDigits || '9876543210',
          street: 'Customer Delivery Address',
          city: matchedUser.city || 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001',
          isDefault: true
        }
      ]
    };

    setUser(customerUser);

    // Record sign-in activity and device in database and state
    if (recordUserSignInActivity) {
      recordUserSignInActivity(customerUser);
    }

    if (authModalState.pendingAction && typeof authModalState.pendingAction === 'function') {
      authModalState.pendingAction(customerUser);
    }
    closeAuthModal();
    return { success: true, user: customerUser, isOwner: false };
  };

  // Register New Account (Strict uniqueness on Name, Mobile Number, and PIN + Firestore persistence)
  const registerNewAccount = async ({ name = '', phone = '', email = '', securityPin = '' }) => {
    const trimmedName = name.trim();
    const rawDigits = phone.replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = securityPin.trim();

    if (!trimmedName || trimmedName.length < 2) {
      return { success: false, error: 'Please enter a valid Full Name (at least 2 characters).' };
    }
    if (!/^[6-9]\d{9}$/.test(rawDigits)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian Mobile Number (starting with 6, 7, 8, or 9).' };
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid Email / Gmail address (e.g. yourname@gmail.com).' };
    }
    if (!cleanPin || cleanPin.length < 4) {
      return { success: false, error: 'Please create a Security PIN / Password (at least 4 digits, e.g. 1234).' };
    }

    // 1. Check against Owner Credentials
    const isNameManak = trimmedName.toLowerCase().replace(/^(shri|mr|shree)\s+/, '') === 'manak kothari';
    if (isNameManak) {
      return { success: false, error: 'This name is reserved for the store owner. Please enter your personal full name.' };
    }
    if (rawDigits === OWNER_PHONE) {
      return { success: false, error: 'This mobile number is reserved for the store owner suite. Please sign in.' };
    }
    if (cleanPin === '2580' || cleanPin === '1998') {
      return { success: false, error: 'This Security PIN cannot be used. For security, please choose a different 4-digit PIN.' };
    }

    // 2. Uniqueness Check against all registered accounts (Name, Mobile, and PIN cannot be re-used)
    let localSaved = [];
    try {
      localSaved = JSON.parse(localStorage.getItem('kf_registered_users') || '[]');
    } catch (e) {
      localSaved = [];
    }
    let dbCustomers = [];
    try {
      dbCustomers = JSON.parse(localStorage.getItem('kf_db_customers') || '[]');
    } catch (e) {
      dbCustomers = [];
    }

    const allPool = [...(customers || []), ...registeredUsers, ...localSaved, ...dbCustomers];

    // Check Name uniqueness
    const nameExists = allPool.find(
      u => u.name && u.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (nameExists) {
      return {
        success: false,
        error: `The name "${trimmedName}" is already registered. Please choose a unique name or sign in with your account.`
      };
    }

    // Check Mobile uniqueness
    const phoneExists = allPool.find(u => u.phone && u.phone === rawDigits);
    if (phoneExists) {
      return {
        success: false,
        error: `Mobile number +91 ${rawDigits} is already registered. Please sign in with your Security PIN.`
      };
    }

    // Check Security PIN uniqueness
    const pinExists = allPool.find(u => u.securityPin && u.securityPin === cleanPin);
    if (pinExists) {
      return {
        success: false,
        error: 'This Security PIN is already in use by another registered user. For your account security, please choose a different 4-digit PIN.'
      };
    }

    // Direct Firestore check to ensure multi-device uniqueness
    try {
      const phoneDirect = await getDoc(doc(db, 'customers', rawDigits));
      if (phoneDirect.exists()) {
        return {
          success: false,
          error: `Mobile number +91 ${rawDigits} is already registered in the cloud database. Please sign in with your PIN.`
        };
      }

      const nameQ = query(collection(db, 'customers'), where('name', '==', trimmedName));
      const nameSnap = await getDocs(nameQ);
      if (!nameSnap.empty) {
        return {
          success: false,
          error: `The name "${trimmedName}" is already registered in the cloud database. Please choose a different name or sign in.`
        };
      }
    } catch (e) {
      console.warn('Firestore cloud uniqueness check note:', e);
    }

    const newCust = {
      id: `usr-${Date.now()}`,
      name: trimmedName,
      phone: rawDigits,
      email: cleanEmail || `${rawDigits}@kothariclient.in`,
      securityPin: cleanPin,
      isOwner: false,
      city: 'Gujarat, India',
      addresses: [
        {
          id: `addr-${Date.now()}`,
          fullName: trimmedName,
          phone: rawDigits,
          street: 'Customer Delivery Address',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001',
          isDefault: true
        }
      ],
      signupDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      signupTimestamp: Date.now(),
      ordersCount: 0,
      loginCount: 0,
      lastLogin: 'Never (Newly Registered)',
      lastLoginTimestamp: null,
      lastDevice: /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? 'Mobile Device' : 'Desktop / Laptop',
      role: 'Customer'
    };

    const updated = [newCust, ...registeredUsers];
    setRegisteredUsers(updated);
    try {
      localStorage.setItem('kf_registered_users', JSON.stringify(updated));
    } catch (e) {}

    // Register customer in DB context (persists directly to Firestore & state)
    if (registerCustomer) {
      try {
        await registerCustomer(newCust);
      } catch (err) {
        console.warn('Customer DB register note:', err);
      }
    }

    // Do NOT auto-login user immediately. User will be redirected to Log In screen to verify PIN
    return {
      success: true,
      user: newCust,
      registeredIdentifier: rawDigits || trimmedName || cleanEmail
    };
  };

  // Quick Owner Login for Father (Mr. Manak Kothari)
  const loginAsOwnerDirect = () => {
    const ownerUser = {
      id: 'owner-manak-kothari',
      name: 'Shri Manak Kothari',
      phone: OWNER_PHONE,
      email: 'manakkothari132@gmail.com',
      isOwner: true,
      city: 'Idar, Gujarat',
      addresses: [
        {
          id: 'addr-kothari-shop',
          fullName: 'Shri Manak Kothari',
          phone: OWNER_PHONE,
          street: '134, Kothari Footwear, Near Tiranga Circle',
          city: 'Idar',
          state: 'Gujarat',
          pincode: '383430',
          isDefault: true
        }
      ]
    };

    setUser(ownerUser);
    if (recordUserSignInActivity) {
      recordUserSignInActivity(ownerUser);
    }
    if (authModalState.pendingAction && typeof authModalState.pendingAction === 'function') {
      authModalState.pendingAction(ownerUser);
    }
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kf_active_user');
    localStorage.removeItem('kf_cart');
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('kf_cart_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {}
  };

  // Filter user's personal orders from all orders in database (Strict customer privacy)
  const myOrders = allOrders.filter(
    o => user && (
      (user.phone && (o.customer?.phone === user.phone || o.customerPhone === user.phone)) ||
      (user.email && o.customer?.email?.toLowerCase() === user.email.toLowerCase())
    )
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isOwner: user?.isOwner === true,
        authModalState,
        openAuthModal,
        closeAuthModal,
        requestOtp,
        verifyOtpAndLogin,
        loginWithCredentials,
        registerNewAccount,
        activeOtpSession,
        loginAsOwnerDirect,
        logout,
        myOrders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
