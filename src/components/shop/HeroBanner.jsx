import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HeroBanner = ({ onSelectGender, onOpenSizeGuide, onOpenStory, onOpenAdmin }) => {
  return (
    <section style={{
      background: 'radial-gradient(ellipse at 50% 0%, #F5EFE6 0%, #FAF8F5 70%)',
      padding: '3rem 0 2.25rem 0',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container-custom">
        <div style={{
          maxWidth: '780px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.15rem'
        }}>
          
          {/* Subtle Heritage Monogram Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(212, 163, 115, 0.12)',
            border: '1px solid rgba(212, 163, 115, 0.35)',
            color: '#8C5824',
            padding: '0.25rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.04em'
          }}>
            <Sparkles size={13} style={{ color: '#D4A373' }} />
            <span>EST. 1998 • IDAR, GUJARAT • OFFICIAL RETAIL</span>
          </div>

          {/* Clean Main Title */}
          <div>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em'
            }}>
              KOTHARI FOOTWEAR
            </h1>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              marginTop: '0.5rem',
              maxWidth: '620px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.55
            }}>
              Authentic Indian footwear curated by <strong>Shri Manak Kothari</strong>. Full-grain leather, wedding mojaris, and doctor-approved comfort in standard Indian sizes (₹599 – ₹3,000).
            </p>
          </div>

          {/* Luxury Compact Multi-Pair Offer Strip */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '0.4rem 1.15rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span style={{ color: 'var(--accent-tan)' }}>🎁 Special Multi-Pair Offer:</span>
            <span style={{ color: 'var(--accent-sage)' }}>Buy 2: 10% Instant OFF</span>
            <span style={{ color: 'var(--border-medium)' }}>•</span>
            <span style={{ color: '#B45309' }}>Buy 3+: 15% Instant OFF</span>
          </div>

          {/* Fast Navigation Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={() => onSelectGender('Men')}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.875rem',
                borderRadius: 'var(--radius-full)',
                background: '#1C1917',
                border: '1px solid #1C1917'
              }}
            >
              <span>Men’s Collection (IND 6–12)</span>
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={() => onSelectGender('Women')}
              className="btn btn-secondary"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.875rem',
                borderRadius: 'var(--radius-full)',
                background: '#FFFFFF',
                border: '1.5px solid var(--border-medium)'
              }}
            >
              <span>Women’s Collection (IND 3–9)</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Minimal 3-Pillar Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            paddingTop: '0.85rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--accent-sage)' }} />
              <span>100% Genuine Brands</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--accent-sage)' }} />
              <span>Standard Indian/UK Sizes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--accent-sage)' }} />
              <span>7-Day Doorstep Exchange</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
