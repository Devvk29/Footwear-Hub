import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Heart, ShoppingBag, Zap, Ruler, Check, Truck, RotateCcw, Flame, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getProductStockForSize, INITIAL_PRODUCTS } from '../../data/products';
import { getColorHex } from '../../utils/colorUtils';

export const QuickViewModal = ({ product, isOpen, onClose, onOpenSizeGuide, onOpenCheckout }) => {
  const { addToCart, buyNow } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(8);
  const [selectedColor, setSelectedColor] = useState('Standard');
  const [currentImage, setCurrentImage] = useState('');

  // Helper to reliably find the specific color photo
  const getProductColorImage = (prod, colorName, index) => {
    if (!prod) return '';
    const base = INITIAL_PRODUCTS.find(p => p.id === prod.id);
    
    // 1. Direct colorImages match on active product
    if (prod.colorImages && prod.colorImages[colorName]) {
      return prod.colorImages[colorName];
    }
    // 2. Custom gallery matching index
    if (prod.gallery && prod.gallery.length > index && prod.gallery[index]) {
      return prod.gallery[index];
    }
    // 3. Custom main image
    if (prod.image) {
      return prod.image;
    }
    // 4. Fallback to INITIAL_PRODUCTS colorImages catalog dictionary
    if (base && base.colorImages && base.colorImages[colorName]) {
      return base.colorImages[colorName];
    }
    // 5. Fallback gallery matching index
    if (base && base.gallery && base.gallery.length > index && base.gallery[index]) {
      return base.gallery[index];
    }
    return (base && base.image) || '';
  };

  // Sync state when product changes
  useEffect(() => {
    if (product) {
      const initSize = product.sizes ? product.sizes[0] : 8;
      const initColor = product.initialColor || (product.colors ? product.colors[0] : 'Standard');
      const initIdx = product.colors ? product.colors.indexOf(initColor) : 0;
      setSelectedSize(initSize);
      setSelectedColor(initColor);
      const matchedImg = getProductColorImage(product, initColor, initIdx >= 0 ? initIdx : 0);
      setCurrentImage(matchedImg);
    }
  }, [product]);

  // Lock background body scroll to prevent page jumping down
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Support phone & browser hardware Back button so pressing Back closes quick-view without leaving the site
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ kfModal: 'quickview' }, '');
      const handlePopState = () => {
        onClose();
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const activeImg = currentImage || product.image;
  const wish = isWishlisted(product.id);

  const handleSelectColor = (colorName, index) => {
    setSelectedColor(colorName);
    const resolvedImg = getProductColorImage(product, colorName, index);
    setCurrentImage(resolvedImg);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    onClose();
  };

  const handleBuyNow = () => {
    onClose();
    buyNow(product, selectedSize, selectedColor, () => {
      if (onOpenCheckout) onOpenCheckout();
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '0.5rem', overflowY: 'auto' }}>
      <div
        className="modal-card quick-view-card"
        style={{
          width: '100%',
          maxWidth: '840px',
          padding: '0',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          margin: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            zIndex: 20,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <X size={18} />
        </button>

        <div className="quick-view-grid">
          {/* Left: Dynamic Color-Matched Image & Showcase */}
          <div style={{ background: '#F4EFEA', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{
              width: '100%',
              height: '280px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#EAE4DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <img
                key={activeImg}
                src={activeImg}
                alt={`${product.name} - ${selectedColor}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'fadeIn 0.25s ease' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '0.6rem',
                left: '0.6rem',
                background: 'rgba(25, 24, 23, 0.82)',
                color: '#FFF',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                backdropFilter: 'blur(4px)'
              }}>
                Color: {selectedColor}
              </span>
            </div>

            {/* Side-by-Side Color Variant Thumbnails */}
            {product.colors && product.colors.length > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Color Variations ({product.colors.length}):
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
                  {product.colors.map((c, idx) => {
                    const thumbImg = getProductColorImage(product, c, idx);
                    const isSelected = selectedColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleSelectColor(c, idx)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.25rem',
                          background: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                          border: isSelected ? '2px solid var(--accent-tan)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.25rem',
                          cursor: 'pointer',
                          minWidth: '58px',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
                        }}
                      >
                        <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', background: '#EAE4DC' }}>
                          <img
                            src={thumbImg}
                            alt={c}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <span style={{ fontSize: '0.62rem', fontWeight: isSelected ? 700 : 600, color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', maxWidth: '52px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginTop: 'auto',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <Truck size={14} style={{ color: 'var(--accent-sage)' }} />
                <span>Express India Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <RotateCcw size={14} style={{ color: 'var(--accent-tan)' }} />
                <span>7-Day Easy Exchange</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Modern Tactile Size Selector */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Eco Badge & Gender */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge-eco">{product.ecoBadge}</span>
              <span className="badge-tan">{product.gender}’s {product.category}</span>
            </div>

            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                {product.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#D4A373' }}>
                  <Star size={15} fill="#D4A373" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{product.rating}</span>
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  ({product.reviewCount} verified ratings)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-sage)' }}>
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Multi-Pair Savings Banner */}
            <div style={{
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#92400E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>🎁 Special Multi-Pair Offer: Buy 2 Get 10% OFF • Buy 3+ Get 15% OFF</span>
              <span style={{ fontWeight: 800, color: '#B45309' }}>Auto-Applied</span>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {product.description}
            </p>

            {/* Colors with Instant Live Image Switching */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Choose Color: <span style={{ fontWeight: 600, color: 'var(--accent-tan)' }}>{selectedColor}</span>
                </span>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {product.colors.map((c, idx) => {
                    const isSelected = selectedColor === c;
                    const hex = getColorHex(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleSelectColor(c, idx)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: isSelected ? '2px solid #1C1917' : '1.5px solid var(--border-subtle)',
                          background: isSelected ? '#1C1917' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 3px 8px rgba(0,0,0,0.15)' : 'none',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <span style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: hex,
                          border: '1px solid rgba(0,0,0,0.15)',
                          flexShrink: 0
                        }} />
                        {isSelected && <Check size={13} style={{ color: '#D4A373' }} />}
                        <span>{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modern Workable Indian Size Selector */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Indian Size (IND / UK):
                  </span>
                  {getProductStockForSize(product, selectedSize) <= 3 && getProductStockForSize(product, selectedSize) > 0 && (
                    <span style={{ fontSize: '0.68rem', color: '#DC2626', fontWeight: 800, background: '#FEE2E2', padding: '1px 5px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Flame size={11} /> Only {getProductStockForSize(product, selectedSize)} pairs left!
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenSizeGuide(product.gender)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-sage)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Ruler size={13} />
                  <span>Size Guide</span>
                </button>
              </div>

              {/* Workable Tactile Size Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))', gap: '0.45rem' }}>
                {product.sizes.map((s) => {
                  const sStock = getProductStockForSize(product, s);
                  const isSoldOut = sStock === 0;
                  const isSelected = selectedSize === s;

                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.55rem 0.35rem',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #1C1917' : '1.5px solid var(--border-medium)',
                        background: isSelected ? '#1C1917' : (isSoldOut ? '#F5F5F4' : '#FFFFFF'),
                        color: isSelected ? '#FFFFFF' : (isSoldOut ? '#A8A29E' : 'var(--text-primary)'),
                        cursor: isSoldOut ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: isSelected ? '0 3px 10px rgba(28, 25, 23, 0.2)' : 'none',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        position: 'relative'
                      }}
                      title={isSoldOut ? `IND ${s} is sold out` : `IND ${s} - ${sStock} pairs in stock`}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                        IND {s}
                      </span>
                      <span style={{
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        marginTop: '1px',
                        color: isSelected ? '#D4A373' : (isSoldOut ? '#DC2626' : 'var(--text-muted)')
                      }}>
                        {isSoldOut ? 'Sold Out' : (sStock <= 3 ? `Few Left` : 'In Stock')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material & Sole Details */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.725rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem'
            }}>
              <div><strong>Upper Material:</strong> {product.material}</div>
              <div><strong>Sole Construction:</strong> {product.sole}</div>
              <div><strong>Occasion:</strong> {product.occasion}</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
              >
                <Zap size={16} />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                style={{
                  width: '44px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: wish ? 'var(--accent-tan-light)' : 'var(--bg-secondary)',
                  color: wish ? 'var(--accent-tan)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={wish ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={17} fill={wish ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
