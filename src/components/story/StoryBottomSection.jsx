import React from 'react';
import { Award, Compass, HeartHandshake, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';

export const StoryBottomSection = ({ onOpenFullStory }) => {
  return (
    <section style={{ padding: '3rem 0', background: '#FFFFFF', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container-custom">
        <div style={{
          background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 1.5rem',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid #44403C'
        }}>
          {/* Subtle Decorative Golden Border */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #D4A373 0%, #F4E8DB 50%, #D4A373 100%)'
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            
            {/* Story Synopsis */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(212, 163, 115, 0.15)', border: '1px solid rgba(212, 163, 115, 0.3)', color: '#F6E6D3', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                <Compass size={13} style={{ color: '#D4A373' }} />
                <span>Our Humble Journey • Est. 1998</span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25, marginBottom: '0.65rem' }}>
                28 Years of Honest Footwear in Idar, Gujarat
              </h3>

              <p style={{ fontSize: '0.85rem', color: '#D6D3D1', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Founded in 1998 by <strong style={{ color: '#F6E6D3' }}>Shri Manak Kothari</strong>, our family-run store has served generations of families across Sabarkantha with durable, authentic daily footwear priced fairly between <span style={{ color: '#D4A373', fontWeight: 700 }}>₹599 and ₹3,000</span>.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={onOpenFullStory}
                  className="btn"
                  style={{
                    background: '#D4A373',
                    color: '#1C1917',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  Read Father's Full Story & Heritage
                </button>
              </div>
            </div>

            {/* 3 Pillars of Trust (Compact Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Award size={20} style={{ color: '#D4A373', marginBottom: '0.35rem' }} />
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF' }}>100% Authentic</h4>
                <p style={{ fontSize: '0.7rem', color: '#A8A29E', marginTop: '0.2rem' }}>Direct official sourcing from Paragon, VKC & master artisans.</p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <ShieldCheck size={20} style={{ color: '#D4A373', marginBottom: '0.35rem' }} />
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF' }}>Fair Pricing</h4>
                <p style={{ fontSize: '0.7rem', color: '#A8A29E', marginTop: '0.2rem' }}>Transparent pricing ₹599 to ₹3,000 without artificial markups.</p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <MapPin size={20} style={{ color: '#D4A373', marginBottom: '0.35rem' }} />
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF' }}>Idar Storefront</h4>
                <p style={{ fontSize: '0.7rem', color: '#A8A29E', marginTop: '0.2rem' }}>Main Bazaar, Opp. Tower, Idar 383430, Gujarat.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
