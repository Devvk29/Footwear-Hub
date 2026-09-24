import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import {
  Package,
  Truck,
  Calendar,
  ShoppingBag,
  ArrowRight,
  FileText,
  Printer,
  CheckCircle2,
  Lock,
  Search,
  ExternalLink,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { STORE_INFO } from '../data/storeInfo';
import { getAssetUrl } from '../utils/assetUrl';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { user, isOwner, openAuthModal } = useAuth();
  const { allOrders } = useDatabase();
  const [searchOrderQuery, setSearchOrderQuery] = useState('');

  // Protect route: Redirect signed-out visitors to Home / Dashboard immediately
  useEffect(() => {
    if (!user) {
      if (openAuthModal) openAuthModal('orders');
      navigate('/', { replace: true });
    }
  }, [user, navigate, openAuthModal]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Strict Privacy: Non-admin users ONLY see their own verified personal purchases (cross-device synced via phone & email)
  const userOrders = allOrders.filter(
    (o) =>
      user &&
      ((user.phone && (o.customer?.phone === user.phone || o.customerPhone === user.phone)) ||
        (user.email && o.customer?.email?.toLowerCase() === user.email.toLowerCase()))
  );

  const displayOrders = isOwner ? allOrders : (user ? userOrders : []);

  const filteredOrders = displayOrders.filter((ord) => {
    if (!searchOrderQuery.trim()) return true;
    const q = searchOrderQuery.toLowerCase().trim();
    const idMatch = (ord.id || '').toLowerCase().includes(q);
    const itemMatch = (ord.items || []).some((it) => (it.name || '').toLowerCase().includes(q));
    const statusMatch = (ord.status || '').toLowerCase().includes(q);
    return idMatch || itemMatch || statusMatch;
  });

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '85vh', background: '#FAF9F6', paddingBottom: '4rem' }}>
      {/* Top Breadcrumb & Navigation Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)', padding: '0.75rem 1rem' }}>
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
              style={{
                minHeight: '44px',
                minWidth: '44px',
                padding: '0.5rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)'
              }}
              title="Go to previous page"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <Link
              to="/"
              className="btn btn-secondary"
              style={{
                minHeight: '44px',
                padding: '0.5rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <span>Dashboard</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
              <ChevronRight size={13} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>My Orders & Invoices</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              to="/invoice"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--accent-sage)',
                textDecoration: 'none',
                background: 'var(--accent-sage-light)',
                padding: '0.35rem 0.75rem',
                minHeight: '44px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <FileText size={15} />
              <span>Tax Invoice Lookup</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom" style={{ maxWidth: '880px', marginTop: '1.5rem', padding: '0 1rem' }}>
        {/* Main Card Header */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--accent-charcoal)',
                  color: '#D4A373',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1rem'
                }}
              >
                KF
              </div>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Official Orders & Retail Invoices
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  {user ? `Customer: ${user.name} (+91 ${user.phone})` : 'Kothari Footwear Verified Retail Purchases'}
                </p>
              </div>
            </div>

            {user && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: 'var(--accent-sage-light)',
                  color: 'var(--accent-sage)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {displayOrders.length} Invoices Synced
              </span>
            )}
          </div>

          {!user ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
              <Lock size={48} style={{ color: 'var(--accent-sage)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Sign In to View Your Invoices
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.5, margin: 0 }}>
                For your privacy and tax compliance, personal retail tax invoices and dispatched parcels are only visible after logging in to your registered account.
              </p>
              <button
                type="button"
                onClick={() => openAuthModal && openAuthModal('orders')}
                className="btn btn-primary"
                style={{ fontSize: '0.875rem', padding: '0.65rem 1.5rem', marginTop: '0.5rem' }}
              >
                Sign In to Your Account
              </button>
            </div>
          ) : (
            <>
              {/* Search Orders Bar */}
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8F6F1', padding: '0.5rem 0.85rem', borderRadius: '10px', border: '1px solid #E6E0D6' }}>
                <Search size={16} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by invoice number (e.g. KF-), shoe name, or status..."
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    width: '100%',
                    color: 'var(--text-primary)'
                  }}
                />
                {searchOrderQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchOrderQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Orders Listing */}
        {user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredOrders.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Package size={44} style={{ color: 'var(--text-muted)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {searchOrderQuery ? 'No Matching Invoices Found' : 'No Orders Placed Yet'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: 0 }}>
                  {searchOrderQuery
                    ? `No orders matching "${searchOrderQuery}". Try searching with your Invoice ID.`
                    : `No purchase history found for +91 ${user.phone}. Any orders placed from mobile or laptop will automatically sync here.`}
                </p>
                <Link
                  to="/"
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem', textDecoration: 'none', marginTop: '0.5rem' }}
                >
                  Browse Footwear Catalog
                </Link>
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    padding: '1.25rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {/* Order Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Invoice #{ord.id}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.65rem' }}>
                        • {ord.date}
                      </span>
                    </div>

                    <span
                      style={{
                        background: 'var(--accent-sage-light)',
                        color: 'var(--accent-sage)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {ord.status || 'Confirmed & Dispatched'}
                    </span>
                  </div>

                  {/* 4-Stage Stepper Tracker */}
                  <div
                    style={{
                      background: '#FAF7F2',
                      border: '1px solid #E6DFD5',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem',
                      overflowX: 'auto'
                    }}
                  >
                    {[
                      { step: 1, label: 'Order Confirmed', icon: '✓', done: true },
                      { step: 2, label: 'Quality Checked', icon: '✓', done: true },
                      { step: 3, label: 'Dispatched (Idar Hub)', icon: '🚚', done: true },
                      { step: 4, label: 'Delivered', icon: '📦', done: (ord.status || '').toLowerCase().includes('deliver') }
                    ].map((st, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: st.done ? 'var(--accent-sage)' : '#D1D5DB',
                            color: '#FFF',
                            fontSize: '0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800
                          }}
                        >
                          {st.icon}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: st.done ? 700 : 500, color: st.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {st.label}
                        </span>
                        {i < 3 && <span style={{ color: '#D1D5DB', margin: '0 0.2rem' }}>›</span>}
                      </div>
                    ))}
                  </div>

                  {/* Order Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {(ord.items || []).map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          background: '#F9FAFB',
                          padding: '0.6rem 0.85rem',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {item.image && (
                            <img
                              src={getAssetUrl(item.image)}
                              alt={item.name}
                              style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                              {item.name}
                            </p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                              Size: IND {item.size} • Color: {item.color || 'Standard'} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer Actions */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.65rem'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Paid via <strong>{ord.paymentMethod || 'UPI / COD'}</strong> •{' '}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Total: ₹{(ord.pricing?.finalTotal || ord.pricing?.subtotal || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {/* WhatsApp Dispatch Button: Admin Only */}
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => {
                            const itemsList = (ord.items || []).map((it) => `• ${it.name} (IND ${it.size}) x${it.quantity}`).join('\n');
                            const text = encodeURIComponent(
                              `Namaste Shri Manak Kothari ji!\n\nI have an order inquiry for Kothari Footwear:\n*Invoice ID:* #${ord.id}\n*Customer:* ${ord.customer?.name || 'Customer'} (${ord.customer?.phone || ''})\n*Delivery PIN:* ${ord.shippingAddress?.pincode || '383430'}\n*Items:*\n${itemsList}\n*Total Bill:* ₹${ord.pricing?.finalTotal || ord.pricing?.subtotal || 0}\n\nPlease share the live dispatch & courier tracking update.`
                            );
                            window.open(`https://wa.me/919427644222?text=${text}`, '_blank');
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '0.45rem 0.8rem', fontSize: '0.75rem', color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          title="Admin only: WhatsApp Dispatch Update"
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp Update</span>
                        </button>
                      )}

                      {/* View Tax Invoice Button */}
                      <Link
                        to={`/invoice/${ord.id}`}
                        state={{ from: '/orders' }}
                        className="btn btn-sage"
                        style={{ padding: '0.45rem 0.95rem', fontSize: '0.78125rem', display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                      >
                        <FileText size={14} />
                        <span>View Tax Invoice</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default OrdersPage;
