import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Ruler, User, FileText, Compass, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MobileNav = ({
  activeGender,
  onSelectGender,
  onOpenSizeGuide,
  onOpenStory,
  onOpenOrders
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount, setIsCartOpen } = useCart();
  const { user, isLoggedIn, openAuthModal } = useAuth();

  const isMenActive = location.pathname === '/mens-wear' || (location.pathname === '/' && activeGender === 'Men');
  const isWomenActive = location.pathname === '/womens-wear' || (location.pathname === '/' && activeGender === 'Women');
  const isOrdersActive = location.pathname === '/orders' || location.pathname.startsWith('/invoice');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0.45rem 0.2rem calc(0.45rem + env(safe-area-inset-bottom, 0px))',
        zIndex: 100,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)'
      }}
      className="mobile-bottom-nav"
    >
      {/* Men's Shoes */}
      <button
        type="button"
        onClick={() => {
          navigate('/mens-wear');
          if (onSelectGender) onSelectGender('Men');
        }}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isMenActive ? 'var(--accent-charcoal)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: isMenActive ? 700 : 500,
          cursor: 'pointer',
          padding: '2px'
        }}
      >
        <span style={{ fontSize: '1.05rem' }}>👞</span>
        <span>Men's Wear</span>
      </button>

      {/* Women's Wear */}
      <button
        type="button"
        onClick={() => {
          navigate('/womens-wear');
          if (onSelectGender) onSelectGender('Women');
        }}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isWomenActive ? 'var(--accent-charcoal)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: isWomenActive ? 700 : 500,
          cursor: 'pointer',
          padding: '2px'
        }}
      >
        <span style={{ fontSize: '1.05rem' }}>👠</span>
        <span>Women's Wear</span>
      </button>

      {/* Cart */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: 'var(--accent-charcoal)',
          fontSize: '0.68rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '2px'
        }}
      >
        <ShoppingBag size={18} />
        <span>Cart</span>
        {totalCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '6px',
            background: 'var(--accent-sage)',
            color: '#FFF',
            fontSize: '0.6rem',
            fontWeight: 700,
            borderRadius: '50%',
            width: '15px',
            height: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {totalCount}
          </span>
        )}
      </button>

      {/* Invoices & Orders */}
      <button
        type="button"
        onClick={() => {
          navigate('/orders');
          if (onOpenOrders) onOpenOrders();
        }}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isOrdersActive ? 'var(--accent-charcoal)' : 'var(--accent-sage)',
          fontSize: '0.68rem',
          fontWeight: 700,
          cursor: 'pointer',
          padding: '2px'
        }}
        title="View Official Invoices & Bills"
      >
        <FileText size={18} />
        <span>Invoices</span>
      </button>

      {/* Login / Sign In / Account Profile */}
      <button
        type="button"
        onClick={() => openAuthModal(isLoggedIn ? 'profile' : 'login')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isLoggedIn ? 'var(--accent-sage)' : 'var(--text-primary)',
          fontSize: '0.68rem',
          fontWeight: 700,
          cursor: 'pointer',
          padding: '2px'
        }}
        title={isLoggedIn ? 'Your Account & Profile' : 'Sign In / Register'}
      >
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: isLoggedIn ? 'var(--accent-sage-light)' : 'var(--accent-charcoal)',
          color: isLoggedIn ? 'var(--accent-sage)' : '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.65rem',
          fontWeight: 700
        }}>
          {isLoggedIn ? (user?.name?.[0]?.toUpperCase() || '✓') : <User size={12} />}
        </div>
        <span>{isLoggedIn ? (user?.name?.split(' ')[0] || 'Profile') : 'Sign In'}</span>
      </button>

      <style>{`
        @media (min-width: 900px) {
          .mobile-bottom-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
};
