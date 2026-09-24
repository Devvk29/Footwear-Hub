import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Package, Truck, Calendar, X, ShoppingBag, ArrowRight, FileText, Printer, CheckCircle2, Lock } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetUrl';

export const MyOrdersModal = ({ isOpen, onClose, onBrowseCatalog, onViewInvoice }) => {
  const { user, isOwner, openAuthModal } = useAuth();
  const { allOrders } = useDatabase();

  // Lock background body scroll
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Strict Privacy: Non-admin users ONLY see their own verified personal purchases (cross-device synced via phone & email)
  const userOrders = allOrders.filter(
    o =>
      user &&
      ((user.phone && (o.customer?.phone === user.phone || o.customerPhone === user.phone)) ||
        (user.email && o.customer?.email?.toLowerCase() === user.email.toLowerCase()))
  );

  const displayOrders = isOwner ? allOrders : (user ? userOrders : []);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '0.5rem' }}>
      <div
        className="modal-card"
        style={{ width: '100%', maxWidth: '700px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--accent-charcoal)',
              color: '#D4A373',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              KF
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Official Orders & Retail Invoices
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user ? `Customer: ${user.name} (+91 ${user.phone})` : 'Kothari Footwear Customer Invoices'}
              </p>
            </div>
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

        {!user ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Lock size={44} style={{ color: 'var(--accent-sage)' }} />
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Sign In to View Your Invoices</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5 }}>
              For your account privacy and security, personal retail tax invoices and order histories are only visible after signing into your registered account.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (openAuthModal) openAuthModal('orders');
              }}
              className="btn btn-primary"
              style={{ fontSize: '0.8125rem', padding: '0.6rem 1.35rem', marginTop: '0.5rem' }}
            >
              Sign In to Your Account
            </button>
          </div>
        ) : (
          <>
            {/* Top Customer Invoice Status Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #FAF8F5 0%, #F3EFE9 100%)',
              border: '1px solid var(--accent-sage-light)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.65rem'
            }}>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Personal Verified Retail Invoices
                </span>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Verified retail tax receipts for <strong>{user.name}</strong> (+91 {user.phone}). Shri Manak Kothari's signature & Idar Store seal included.
                </p>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                background: 'var(--accent-sage-light)',
                color: 'var(--accent-sage)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)'
              }}>
                {displayOrders.length} Invoices Synced
              </span>
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {displayOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <Package size={40} style={{ color: 'var(--text-muted)' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Orders Placed Yet</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '440px' }}>
                    No purchase history found for +91 {user.phone}. Any orders placed from mobile or laptop will automatically sync here with their verified tax invoices.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onBrowseCatalog) onBrowseCatalog();
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.8125rem', padding: '0.55rem 1.15rem', marginTop: '0.5rem' }}
                  >
                    Browse Footwear Catalog
                  </button>
                </div>
              ) : (
            displayOrders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.15rem',
                  background: 'var(--bg-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Order Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Invoice #{ord.id}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      • {ord.date}
                    </span>
                  </div>
                  <span style={{
                    background: 'var(--accent-sage-light)',
                    color: 'var(--accent-sage)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {ord.status || 'Confirmed & Dispatched'}
                  </span>
                </div>

                {/* Live 4-Stage Visual Order Stepper */}
                <div style={{
                  background: '#FAF7F2',
                  border: '1px solid #E6DFD5',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    <span>1. Placed</span>
                    <span>2. Handcrafted & QC</span>
                    <span>3. Dispatched</span>
                    <span>4. Out for Delivery</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: ord.status?.includes('Delivered') ? '100%' : ord.status?.includes('Dispatched') ? '75%' : ord.status?.includes('Packing') ? '50%' : '25%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #D4A373 0%, #385942 100%)',
                      borderRadius: '3px'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px', fontSize: '0.72rem' }}>
                    <span style={{ color: 'var(--accent-sage)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Truck size={13} />
                      Current Status: {ord.status || 'Order Placed - Handcrafted & Packing'}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Sabarkantha / Idar Hub
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {(ord.items || []).map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {item.image && (
                          <img src={getAssetUrl(item.image)} alt={item.name} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                        )}
                        <div>
                          <strong style={{ color: 'var(--text-primary)' }}>{item.name}</strong>
                          <span style={{ color: 'var(--text-muted)', marginLeft: '0.35rem' }}>(IND {item.size || 8} • Qty {item.quantity || 1})</span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700 }}>₹{((item.price || 599) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer with Direct Invoice Viewer & WhatsApp Share */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.65rem',
                  marginTop: '0.2rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Paid via <strong>{ord.paymentMethod}</strong> • </span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Total: ₹{(ord.pricing?.finalTotal || ord.pricing?.subtotal || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {/* Share on WhatsApp: Admin Only */}
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => {
                          const itemsList = (ord.items || []).map(it => `• ${it.name} (IND ${it.size}) x${it.quantity}`).join('\n');
                          const text = encodeURIComponent(
                            `Namaste Shri Manak Kothari ji!\n\nI have an order inquiry for Kothari Footwear:\n*Invoice ID:* #${ord.id}\n*Customer:* ${ord.customer?.name || 'Customer'} (${ord.customer?.phone || ''})\n*Delivery PIN:* ${ord.shippingAddress?.pincode || '383430'}\n*Items:*\n${itemsList}\n*Total Bill:* ₹${ord.pricing?.finalTotal || ord.pricing?.subtotal || 0}\n\nPlease share the live dispatch & courier tracking update.`
                          );
                          window.open(`https://wa.me/919427644222?text=${text}`, '_blank');
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#15803D' }}
                        title="Admin only: WhatsApp Dispatch Update"
                      >
                        <span>💬 WhatsApp Update</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onViewInvoice) onViewInvoice(ord);
                      }}
                      className="btn btn-sage"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.78125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <FileText size={14} />
                      <span>View Tax Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
};
