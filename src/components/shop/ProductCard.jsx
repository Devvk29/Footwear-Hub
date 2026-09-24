import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Eye } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { INITIAL_PRODUCTS } from '../../data/products';
import { getColorHex } from '../../utils/colorUtils';

export const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const wish = isWishlisted(product.id);
  const baseProduct = INITIAL_PRODUCTS.find(p => p.id === product.id);

  // Compute active image based on selected color
  const activeColorName = product.colors && product.colors.length > 0 ? product.colors[selectedColorIdx] : null;
  const activeImage =
    (activeColorName && product.colorImages && product.colorImages[activeColorName]) ||
    (product.gallery && product.gallery[selectedColorIdx]) ||
    product.image ||
    (activeColorName && baseProduct && baseProduct.colorImages && baseProduct.colorImages[activeColorName]) ||
    (baseProduct && baseProduct.gallery && baseProduct.gallery[selectedColorIdx]) ||
    (baseProduct && baseProduct.image);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleQuickInspectClick = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView({ ...product, initialColor: activeColorName });
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div
      className="shoe-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Image Showcase with Mirror View Hover Lens */}
      <div className="shoe-image-wrap" style={{ position: 'relative', width: '100%', paddingTop: '85%', background: '#F3EFE9', overflow: 'hidden' }}>
        <img
          key={activeImage}
          src={activeImage}
          alt={`${product.name} - ${activeColorName || 'Default'}`}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)'
          }}
        />

        {/* Mirror View / Quick Inspect Lens Overlay on Cursor Hover */}
        <div className="shoe-mirror-overlay">
          <span className="shoe-mirror-btn" onClick={handleQuickInspectClick}>
            <Eye size={15} />
            <span>Quick Inspect</span>
          </span>
        </div>

        {/* Top Badges (Eco Badge + Wishlist) */}
        <div className="shoe-badge-container" style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', right: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'none', zIndex: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="badge-pill badge-eco-pill">
              {product.ecoBadge}
            </span>
          </div>

          {/* Wishlist Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="shoe-wishlist-btn"
            title={wish ? 'Saved in wishlist' : 'Save to wishlist'}
            style={{ pointerEvents: 'auto' }}
          >
            <Heart size={15} fill={wish ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div style={{ padding: '0.75rem 0.85rem 0.9rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 600 }}>{product.gender} • {product.category}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#D4A373' }}>
              <Star size={11} fill="#D4A373" />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.rating}</span>
            </div>
          </div>

          <h3 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, height: '2.6em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.name}
          </h3>
        </div>

        {/* Pricing & Interactive Color Variants Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.35rem' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onClick={(e) => e.stopPropagation()}>
              {product.colors.map((c, idx) => {
                const hex = getColorHex(c);
                const isSelected = selectedColorIdx === idx;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColorIdx(idx);
                    }}
                    onMouseEnter={() => setSelectedColorIdx(idx)}
                    title={c}
                    style={{
                      width: isSelected ? '18px' : '13px',
                      height: isSelected ? '18px' : '13px',
                      borderRadius: '50%',
                      border: isSelected ? '2px solid #1C1917' : '1.5px solid #D6CEBE',
                      background: hex,
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)',
                      outline: isSelected ? '2px solid rgba(212, 163, 115, 0.5)' : 'none',
                      outlineOffset: '1px'
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
