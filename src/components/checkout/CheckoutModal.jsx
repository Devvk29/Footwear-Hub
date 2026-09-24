import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useDatabase } from '../../context/DatabaseContext';
import { STORE_INFO } from '../../data/storeInfo';
import {
  X,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INDIAN_STATES = [
  "Gujarat", "Rajasthan", "Maharashtra", "Madhya Pradesh", "Delhi",
  "Haryana", "Punjab", "Karnataka", "Tamil Nadu", "Telangana",
  "Andhra Pradesh", "Uttar Pradesh", "West Bengal", "Bihar", "Assam"
];

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { user } = useAuth();
  const {
    items,
    subtotal,
    multiPairDiscountPercent,
    multiPairDiscount,
    couponDiscount,
    shippingFee,
    finalTotal,
    appliedCoupon,
    clearCart
  } = useCart();
  const { createOrder } = useDatabase();

  // Delivery Address Fields - ALWAYS Initialized EMPTY so each order requires fresh customer delivery entry
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'cod', 'card'
  const [utrNumber, setUtrNumber] = useState('');
  const [isCopiedUPI, setIsCopiedUPI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Populate user data if logged in or initialize clean state
  useEffect(() => {
    if (isOpen) {
      if (user) {
        const defaultAddr = (user.addresses && user.addresses[0]) || {};
        setFullName(user.name || defaultAddr.fullName || '');
        setPhone(user.phone || defaultAddr.phone || '');
        setEmail(user.email || defaultAddr.email || '');
        setStreet(defaultAddr.street && defaultAddr.street !== 'Customer Delivery Address' ? defaultAddr.street : '');
        setCity(defaultAddr.city || (user.city && !user.city.includes('India') ? user.city : ''));
        setState(defaultAddr.state || 'Gujarat');
        setPincode(defaultAddr.pincode && defaultAddr.pincode !== '380001' ? defaultAddr.pincode : '');
      } else {
        setFullName('');
        setPhone('');
        setEmail('');
        setStreet('');
        setCity('');
        setState('Gujarat');
        setPincode('');
      }
      setUtrNumber('');
      setError('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Verified Google Pay / UPI Payment Configuration
  const upiId = STORE_INFO.contact.upiId || "meetakothari.2310-2@okicici";
  const payeeName = STORE_INFO.contact.payeeName || "Devarsh Kothari";
  const paymentPhone = STORE_INFO.contact.paymentPhone || "9737782959";
  
  // Standard NPCI UPI URI string that works across Google Pay, PhonePe, Paytm, BHIM
  const upiPayLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${finalTotal}&cu=INR&tn=KothariFootwearOrder`;
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiPayLink)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setIsCopiedUPI(true);
    setTimeout(() => setIsCopiedUPI(false), 2000);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanPincode = pincode.replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (!fullName.trim() || !cleanPhone || !street.trim() || !city.trim() || !cleanPincode) {
      setError('Please fill all mandatory shipping address fields (Name, Phone, Address, City & Pincode)');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number for invoice dispatch');
      return;
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid Email / Gmail address');
      return;
    }

    if (cleanPincode.length !== 6) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      let selectedPayMethod = 'Cash on Delivery (COD)';
      if (paymentMethod === 'upi') {
        selectedPayMethod = `UPI (Google Pay / PhonePe to ${payeeName} [${upiId}])${utrNumber ? ` - UTR: ${utrNumber}` : ''}`;
      } else if (paymentMethod === 'card') {
        selectedPayMethod = 'Debit / Credit Card & Net Banking';
      }

      const order = createOrder({
        customer: {
          name: fullName,
          phone: cleanPhone,
          email: cleanEmail || user?.email || `${cleanPhone}@kothariclient.in`
        },
        shippingAddress: {
          fullName,
          phone: cleanPhone,
          email: cleanEmail || user?.email || '',
          street,
          city,
          state,
          pincode
        },
        paymentMethod: selectedPayMethod,
        utrNumber: utrNumber || undefined,
        items: items.map(i => ({
          name: i.product.name,
          image: i.product.image,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.product.price
        })),
        pricing: {
          subtotal,
          multiPairDiscountPercent,
          multiPairDiscount,
          couponDiscount,
          shippingFee,
          finalTotal,
          appliedCoupon
        },
        appliedCoupon
      });

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      // Automatically dispatch WhatsApp confirmation & invoice PDF link to customer's phone
      try {
        const targetPhone = `91${cleanPhone}`;
        const onlineInvoiceUrl = `${window.location.origin}/invoice/${order.id}`;
        const purchasedSummary = items.map((it, idx) =>
          `${idx + 1}. ${it.product.name} (IND ${it.size}) x${it.quantity}`
        ).join('\n');

        const whatsappText =
          `✨ *KOTHARI FOOTWEAR - ORDER CONFIRMATION* ✨\n` +
          `*Est. 1998, Idar, Gujarat*\n\n` +
          `Namaste ${fullName}!\n` +
          `Your footwear order has been confirmed successfully.\n\n` +
          `🧾 *ORDER DETAILS*\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n` +
          `*Invoice ID:* #${order.id}\n` +
          `*Total Bill:* ₹${finalTotal.toLocaleString('en-IN')}\n` +
          `*Payment Mode:* ${selectedPayMethod}\n` +
          `*Delivery Address:* ${street}, ${city} (${pincode})\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n` +
          `*Items:*\n${purchasedSummary}\n\n` +
          `📄 *Your Official Tax Invoice PDF & Live Tracking:* \n${onlineInvoiceUrl}\n\n` +
          `Helpline: +91 94276 44222 (Shri Manak Kothari)\n` +
          `Thank you for shopping with Kothari Footwear!`;

        const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(whatsappText)}`;
        window.open(waUrl, '_blank');
      } catch (waErr) {
        console.warn('Auto WhatsApp dispatch note:', waErr);
      }

      clearCart();
      setIsSubmitting(false);
      onClose();
      if (onOrderPlaced) onOrderPlaced(order);
    }, 700);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ width: '100%', maxWidth: '780px', padding: '1.5rem', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-sage)', fontSize: '0.75rem', fontWeight: 700 }}>
              <ShieldCheck size={15} />
              <span>DIRECT CHECKOUT • KOTHARI FOOTWEAR</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Delivery Details & Payment
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.65rem', background: '#FDF2F2', border: '1px solid #F8D7DA', borderRadius: 'var(--radius-sm)', color: '#B91C1C', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Left Column: Delivery Address (User fills out) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <MapPin size={16} style={{ color: 'var(--accent-sage)' }} />
              <span>1. Delivery Address (Fill Out)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-primary)',
                    fontSize: '0.8125rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Mobile Number (for SMS & WhatsApp Dispatch) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit number"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-primary)',
                    fontSize: '0.8125rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Email / Gmail (for Digital Tax Invoice PDF Copy)
              </label>
              <input
                type="email"
                placeholder="yourname@gmail.com (Optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-primary)',
                  fontSize: '0.8125rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                House / Flat / Street / Landmark Address *
              </label>
              <input
                type="text"
                required
                placeholder="House No., Building, Street, Area landmark..."
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-primary)',
                  fontSize: '0.8125rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmedabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-primary)',
                    fontSize: '0.8125rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-primary)',
                    fontSize: '0.8125rem',
                    outline: 'none'
                  }}
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="6-digit PIN"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-primary)',
                    fontSize: '0.8125rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--accent-sage)', fontWeight: 600, marginTop: '0.35rem' }}>
              <Truck size={14} />
              <span>Free Express Delivery with Indian Doorstep Tracking</span>
            </div>
          </div>

          {/* Right Column: Payment to Mobile No 9737782959 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <CreditCard size={16} style={{ color: 'var(--accent-sage)' }} />
              <span>2. Payment Method</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              
              {/* UPI Option Linked to meetakothari.2310-2@okicici / Devarsh Kothari */}
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'upi' ? '2px solid #1A73E8' : '1px solid var(--border-subtle)',
                  background: paymentMethod === 'upi' ? '#F0F6FF' : 'var(--bg-primary)',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setPaymentMethod('upi')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      style={{ accentColor: '#1A73E8' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          Google Pay / PhonePe / Paytm / BHIM
                        </p>
                        <span style={{ fontSize: '0.65rem', background: '#E8F0FE', color: '#1A73E8', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Verified
                        </span>
                      </div>
                      <p style={{ fontSize: '0.72rem', color: '#1A73E8', fontWeight: 600, marginTop: '1px' }}>
                        Payee: {payeeName} ({upiId})
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>🟢</span>
                    <QrCode size={20} style={{ color: '#1A73E8' }} />
                  </div>
                </div>

                {/* Expanded Google Pay QR Card UI (Matching Official GPay Standard) */}
                {paymentMethod === 'upi' && (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px dashed rgba(26, 115, 232, 0.35)' }}>
                    
                    {/* Authentic Google Pay Style Card Container */}
                    <div style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #D2E3FC',
                      padding: '1rem',
                      boxShadow: '0 4px 16px rgba(26, 115, 232, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      
                      {/* GPay Header: User Avatar & Payee Name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', justifyContent: 'center' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}>
                          DK
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#202124', lineHeight: 1.1 }}>
                            {payeeName}
                          </h4>
                          <span style={{ fontSize: '0.68rem', color: '#5F6368', fontWeight: 500 }}>
                            Kothari Footwear • Sabarkantha, Gujarat
                          </span>
                        </div>
                      </div>

                      {/* Crisp Dynamic QR Box with GPay Logo in Center */}
                      <div style={{
                        position: 'relative',
                        background: '#FFFFFF',
                        padding: '10px',
                        borderRadius: '12px',
                        border: '1.5px solid #E8EAED',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={upiQrUrl}
                          alt={`Google Pay QR - ${payeeName}`}
                          style={{ width: '160px', height: '160px', display: 'block' }}
                        />
                        {/* GPay Emblem Badge overlay in Center */}
                        <div style={{
                          position: 'absolute',
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #FFFFFF'
                        }}>
                          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>💳</span>
                        </div>
                      </div>

                      {/* Verified UPI ID Strip with Copy Button */}
                      <div style={{
                        background: '#F8F9FA',
                        border: '1px solid #E8EAED',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        maxWidth: '340px'
                      }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span style={{ fontSize: '0.68rem', color: '#5F6368', display: 'block' }}>UPI ID:</span>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1A73E8', letterSpacing: '0.02em' }}>
                            {upiId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUPI();
                          }}
                          style={{
                            background: isCopiedUPI ? '#34A853' : '#1A73E8',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isCopiedUPI ? <Check size={12} /> : <Copy size={12} />}
                          <span>{isCopiedUPI ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>

                      <p style={{ fontSize: '0.72rem', color: '#5F6368', fontWeight: 600, textAlign: 'center' }}>
                        Scan to pay with any UPI app (GPay, PhonePe, Paytm, BHIM, Cred)
                      </p>

                      {/* Direct Mobile Instant Pay Button */}
                      <a
                        href={upiPayLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: 'linear-gradient(135deg, #1A73E8 0%, #1557B0 100%)',
                          color: '#FFFFFF',
                          padding: '0.6rem 1.25rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          boxShadow: '0 3px 10px rgba(26, 115, 232, 0.3)',
                          width: '100%',
                          justifyContent: 'center'
                        }}
                      >
                        <Smartphone size={15} />
                        <span>Tap to Open UPI App & Pay ₹{finalTotal.toLocaleString('en-IN')}</span>
                      </a>
                    </div>

                    {/* UTR Input */}
                    <div style={{ marginTop: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        UPI Reference / UTR Number (Optional):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 12-digit UTR from Google Pay / PhonePe receipt"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          background: '#FFFFFF',
                          fontSize: '0.78rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cash on Delivery */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'cod' ? '2px solid var(--accent-charcoal)' : '1px solid var(--border-subtle)',
                  background: paymentMethod === 'cod' ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ accentColor: 'var(--accent-charcoal)' }}
                  />
                  <div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Cash on Delivery (COD)
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Pay cash upon delivery to your doorstep</p>
                  </div>
                </div>
                <Banknote size={18} style={{ color: 'var(--accent-tan)' }} />
              </label>

              {/* Card / Netbanking */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'card' ? '2px solid var(--accent-charcoal)' : '1px solid var(--border-subtle)',
                  background: paymentMethod === 'card' ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    style={{ accentColor: 'var(--accent-charcoal)' }}
                  />
                  <div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Debit / Credit Card & Net Banking
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>RuPay, Visa, Mastercard</p>
                  </div>
                </div>
                <CreditCard size={18} style={{ color: 'var(--text-muted)' }} />
              </label>
            </div>

            {/* Price Mini Summary */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '0.75rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78125rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {multiPairDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#B45309', fontWeight: 700 }}>
                  <span>Multi-Pair Offer ({multiPairDiscountPercent}% OFF):</span>
                  <span>-₹{multiPairDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-sage)', fontWeight: 600 }}>
                  <span>Special Discount:</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery:</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem', marginTop: '0.15rem' }}>
                <span>Total Payable:</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', justifyContent: 'center' }}
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order • ₹{finalTotal.toLocaleString('en-IN')}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};
