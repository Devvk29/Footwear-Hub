import React from 'react';
import { ProductCard } from './ProductCard';
import {
  SlidersHorizontal,
  Ruler,
  MessageCircle,
  Leaf,
  ShieldCheck,
  Heart,
  ArrowRight
} from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';

export const ProductGrid = ({
  products,
  sortBy,
  onChangeSortBy,
  onQuickView,
  onOpenCheckout,
  onResetFilters,
  onOpenSizeGuide,
  onOpenStory
}) => {
  const handleWhatsApp = () => {
    const text = encodeURIComponent("Namaste Shri Manak Kothari ji! I would like to get custom shoe fitting advice.");
    window.open(`https://wa.me/${STORE_INFO.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div>
      {/* Grid Header, Sorting & Mobile 2-Card Slidebar Mode Switcher */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{products.length}</strong> authentic pairs <span className="hide-on-small-mobile">(₹599 to ₹3,000 • Buy 2 Get 10%, Buy 3+ Get 15% Instant OFF)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onChangeSortBy(e.target.value)}
              style={{
                padding: '0.4rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.78125rem',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Featured & Best</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="new">New Releases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Shoes - 100% Clean Footwear Grid */}
      {products.length > 0 ? (
        <div className="products-grid-container">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
              onOpenCheckout={onOpenCheckout}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            👞
          </div>
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              No Footwear Matches Your Filters
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '400px' }}>
              All our footwear is under ₹3,000. Try adjusting your size or category filter to see more pairs.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.8125rem' }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
