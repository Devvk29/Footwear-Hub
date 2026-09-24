import React, { useState, useRef } from 'react';
import { ProductCard } from './ProductCard';
import {
  Sparkles,
  SlidersHorizontal,
  Ruler,
  MessageCircle,
  Leaf,
  ShieldCheck,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Columns2,
  Square
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
  const [viewMode, setViewMode] = useState('grid2');
  const sliderRef = useRef(null);

  // Mouse Dragging State for Slidebar
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Namaste Shri Manak Kothari ji! I would like to get custom shoe fitting advice.");
    window.open(`https://wa.me/${STORE_INFO.contact.whatsapp}?text=${text}`, '_blank');
  };

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
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
          
          {/* Layout / Slidebar Switcher for Mobile & Desktop */}
          <div className="layout-mode-selector" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid2')}
              style={{
                background: viewMode === 'grid2' ? 'var(--accent-charcoal)' : 'transparent',
                color: viewMode === 'grid2' ? '#FFF' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.72rem',
                fontWeight: 600
              }}
              title="2-Card Grid"
            >
              <Columns2 size={13} />
              <span>2 Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('slider')}
              style={{
                background: viewMode === 'slider' ? 'var(--accent-charcoal)' : 'transparent',
                color: viewMode === 'slider' ? '#FFF' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.72rem',
                fontWeight: 600
              }}
              title="2-Card Slidebar / Carousel"
            >
              <Sparkles size={13} />
              <span>Slidebar</span>
            </button>
          </div>

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

      {/* Grid of Shoes or 2-Card Horizontal Slidebar */}
      {products.length > 0 ? (
        viewMode === 'slider' ? (
          /* Horizontal 2-Card Slidebar with Left/Right Touch Controls */
          <div style={{ position: 'relative' }}>
            {/* Slider Navigation Arrows */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-sage)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>👆 Drag / swipe left-right or use arrows (2 Cards view)</span>
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={slideLeft}
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #D4A373',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#111827',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                  title="Slide Left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={slideRight}
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #D4A373',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#111827',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                  title="Slide Right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Slidebar Shelf Container */}
            <div
              ref={sliderRef}
              className="shoes-slidebar-shelf"
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
            >
              {products.map((p) => (
                <div key={p.id} className="shoes-slidebar-item">
                  <ProductCard
                    product={p}
                    onQuickView={onQuickView}
                    onOpenCheckout={onOpenCheckout}
                    viewMode="slider"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Standard 2-Card Grid View - 100% Clean Footwear Grid */
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
        )
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
