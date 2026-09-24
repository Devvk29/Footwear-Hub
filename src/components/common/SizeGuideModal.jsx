import React, { useState, useEffect } from 'react';
import { X, Ruler, CheckCircle2, Footprints, Info } from 'lucide-react';
import { INDIAN_SIZE_CHART } from '../../data/products';

export const SizeGuideModal = ({ isOpen, onClose, defaultGender = 'Men' }) => {
  const [activeTab, setActiveTab] = useState(defaultGender);
  const [measuredCm, setMeasuredCm] = useState(activeTab === 'Men' ? 26.7 : 24.1);

  // Sync tab when defaultGender changes
  useEffect(() => {
    setActiveTab(defaultGender);
    setMeasuredCm(defaultGender === 'Men' ? 26.7 : 24.1);
  }, [defaultGender]);

  // Lock background body scroll
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentChart = INDIAN_SIZE_CHART[activeTab] || INDIAN_SIZE_CHART.Men;

  // Calculate recommended size from cm
  const findRecommendedSize = () => {
    let closest = currentChart[0];
    let minDiff = 999;
    for (const item of currentChart) {
      const diff = Math.abs(item.footLengthCm - measuredCm);
      if (diff < minDiff) {
        minDiff = diff;
        closest = item;
      }
    }
    return closest;
  };

  const rec = findRecommendedSize();

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '0.5rem' }}>
      <div
        className="modal-card"
        style={{ width: '100%', maxWidth: '680px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-sage)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <Ruler size={16} />
              <span>INDIAN SIZING STANDARDS (IND / UK)</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Foot Measurement & Size Guide
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              All our footwear is crafted according to standard Indian sizes (equivalent to UK sizing).
            </p>
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
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Gender Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('Men');
              setMeasuredCm(26.7);
            }}
            style={{
              flex: 1,
              padding: '0.6rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'Men' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'Men' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'Men' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Men's Sizing (IND 6 – 12)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('Women');
              setMeasuredCm(24.1);
            }}
            style={{
              flex: 1,
              padding: '0.6rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'Women' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'Women' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'Women' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Women's Sizing (IND 3 – 9)
          </button>
        </div>

        {/* Interactive Size Finder */}
        <div style={{
          background: 'var(--accent-sage-light)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(56, 89, 66, 0.2)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Footprints size={18} style={{ color: 'var(--accent-sage)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-sage)' }}>
                Foot Length Calculator:
              </span>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {measuredCm.toFixed(1)} cm
            </span>
          </div>

          <input
            type="range"
            min={activeTab === 'Men' ? 24.5 : 22.0}
            max={activeTab === 'Men' ? 30.5 : 28.0}
            step={0.1}
            value={measuredCm}
            onChange={(e) => setMeasuredCm(parseFloat(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--accent-sage)',
              cursor: 'pointer'
            }}
          />

          <div style={{
            marginTop: '0.85rem',
            padding: '0.75rem',
            background: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recommended Indian Standard Size:</p>
              <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-charcoal)' }}>
                IND / UK {rec.ind} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>(EU {rec.eu})</span>
              </p>
            </div>
            <div className="badge-eco">
              <CheckCircle2 size={13} />
              <span>Perfect Fit Assurance</span>
            </div>
          </div>
        </div>

        {/* Mobile Slide Hint */}
        <div className="mobile-only-slide-hint" style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem',
          fontSize: '0.72rem',
          color: '#6B7280',
          padding: '0.35rem 0.65rem',
          background: '#F3F4F6',
          borderRadius: '6px',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          <span>↔️ Slide table horizontally to view UK, EU, CM & Inches</span>
        </div>

        {/* Size Chart Table */}
        <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <table style={{ width: '100%', minWidth: '460px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--border-medium)', fontWeight: 600 }}>Indian / UK Size</th>
                <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--border-medium)', fontWeight: 600 }}>EU Size</th>
                <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--border-medium)', fontWeight: 600 }}>Foot Length (cm)</th>
                <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--border-medium)', fontWeight: 600 }}>Inches</th>
              </tr>
            </thead>
            <tbody>
              {currentChart.map((row) => {
                const isSelected = row.ind === rec.ind;
                return (
                  <tr
                    key={row.ind}
                    style={{
                      background: isSelected ? 'var(--accent-tan-light)' : 'transparent',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    <td style={{ padding: '0.6rem 0.85rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--accent-tan)' : 'inherit' }}>
                      IND {row.ind}
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem', color: 'var(--text-secondary)' }}>EU {row.eu}</td>
                    <td style={{ padding: '0.6rem 0.85rem', color: 'var(--text-secondary)' }}>{row.footLengthCm} cm</td>
                    <td style={{ padding: '0.6rem 0.85rem', color: 'var(--text-muted)' }}>{row.footLengthInches}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* How to measure footnote */}
        <div style={{ display: 'flex', gap: '0.65rem', padding: '0.85rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
          <Info size={18} style={{ color: 'var(--accent-charcoal)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <strong>How to measure your foot:</strong> Place a blank sheet of paper on the floor against a wall. Stand on it with your heel lightly touching the wall. Mark the tip of your longest toe with a pencil and measure the distance in cm with a ruler.
          </div>
        </div>
      </div>
    </div>
  );
};
