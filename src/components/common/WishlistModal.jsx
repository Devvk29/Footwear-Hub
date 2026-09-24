import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { INITIAL_PRODUCTS } from '../../data/products';
import { Heart, X, ShoppingBag, Trash2, ArrowLeft, Lock } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetUrl';

export const WishlistModal = ({ isOpen, onClose, onQuickView }) => {
  const { isLoggedIn, user, openAuthModal } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { products } = useDatabase();

  React.useEffect(() => {
    if (isOpen) {
      window.history.pushState({ kfModal: 'wishlist' }, '');
      const handlePopState = () => {
        onClose();
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allProductPool = products && products.length > 0 ? products : INITIAL_PRODUCTS;
  const wishlistedProducts = (isLoggedIn && user)
    ? allProductPool.filter(p => wishlistIds.includes(p.id))
    : [];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-card"
        style={{ width: '100%', maxWidth: '680px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                minWidth: '44px',
                minHeight: '44px',
                padding: '0 0.5rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-secondary)'
              }}
              title="Close Wishlist"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Heart size={20} style={{ color: '#E11D48' }} fill="#E11D48" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Saved Wishlist ({isLoggedIn ? wishlistedProducts.length : 0})
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* State 1: When Signed Out */}
        {!isLoggedIn || !user ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-tan)'
            }}>
              <Lock size={26} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Please sign in to see your wishlist
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: 0, lineHeight: 1.5 }}>
              Your wishlist is securely saved to your account. Sign in or register to view and save your favorite footwear.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                openAuthModal('wishlist');
              }}
              className="btn btn-primary"
              style={{ minHeight: '44px', padding: '0.65rem 1.75rem', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 700 }}
            >
              Sign In to Your Account
            </button>
          </div>
        ) : (
          /* State 2: When Signed In */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '60vh', overflowY: 'auto' }}>
            {wishlistedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <Heart size={36} style={{ color: 'var(--text-muted)' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Saved Shoes</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Tap the heart icon on any footwear pair to save it to your personal wishlist.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-primary"
                  style={{ minHeight: '44px', fontSize: '0.8125rem', padding: '0.55rem 1.15rem', marginTop: '0.5rem' }}
                >
                  Explore Footwear
                </button>
              </div>
            ) : (
              wishlistedProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-primary)'
                  }}
                >
                  <div
                    onClick={() => {
                      onClose();
                      if (onQuickView) onQuickView(p);
                    }}
                    style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#EAE4DC', flexShrink: 0, cursor: 'pointer' }}
                  >
                    <img src={getAssetUrl(p.image)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div
                    onClick={() => {
                      onClose();
                      if (onQuickView) onQuickView(p);
                    }}
                    style={{ flex: 1, cursor: 'pointer' }}
                  >
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.gender} • {p.category}</p>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</h5>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--accent-charcoal)', marginTop: '2px' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const size = (p.sizes && p.sizes[0]) || 8;
                        const color = (p.colors && p.colors[0]) || 'Standard';
                        addToCart(p, size, color, 1);
                      }}
                      className="btn btn-secondary"
                      style={{ minHeight: '44px', padding: '0.45rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      <ShoppingBag size={14} />
                      <span>Add to Bag</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(p.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '6px',
                        minWidth: '44px',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
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
