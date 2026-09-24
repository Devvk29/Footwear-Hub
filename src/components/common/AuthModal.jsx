import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { STORE_INFO } from '../../data/storeInfo';
import {
  X,
  ShieldCheck,
  ArrowRight,
  User,
  Lock,
  Phone,
  UserPlus,
  LogIn,
  Sparkles,
  LogOut,
  FileText,
  Heart,
  Crown,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const AuthModal = ({
  onOpenOrders,
  onOpenWishlist,
  onOpenAdmin
}) => {
  const {
    user,
    isLoggedIn,
    isOwner,
    authModalState,
    closeAuthModal,
    logout,
    loginWithCredentials,
    registerNewAccount,
    requestOtp,
    verifyOtpAndLogin
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login', 'signup', 'otp', 'profile'
  
  // Separate, isolated states for Login vs Sign Up
  const [loginName, setLoginName] = useState('');
  const [loginPin, setLoginPin] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPin, setSignupPin] = useState('');

  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetAllInputs = () => {
    setLoginName('');
    setLoginPin('');
    setSignupName('');
    setSignupPhone('');
    setSignupEmail('');
    setSignupPin('');
    setOtpDigits(['', '', '', '']);
    setError('');
    setSuccessMsg('');
  };

  // Reset or set appropriate view when modal is opened or mode switched
  useEffect(() => {
    resetAllInputs();
    if (authModalState.isOpen) {
      setIsSubmitting(false);
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      if (isLoggedIn) {
        setMode('profile');
      } else {
        setMode('login');
      }

      return () => {
        document.body.style.overflow = original;
      };
    } else {
      setMode('login');
    }
  }, [authModalState.isOpen, isLoggedIn]);

  if (!authModalState.isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginName.trim()) {
      setError('Please enter your registered Name, Mobile Number, or Gmail.');
      return;
    }

    if (!loginPin.trim()) {
      setError('Please enter your Security PIN.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithCredentials({
        name: loginName,
        identifier: loginName,
        securityPin: loginPin
      });

      if (!res.success) {
        setError(res.error);
      } else {
        if (res.isOwner) {
          setSuccessMsg('Welcome, Shri Manak Kothari! Admin access active.');
        }
      }
    } catch (err) {
      setError('Sign in error. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanName = signupName.trim();
    const cleanPhone = signupPhone.replace(/\D/g, '');
    const cleanEmail = signupEmail.trim().toLowerCase();
    const cleanPin = signupPin.trim();

    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your Full Name (at least 2 characters).');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian Mobile Number (starting with 6, 7, 8, or 9).');
      return;
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid Email / Gmail address (e.g. name@gmail.com).');
      return;
    }

    if (!cleanPin || cleanPin.length < 4) {
      setError('Please create a 4-digit Security PIN / Password (e.g. 1234).');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save new account into database without auto-entering website
      const res = await registerNewAccount({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        securityPin: cleanPin
      });

      if (!res.success) {
        setError(res.error);
      } else {
        // Switch to Log In tab, pre-fill login details and prompt for PIN
        setLoginName(cleanPhone || cleanName);
        setLoginPin('');
        setSuccessMsg(`🎉 Account registered successfully in database! Please enter your PIN to sign in.`);
        setMode('login');
      }
    } catch (err) {
      setError('Could not complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    if (!signupPhone.trim()) {
      setError('Please enter your mobile number for OTP.');
      return;
    }
    const res = requestOtp(signupPhone, signupName);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setGeneratedOtp(res.otp);
    setMode('otp');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 4) {
      setError('Please enter the complete 4-digit verification code.');
      return;
    }
    const res = verifyOtpAndLogin(code);
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleOtpInput = (index, val) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otpDigits];
    newOtp[index] = val;
    setOtpDigits(newOtp);

    if (val && index < 3) {
      const next = document.getElementById(`otp-digit-${index + 1}`);
      if (next) next.focus();
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal} style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div
        className="modal-card"
        style={{
          width: '100%',
          maxWidth: '430px',
          padding: '1.75rem',
          borderRadius: '16px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-sage)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              <ShieldCheck size={16} />
              <span>{STORE_INFO.name} • SECURE PORTAL</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isLoggedIn
                ? 'Your Account Profile'
                : (mode === 'login' ? 'Account Sign In' : (mode === 'signup' ? 'Create New Account' : 'Verify OTP'))}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {isLoggedIn
                ? `Logged in as ${user?.name}`
                : (mode === 'login'
                  ? 'Sign in with your Name/Mobile and Security PIN.'
                  : (mode === 'signup' ? 'Enter your details to register as a verified customer.' : `Code sent to ${signupPhone}`))}
            </p>
          </div>

          <button
            onClick={closeAuthModal}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* LOGGED IN USER PROFILE VIEW */}
        {isLoggedIn && user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* User Profile Card */}
            <div style={{
              background: isOwner ? 'linear-gradient(135deg, #1C1917 0%, #2E2823 100%)' : 'var(--bg-secondary)',
              border: isOwner ? '1.5px solid #D4A373' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              color: isOwner ? '#F6E6D3' : 'var(--text-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: isOwner ? '#1C1917' : 'var(--accent-sage)',
                  border: isOwner ? '2px solid #D4A373' : 'none',
                  color: isOwner ? '#D4A373' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {isOwner ? 'KF' : (user.name?.[0]?.toUpperCase() || 'U')}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: isOwner ? '#FFFFFF' : 'var(--text-primary)', letterSpacing: '0.01em' }}>
                    {user.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '3px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: isOwner ? '#D4A373' : 'var(--accent-sage-light)',
                      color: isOwner ? '#1C1917' : 'var(--accent-sage)'
                    }}>
                      {isOwner ? 'Store Owner' : 'Verified Customer'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '0.5rem',
                fontSize: '0.8rem',
                borderTop: `1px solid ${isOwner ? 'rgba(212,163,115,0.3)' : 'var(--border-subtle)'}`,
                paddingTop: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isOwner ? '#F6E6D3' : 'inherit' }}>
                  <Phone size={14} style={{ color: isOwner ? '#D4A373' : 'var(--accent-sage)', flexShrink: 0 }} />
                  <span>+91 {user.phone || '9427644222'}</span>
                </div>
                {user.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isOwner ? '#F6E6D3' : 'inherit' }}>
                    <span style={{ fontSize: '0.85rem' }}>✉️</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isOwner ? '#F6E6D3' : 'inherit' }}>
                  <MapPin size={14} style={{ color: isOwner ? '#D4A373' : 'var(--accent-sage)', flexShrink: 0 }} />
                  <span>{user.city || 'Gujarat, India'}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {isOwner && onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    closeAuthModal();
                    onOpenAdmin();
                  }}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, #1C1917 0%, #3D352E 100%)',
                    color: '#D4A373',
                    border: '1.5px solid #D4A373',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <ShieldCheck size={16} />
                    <span>Owner Suite • Admin Panel</span>
                  </div>
                  <ArrowRight size={15} />
                </button>
              )}

              {onOpenOrders && (
                <button
                  type="button"
                  onClick={() => {
                    closeAuthModal();
                    onOpenOrders();
                  }}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <FileText size={16} style={{ color: 'var(--accent-sage)' }} />
                    <span>My Invoices & Orders</span>
                  </div>
                  <ArrowRight size={15} />
                </button>
              )}

              {onOpenWishlist && (
                <button
                  type="button"
                  onClick={() => {
                    closeAuthModal();
                    onOpenWishlist();
                  }}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Heart size={16} style={{ color: '#E11D48' }} />
                    <span>My Saved Wishlist</span>
                  </div>
                  <ArrowRight size={15} />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  logout();
                  setLoginName('');
                  setLoginPin('');
                  setSignupName('');
                  setSignupPhone('');
                  setSignupEmail('');
                  setSignupPin('');
                  setError('');
                  setSuccessMsg('');
                  setMode('login');
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  marginTop: '0.35rem'
                }}
              >
                <LogOut size={16} />
                <span>Sign Out from This Device</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Selector Tabs (Sign In vs Sign Up) */}
            {mode !== 'otp' && (
              <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => { setMode('login'); resetAllInputs(); }}
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: mode === 'login' ? '#FFFFFF' : 'transparent',
                    color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('signup'); resetAllInputs(); }}
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: mode === 'signup' ? '#FFFFFF' : 'transparent',
                    color: mode === 'signup' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: mode === 'signup' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <UserPlus size={14} />
                  <span>Sign Up (New)</span>
                </button>
              </div>
            )}

            {error && (
              <div style={{ padding: '0.65rem 0.85rem', background: '#FDF2F2', border: '1px solid #F8D7DA', borderRadius: 'var(--radius-sm)', color: '#B91C1C', fontSize: '0.8125rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: '0.65rem 0.85rem', background: 'var(--accent-sage-light)', border: '1px solid rgba(56,89,66,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-sage)', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '1rem' }}>
                {successMsg}
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {/* Dummy anti-autofill absorbers */}
                <input type="text" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
                <input type="password" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="new-password" />

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Registered Name, Mobile, or Gmail
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      name="kf_si_identifier"
                      id="kf_si_identifier"
                      autoComplete="off"
                      placeholder="e.g. Rahul Sharma / 9876543210"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        background: 'var(--bg-primary)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Security PIN / Password
                    </label>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      name="kf_si_pin"
                      id="kf_si_pin"
                      autoComplete="new-password"
                      placeholder="Enter 4-digit PIN (e.g. 1234)"
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        background: 'var(--bg-primary)'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <LogIn size={16} />
                  <span>{isSubmitting ? 'Signing In...' : 'Sign In to Account'}</span>
                </button>
              </form>
            )}

            {/* 2. SIGN UP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignupSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Dummy anti-autofill absorbers to stop browser from pairing email + password with saved login */}
                <input type="text" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
                <input type="password" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="new-password" />

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      name="kf_su_fullname"
                      id="kf_su_fullname"
                      autoComplete="off"
                      placeholder="e.g. Amit Patel"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        background: 'var(--bg-primary)'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                    Enter your unique personal full name.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    10-Digit Mobile Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="tel"
                      name="kf_su_phone"
                      id="kf_su_phone"
                      autoComplete="off"
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        background: 'var(--bg-primary)'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                    Unique 10-digit mobile number for login across mobile & desktop.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Email / Gmail Address (Optional)
                  </label>
                  <input
                    type="text"
                    inputMode="email"
                    name="kf_su_email_address"
                    id="kf_su_email_address"
                    autoComplete="off"
                    placeholder="e.g. amit.patel@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-medium)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      background: 'var(--bg-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Create 4-Digit Security PIN *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      name="kf_su_new_pin"
                      id="kf_su_new_pin"
                      autoComplete="new-password"
                      maxLength={8}
                      placeholder="e.g. 1234"
                      value={signupPin}
                      onChange={(e) => setSignupPin(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        background: 'var(--bg-primary)'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                    Choose a unique 4-digit Security PIN for your account.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <UserPlus size={16} />
                  <span>{isSubmitting ? 'Registering Account...' : 'Register & Save Account'}</span>
                </button>
              </form>
            )}

            {/* 3. OTP VERIFICATION FORM */}
            {mode === 'otp' && (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '100%' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Verification code sent to {signupPhone}:</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-sage)', letterSpacing: '0.2em', marginTop: '0.2rem' }}>
                    {generatedOtp}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-digit-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(idx, e.target.value)}
                      style={{
                        width: '45px',
                        height: '50px',
                        textAlign: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        border: '2px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        outline: 'none'
                      }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  Verify Code & Enter
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
