import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { INDIAN_SIZE_CHART } from '../../data/products';

export const SizeAdvisorModal = ({ isOpen, onClose, onSelectSize, defaultGender = 'Men' }) => {
  const [gender, setGender] = useState(defaultGender);
  const [footCm, setFootCm] = useState('26.5');
  const [footWidth, setFootWidth] = useState('standard'); // 'narrow', 'standard', 'broad'
  const [footType, setFootType] = useState('regular'); // 'regular', 'high_arch', 'flat'
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const chart = INDIAN_SIZE_CHART[gender] || INDIAN_SIZE_CHART.Men;
  const numCm = parseFloat(footCm) || 26.0;

  // Find matching size
  let matchedEntry = chart[0];
  for (let i = 0; i < chart.length; i++) {
    if (numCm <= chart[i].footLengthCm + 0.4) {
      matchedEntry = chart[i];
      break;
    }
    matchedEntry = chart[chart.length - 1];
  }

  // Adjust for broad foot or high arch
  let recommendedInd = matchedEntry.ind;
  let adviceNotes = [];

  if (footWidth === 'broad') {
    if (recommendedInd < (gender === 'Women' ? 9 : 12)) {
      recommendedInd += 1;
      adviceNotes.push('Broad Feet: Sized up by +1 for relaxed side comfort without toe pinching.');
    } else {
      adviceNotes.push('Broad Feet: Loosen laces/straps or choose genuine leather that naturally stretches.');
    }
  }

  if (footType === 'high_arch') {
    adviceNotes.push('High Arch: Recommended Doctor Ortho arch-support or cushioned dual-strap sandals.');
  }

  const handleSaveProfile = () => {
    const profile = {
      gender,
      footLengthCm: numCm,
      footWidth,
      recommendedSize: recommendedInd,
      savedAt: Date.now()
    };
    try {
      localStorage.setItem('kf_user_size_profile', JSON.stringify(profile));
      window.dispatchEvent(new CustomEvent('kf_size_profile_updated', { detail: profile }));
    } catch {}

    setSavedSuccess(true);
    if (onSelectSize) onSelectSize(recommendedInd);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 99999 }}>
      <div
        className="modal-card"
        style={{ width: '100%', maxWidth: '640px', padding: '1.5rem', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent-sage-light)', color: 'var(--accent-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ruler size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Shri Manak's Foot Size & Fit Advisor
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Master cobbler Indian sizing algorithm for zero-pinch comfort
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Gender Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setGender('Men')}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: gender === 'Men' ? '2px solid var(--accent-sage)' : '1px solid var(--border-subtle)',
              background: gender === 'Men' ? 'var(--accent-sage-light)' : 'var(--bg-primary)',
              color: gender === 'Men' ? 'var(--accent-sage)' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            👞 Men's Sizing (IND 6 – 12)
          </button>
          <button
            type="button"
            onClick={() => setGender('Women')}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: gender === 'Women' ? '2px solid var(--accent-tan)' : '1px solid var(--border-subtle)',
              background: gender === 'Women' ? '#FDF6ED' : 'var(--bg-primary)',
              color: gender === 'Women' ? 'var(--accent-tan)' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            👠 Women's Sizing (IND 3 – 9)
          </button>
        </div>

        {/* Foot Measurement Interactive Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
          
          {/* Step 1: Foot Length Slider / Input */}
          <div style={{ background: '#FAF7F2', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                1. Heel-to-Toe Length in Centimeters:
              </label>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-sage)', background: '#FFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                {footCm} cm
              </span>
            </div>
            
            <input
              type="range"
              min={gender === 'Women' ? 22.0 : 24.5}
              max={gender === 'Women' ? 28.0 : 30.5}
              step="0.1"
              value={footCm}
              onChange={(e) => setFootCm(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-sage)', cursor: 'pointer' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <span>{gender === 'Women' ? '22.0 cm (Size 3)' : '24.5 cm (Size 6)'}</span>
              <span>{gender === 'Women' ? '28.0 cm (Size 9)' : '30.5 cm (Size 12)'}</span>
            </div>
          </div>

          {/* Step 2: Foot Width & Shape */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                2. Foot Width Profile:
              </label>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {[
                  { id: 'standard', label: 'Standard' },
                  { id: 'broad', label: 'Broad / Wide' },
                  { id: 'narrow', label: 'Narrow' }
                ].map(w => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setFootWidth(w.id)}
                    style={{
                      flex: 1,
                      padding: '0.45rem 0.35rem',
                      borderRadius: 'var(--radius-sm)',
                      border: footWidth === w.id ? '1.5px solid var(--accent-sage)' : '1px solid var(--border-subtle)',
                      background: footWidth === w.id ? 'var(--accent-sage-light)' : '#FFF',
                      color: footWidth === w.id ? 'var(--accent-sage)' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                3. Foot Arch Type:
              </label>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {[
                  { id: 'regular', label: 'Normal Arch' },
                  { id: 'high_arch', label: 'High Arch' },
                  { id: 'flat', label: 'Flat Feet' }
                ].map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setFootType(a.id)}
                    style={{
                      flex: 1,
                      padding: '0.45rem 0.35rem',
                      borderRadius: 'var(--radius-sm)',
                      border: footType === a.id ? '1.5px solid var(--accent-sage)' : '1px solid var(--border-subtle)',
                      background: footType === a.id ? 'var(--accent-sage-light)' : '#FFF',
                      color: footType === a.id ? 'var(--accent-sage)' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Calculated Recommendation Showcase Card */}
        <div style={{
          background: 'linear-gradient(135deg, #2D4734 0%, #1E3324 100%)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 15px rgba(45, 71, 52, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#D4A373', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
                Recommended Indian Size
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '2px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1, color: '#FFF' }}>
                  IND {recommendedInd}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#D4ECD5', fontWeight: 600 }}>
                  (UK {recommendedInd} • EU {matchedEntry.eu})
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: '#BDB6AB' }}>Foot Length:</span>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>
                {footCm} cm / {matchedEntry.footLengthInches}
              </p>
            </div>
          </div>

          {adviceNotes.length > 0 && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem', color: '#F6E6D3', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {adviceNotes.map((note, idx) => (
                <p key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>💡</span>
                  <span>{note}</span>
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Action Button: Save My Size Profile */}
        <button
          type="button"
          onClick={handleSaveProfile}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 800,
            justifyContent: 'center',
            background: savedSuccess ? '#34A853' : 'linear-gradient(135deg, #1C1917 0%, #385942 100%)',
            border: '1px solid #D4A373'
          }}
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 size={18} />
              <span>Size Profile Saved (IND {recommendedInd})!</span>
            </>
          ) : (
            <>
              <Sparkles size={18} style={{ color: '#D4A373' }} />
              <span>Apply & Save My Size Profile (IND {recommendedInd})</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
