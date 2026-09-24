import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Truck,
  Leaf,
  Tag,
  Check
} from 'lucide-react';

export const CartDrawer = ({ onOpenCheckout, onOpenSizeGuide, onOpenSampleInvoice }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    totalCount,
    subtotal,
    totalMrp,
    mrpSavings,
    multiPairDiscountPercent,
    multiPairDiscount,
    nextTierMessage,
    hintMessage,
    suggestedCoupon,
    couponDiscount,
    shippingFee,
    isFreeShipping,
    freeShippingAway,
    finalTotal,
    appliedCoupon,
    couponError,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { isLoggedIn, openAuthModal } = useAuth();
  const [couponInput, setCouponInput] = useState('');

  // Body scroll lock when drawer is open (same as menu drawer reference)
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      openAuthModal('cart', () => {
        setIsCartOpen(false);
        onOpenCheckout();
      });
      return;
    }
    setIsCartOpen(false);
    onOpenCheckout();
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const ok = applyCoupon(couponInput);
    if (ok) setCouponInput('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(25, 24, 23, 0.7)',
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Slidebar Drawer Content (From Right Side) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: '#FFFFFF',
          boxShadow: '-4px 0 25px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'drawerSlideRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          padding: '1.15rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--accent-charcoal)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Your Bag ({totalCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
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
              color: 'var(--text-secondary)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Multi-Pair Tiered Savings Offer Banner */}
        <div style={{
          padding: '0.65rem 1.25rem',
          background: totalCount >= 3 ? '#FEF3C7' : totalCount === 2 ? '#E7EFE9' : totalCount === 1 ? '#FFFBEB' : '#FAF8F5',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.8125rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', fontWeight: 700 }}>
            <span style={{ color: totalCount >= 3 ? '#92400E' : totalCount === 2 ? 'var(--accent-sage)' : totalCount === 1 ? '#B45309' : 'var(--text-secondary)' }}>
              {totalCount === 1 ? `🎁 ${hintMessage || "Add 1 more pair to get 10% OFF"}` : (totalCount === 0 ? "🎁 Add 2+ pairs to unlock 10% - 15% Instant Multi-Pair OFF!" : nextTierMessage)}
            </span>
            {multiPairDiscountPercent > 0 && (
              <span style={{ background: 'var(--accent-charcoal)', color: '#FFF', fontSize: '0.65rem', padding: '2px 7px', borderRadius: '4px' }}>
                {multiPairDiscountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{
          padding: '0.75rem 1.25rem',
          background: isFreeShipping ? 'var(--accent-sage-light)' : 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.8125rem'
        }}>
          {isFreeShipping ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-sage)', fontWeight: 600 }}>
              <Truck size={15} />
              <span>🎉 Congratulations! You have unlocked Free Express Delivery!</span>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                <span>Add <strong>₹{freeShippingAway}</strong> more for Free Delivery</span>
                <span>Threshold: ₹999</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'var(--border-medium)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, (subtotal / 999) * 100)}%`,
                  height: '100%',
                  background: 'var(--accent-sage)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List (Smooth Natural Height Flow) */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.length === 0 ? (
            <div style={{
              margin: 'auto 0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              padding: '2rem 0'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem'
              }}>
                🛍️
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Your Shopping Bag is Empty
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Explore handcrafted leather shoes, festive mojaris, and eco-sneakers for Men & Women.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.8125rem' }}
              >
                Browse Collections
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                {/* Thumb */}
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: '#F3EFE9',
                  flexShrink: 0
                }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                      {item.product.name}
                    </h5>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span style={{
                      background: 'var(--bg-tertiary)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      color: 'var(--accent-charcoal)'
                    }}>
                      IND {item.size}
                    </span>
                    <span>• {item.color}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    {/* Quantity controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-primary)'
                    }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Minus size={11} />
                      </button>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0 6px' }}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            
            {/* Auto-Generated Discount Coupon Banner */}
            {!appliedCoupon && suggestedCoupon && (
              <div style={{
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
                border: '1px dashed #D97706',
                borderRadius: 'var(--radius-sm)',
                padding: '0.45rem 0.65rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} style={{ color: '#D97706', flexShrink: 0 }} />
                  <span style={{ color: '#92400E', fontWeight: 600 }}>
                    Unlocked: <strong style={{ letterSpacing: '0.04em' }}>{suggestedCoupon.code}</strong> ({suggestedCoupon.label})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => applyCoupon(suggestedCoupon.code)}
                  style={{
                    background: '#D97706',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 7px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ⚡ Apply Coupon
                </button>
              </div>
            )}

            {/* Coupon Code Section */}
            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.4rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Tag size={13} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. HERITAGE10, FESTIVE15)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.65rem 0.45rem 1.9rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-primary)',
                      fontSize: '0.75rem',
                      outline: 'none',
                      textTransform: 'uppercase'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem' }}
                >
                  Apply
                </button>
              </form>
            ) : (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.4rem 0.75rem',
                background: 'var(--accent-sage-light)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: 'var(--accent-sage)',
                fontWeight: 600
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Check size={14} />
                  <span>{appliedCoupon.code} applied ({appliedCoupon.label})</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  style={{ background: 'none', border: 'none', color: '#B91C1C', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && (
              <p style={{ fontSize: '0.7rem', color: '#B91C1C' }}>{couponError}</p>
            )}

            {/* Price Breakdown */}
            <div style={{ fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({totalCount} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {multiPairDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#B45309', fontWeight: 700 }}>
                  <span>Multi-Pair Offer Savings ({multiPairDiscountPercent}%)</span>
                  <span>-₹{multiPairDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-sage)', fontWeight: 600 }}>
                  <span>Artisanal Coupon Savings</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Eco-Friendly Packaging</span>
                <span style={{ color: 'var(--accent-sage)', fontWeight: 600 }}>FREE (₹0)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Charges (India)</span>
                <span>
                  {shippingFee === 0 ? (
                    <span style={{ color: 'var(--accent-sage)', fontWeight: 600 }}>FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '0.2rem'
              }}>
                <span>Total Amount:</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              type="button"
              onClick={handleCheckoutClick}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.9375rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={17} />
            </button>

            {/* Official Tax Invoice Preview Button */}
            {onOpenSampleInvoice && (
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenSampleInvoice();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-sage)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>📄 Preview Official Retail Tax Invoice Structure</span>
              </button>
            )}

            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              🔒 100% Safe Checkout • UPI / COD / Cards Accepted
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
