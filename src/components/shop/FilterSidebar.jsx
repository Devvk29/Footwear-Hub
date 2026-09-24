import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, Ruler, Check, Footprints } from 'lucide-react';
import { OCCASIONS_LIST, INDIAN_SIZE_CHART } from '../../data/products';

export const FilterSidebar = ({
  activeGender,
  selectedSizes,
  onToggleSize,
  priceRange,
  onChangePriceRange,
  selectedOccasions,
  onToggleOccasion,
  minRating,
  onChangeMinRating,
  inStockOnly,
  onToggleInStockOnly,
  onResetFilters,
  onOpenSizeGuide
}) => {
  const [guideTab, setGuideTab] = useState(activeGender === 'Women' ? 'Women' : 'Men');

  useEffect(() => {
    if (activeGender === 'Women') setGuideTab('Women');
    else if (activeGender === 'Men') setGuideTab('Men');
  }, [activeGender]);

  const availableSizes = activeGender === 'Women'
    ? [3, 4, 5, 6, 7, 8, 9]
    : activeGender === 'Men'
    ? [6, 7, 8, 9, 10, 11, 12]
    : [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    priceRange < 2000 ||
    selectedOccasions.length > 0 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.35rem'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
          <Filter size={16} />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-sage)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Indian Sizes Filter */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Indian Size (IND / UK)
          </label>
          <button
            type="button"
            onClick={() => onOpenSizeGuide(activeGender === 'Women' ? 'Women' : 'Men')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-sage)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Size Guide
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {availableSizes.map((s) => {
            const isSelected = selectedSizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => onToggleSize(s)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: isSelected ? '1.5px solid var(--accent-charcoal)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--accent-charcoal)' : 'var(--bg-primary)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Range Slider (₹599 - ₹3,000) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Max Budget
          </label>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-sage)' }}>
            ₹{priceRange.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={599}
          max={3000}
          step={100}
          value={priceRange}
          onChange={(e) => onChangePriceRange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent-sage)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          <span>₹599</span>
          <span>Max ₹3,000</span>
        </div>
      </div>

      {/* Occasions */}
      <div>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Occasion
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {OCCASIONS_LIST.map((occ) => {
            const isChecked = selectedOccasions.includes(occ);
            return (
              <label
                key={occ}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleOccasion(occ)}
                  style={{ accentColor: 'var(--accent-sage)', width: '15px', height: '15px' }}
                />
                <span>{occ}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Customer Rating
        </label>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {[0, 4.5, 4.8].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => onChangeMinRating(rate)}
              style={{
                flex: 1,
                padding: '0.4rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: minRating === rate ? '1.5px solid var(--accent-charcoal)' : '1px solid var(--border-subtle)',
                background: minRating === rate ? 'var(--accent-charcoal)' : 'var(--bg-primary)',
                color: minRating === rate ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {rate === 0 ? 'All' : `${rate}★+`}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStockOnly(e.target.checked)}
            style={{ accentColor: 'var(--accent-sage)', width: '16px', height: '16px' }}
          />
        </label>
      </div>

      {/* Indian Footwear Size Guidance Chart (Mobile & Desktop Compatible) */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '0.95rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
            <Ruler size={15} style={{ color: 'var(--accent-sage)' }} />
            <span>Size Guidance Chart</span>
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-sage)', background: 'var(--accent-sage-light)', padding: '2px 6px', borderRadius: '4px' }}>
            IND = UK
          </span>
        </div>

        {/* Tab switch for Men vs Women */}
        <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '2px', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setGuideTab('Men')}
            style={{
              flex: 1,
              padding: '0.35rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: guideTab === 'Men' ? 800 : 500,
              background: guideTab === 'Men' ? '#FFFFFF' : 'transparent',
              color: guideTab === 'Men' ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: guideTab === 'Men' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Men (IND 6-12)
          </button>
          <button
            type="button"
            onClick={() => setGuideTab('Women')}
            style={{
              flex: 1,
              padding: '0.35rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: guideTab === 'Women' ? 800 : 500,
              background: guideTab === 'Women' ? '#FFFFFF' : 'transparent',
              color: guideTab === 'Women' ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: guideTab === 'Women' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Women (IND 3-9)
          </button>
        </div>

        {/* Quick Size Matrix Table (Horizontal Slideable on Mobile) */}
        <div style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: 'var(--bg-primary)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          padding: '0.35rem'
        }}>
          <table style={{ width: '100%', minWidth: '210px', borderCollapse: 'collapse', fontSize: '0.72rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.25rem 0.35rem', fontWeight: 700 }}>IND</th>
                <th style={{ padding: '0.25rem 0.35rem', fontWeight: 600 }}>EU</th>
                <th style={{ padding: '0.25rem 0.35rem', fontWeight: 600 }}>Foot Length</th>
              </tr>
            </thead>
            <tbody>
              {(INDIAN_SIZE_CHART[guideTab] || INDIAN_SIZE_CHART.Men).map((item) => (
                <tr
                  key={item.ind}
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.03)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onOpenSizeGuide && onOpenSizeGuide(guideTab)}
                  title="Click to view full measurement guide"
                >
                  <td style={{ padding: '0.28rem 0.35rem', fontWeight: 800, color: 'var(--accent-sage)' }}>
                    IND {item.ind}
                  </td>
                  <td style={{ padding: '0.28rem 0.35rem', color: 'var(--text-secondary)' }}>
                    EU {item.eu}
                  </td>
                  <td style={{ padding: '0.28rem 0.35rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {item.footLengthCm} cm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() => onOpenSizeGuide && onOpenSizeGuide(guideTab)}
          style={{
            width: '100%',
            padding: '0.45rem',
            background: 'var(--accent-sage-light)',
            color: 'var(--accent-sage)',
            border: '1px solid rgba(56,89,66,0.25)',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem'
          }}
        >
          <Footprints size={13} />
          <span>Interactive Foot Calculator</span>
        </button>

        <p style={{ fontSize: '0.67rem', color: 'var(--text-muted)', lineHeight: 1.35, margin: 0 }}>
          💡 <strong>Indian Fit Advice:</strong> Indian sizes match standard UK sizing. If you have broad feet or fall between sizes, select 1 size up.
        </p>
      </div>

    </div>
  );
};
