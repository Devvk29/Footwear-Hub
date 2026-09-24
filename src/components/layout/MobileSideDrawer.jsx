import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { STORE_INFO } from '../../data/storeInfo';
import {
  X,
  User,
  LogOut,
  FileText,
  ShoppingBag,
  Heart,
  Ruler,
  Compass,
  Phone,
  MessageCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Tag,
  ArrowRight
} from 'lucide-react';

export const MobileSideDrawer = ({
  isOpen,
  onClose,
  activeGender,
  onSelectGender,
  onOpenSizeGuide,
  onOpenStory,
  onOpenOrders,
  onOpenWishlist,
  onOpenAdmin,
  onSelectCategory
}) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isOwner, openAuthModal, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  // Body scroll lock when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Namaste Shri Manak Kothari ji! I am browsing Kothari Footwear and need guidance on shoe sizing.");
    window.open(`https://wa.me/${STORE_INFO.contact.whatsapp}?text=${text}`, '_blank');
    onClose();
  };

  const handleCall = () => {
    window.location.href = `tel:${STORE_INFO.contact.phone}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(25, 24, 23, 0.7)',
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Slidebar Drawer Content (From Left Side) */}
      <div
        style={{
          position: 'relative',
          width: '88%',
          maxWidth: '360px',
          height: '100%',
          background: '#FFFFFF',
          boxShadow: '4px 0 25px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'drawerSlideLeft 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto'
        }}
      >
        {/* Drawer Header with KF Monogram */}
        <div
          style={{
            padding: '1.15rem 1rem',
            background: 'linear-gradient(135deg, #1C1917 0%, #2E2926 100%)',
            color: '#FFFFFF',
            borderBottom: '2px solid #D4A373',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* KF Monogram */}
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2E2926 0%, #1C1917 100%)',
              border: '1.5px solid #D4A373',
              boxShadow: '0 2px 10px rgba(212, 163, 115, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.3rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #F6E6D3 0%, #D4A373 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                KF
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.04em', color: '#FFF' }}>
                  KOTHARI
                </span>
                <span style={{ fontSize: '0.6rem', background: '#D4A373', color: '#1C1917', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                  EST. 1998
                </span>
              </div>
              <p style={{ fontSize: '0.68rem', color: '#BDB6AB', letterSpacing: '0.04em' }}>
                Shri Manak Kothari • Idar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Account / Sign In Status Card */}
        <div style={{ padding: '0.85rem 1rem', background: '#FAF7F2', borderBottom: '1px solid var(--border-subtle)' }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: isOwner ? 'var(--accent-charcoal)' : 'var(--accent-sage)',
                  color: isOwner ? '#D4A373' : '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 700
                }}>
                  {isOwner ? '👑' : (user?.name?.[0]?.toUpperCase() || 'U')}
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {user?.name}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    +91 {user?.phone}
                  </p>
                  {isOwner && (
                    <span style={{ fontSize: '0.65rem', background: 'var(--accent-sage-light)', color: 'var(--accent-sage)', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                      Master Store Owner
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                style={{
                  background: 'none',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.72rem',
                  color: '#DC2626',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  <User size={16} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Welcome to Kothari Footwear
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Sign in to view saved invoices & orders
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal('profile');
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.55rem', fontSize: '0.8125rem', justifyContent: 'center' }}
              >
                <User size={14} />
                <span>Sign In / Register with Mobile</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Multi-Pair Discount Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #385942 0%, #2D4734 100%)',
          color: '#FFFFFF',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} style={{ color: '#D4A373' }} />
            <span style={{ fontWeight: 700 }}>Multi-Pair Discount:</span>
          </div>
          <span style={{ fontWeight: 800, color: '#F6E6D3' }}>Buy 2: 10% | 3+: 15% OFF</span>
        </div>

        {/* Quick Access Tile Grid (Invoices, Orders, Cart, Wishlist, Admin) */}
        <div style={{ padding: '0.85rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', borderBottom: '1px solid var(--border-subtle)' }}>
          
          {/* Official Invoices Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/invoice');
            }}
            style={{
              background: '#F8F6F1',
              border: '1.5px solid #E6E0D6',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.25rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <FileText size={18} style={{ color: 'var(--accent-sage)' }} />
              <span style={{ fontSize: '0.6rem', background: 'var(--accent-sage-light)', color: 'var(--accent-sage)', padding: '1px 5px', borderRadius: '3px', fontWeight: 800 }}>
                GST
              </span>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Tax Invoices
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              View & Print Bills
            </span>
          </button>

          {/* My Orders Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/orders');
            }}
            style={{
              background: '#F8F6F1',
              border: '1.5px solid #E6E0D6',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.25rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <ShoppingBag size={18} style={{ color: 'var(--accent-tan)' }} />
              <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              My Orders
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Track Dispatched
            </span>
          </button>

          {/* Cart Shortcut */}
          <button
            type="button"
            onClick={() => {
              onClose();
              setIsCartOpen(true);
            }}
            style={{
              background: '#F8F6F1',
              border: '1.5px solid #E6E0D6',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.25rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <ShoppingBag size={18} style={{ color: 'var(--accent-charcoal)' }} />
              {totalCount > 0 && (
                <span style={{ background: 'var(--accent-sage)', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>
                  {totalCount} items
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Shopping Cart
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Checkout & Pay
            </span>
          </button>

          {/* Wishlist Shortcut */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenWishlist();
            }}
            style={{
              background: '#F8F6F1',
              border: '1.5px solid #E6E0D6',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.25rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Heart size={18} style={{ color: '#E11D48' }} />
              {wishlistCount > 0 && (
                <span style={{ background: 'var(--accent-tan)', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>
                  {wishlistCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              My Wishlist
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Saved Footwear
            </span>
          </button>

          {/* Owner Portal (ONLY visible when authenticated as Manak Kothari) */}
          {isLoggedIn && isOwner && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/admin');
                if (onOpenAdmin) onOpenAdmin();
              }}
              style={{
                gridColumn: '1 / -1',
                background: 'linear-gradient(135deg, #FAF7F2 0%, #F3EFE9 100%)',
                border: '1.5px dashed #D4A373',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#1C1917',
                  border: '1px solid #D4A373',
                  color: '#D4A373',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  KF
                </span>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Owner Suite • Admin Portal
                  </p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Live Inventory, Customer Invoices & Database
                  </p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: '#B45309' }} />
            </button>
          )}
        </div>

        {/* Footwear Navigation Links & Categories */}
        <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
            Footwear Collections (₹599 – ₹3,000)
          </p>

          <button
            type="button"
            onClick={() => {
              navigate('/');
              if (onSelectGender) onSelectGender('All');
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.55rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: activeGender === 'All' ? 'var(--bg-tertiary)' : 'none',
              border: 'none',
              fontWeight: activeGender === 'All' ? 700 : 500,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textAlign: 'left'
            }}
          >
            <span>👞 All Footwear Catalog</span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/mens-wear');
              if (onSelectGender) onSelectGender('Men');
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.55rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: activeGender === 'Men' ? 'var(--bg-tertiary)' : 'none',
              border: 'none',
              fontWeight: activeGender === 'Men' ? 700 : 500,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textAlign: 'left'
            }}
          >
            <span>👞 Men’s Shoes & Chappals (IND 6-12)</span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/womens-wear');
              if (onSelectGender) onSelectGender('Women');
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.55rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: activeGender === 'Women' ? 'var(--bg-tertiary)' : 'none',
              border: 'none',
              fontWeight: activeGender === 'Women' ? 700 : 500,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textAlign: 'left'
            }}
          >
            <span>👠 Women’s Shoes & Juttis (IND 3-9)</span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/kids-wear');
              if (onSelectGender) onSelectGender('Kids');
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.55rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: activeGender === 'Kids' ? 'var(--bg-tertiary)' : 'none',
              border: 'none',
              fontWeight: activeGender === 'Kids' ? 700 : 500,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textAlign: 'left'
            }}
          >
            <span>👟 Kids’ Footwear (IND 1-5)</span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSizeGuide(activeGender === 'Women' ? 'Women' : 'Men');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.55rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'none',
              border: 'none',
              fontWeight: 600,
              color: 'var(--accent-sage)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textAlign: 'left'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Ruler size={16} />
              <span>Indian Foot Size Calculator</span>
            </span>
            <ChevronRight size={14} style={{ color: 'var(--accent-sage)' }} />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/about');
              if (onOpenStory) onOpenStory();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.55rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'none',
              border: 'none',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textAlign: 'left'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Compass size={16} />
              <span>Our 1998 Journey & Heritage</span>
            </span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        {/* Direct Contact Shri Manak Kothari Footer */}
        <div style={{ padding: '0.85rem 1rem', background: '#F8F6F1', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>
            Direct Shoemaker Assistance
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="btn btn-sage"
              style={{ flex: 1, padding: '0.55rem', fontSize: '0.78rem', justifyContent: 'center' }}
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCall}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.55rem', fontSize: '0.78rem', justifyContent: 'center' }}
            >
              <Phone size={15} />
              <span>Call Store</span>
            </button>
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
            Kothari Footwear • Idar, Gujarat • Phone: +91 94276 44222
          </p>
        </div>
      </div>
    </div>
  );
};
