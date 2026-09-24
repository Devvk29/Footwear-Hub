import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { PRODUCTS } from '../../data/products';
import { Heart, X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistModal = ({ isOpen, onClose, onQuickView }) => {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const wishlistedProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ width: '100%', maxWidth: '680px', padding: '1.75rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} style={{ color: 'var(--accent-tan)' }} fill="currentColor" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Saved Wishlist ({wishlistedProducts.length})
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

        {/* Wishlist Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {wishlistedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <Heart size={36} style={{ color: 'var(--text-muted)' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Saved Shoes</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Tap the heart icon on any footwear pair to save it here for later.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
                style={{ fontSize: '0.8125rem', padding: '0.55rem 1.15rem', marginTop: '0.5rem' }}
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
                <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#EAE4DC', flexShrink: 0 }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1 }}>
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
                      addToCart(p, p.sizes[0], p.colors?.[0], 1);
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    <ShoppingBag size={14} />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(p.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '6px'
                    }}
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
