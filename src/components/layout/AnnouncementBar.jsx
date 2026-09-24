import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';

export const AnnouncementBar = ({ onOpenStory, onOpenAdmin }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #121110 0%, #201C1A 50%, #121110 100%)',
        color: '#E0DDD7',
        fontSize: '0.75rem',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        borderBottom: '1px solid rgba(212, 163, 115, 0.25)',
        userSelect: 'none'
      }}
    >
      <div className="marquee-track">
        <div className="marquee-content">
          {/* Item 1: Multi-Buy Offer */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#FFD166', fontWeight: 700 }}>
            <span>🎁 SPECIAL MULTI-PAIR OFFER:</span>
            <span style={{ color: '#FFF', fontWeight: 600 }}>Buy 2 Get 10% Instant OFF • Buy 3+ Get 15% Instant OFF (Auto-Applied in Cart!)</span>
          </span>
          <span style={{ margin: '0 1.25rem', opacity: 0.35 }}>|</span>

          {/* Item 2: Free Delivery */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#E0DDD7', fontWeight: 600 }}>
            <Truck size={13} style={{ color: '#D4A373' }} />
            <span>Free Express Delivery Across India on Orders Above ₹999</span>
          </span>
          <span style={{ margin: '0 1.25rem', opacity: 0.35 }}>|</span>

          {/* Item 3: Handcrafted Heritage */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#88B090', fontWeight: 700 }}>
            <ShieldCheck size={13} style={{ color: '#88B090' }} />
            <span>100% Genuine Handcrafted Footwear Guaranteed • {STORE_INFO.name} (Est. 1998)</span>
          </span>
          <span style={{ margin: '0 1.25rem', opacity: 0.35 }}>|</span>

          {/* Item 4: Direct Store Helpline */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#D4A373', fontWeight: 600 }}>
            <span>📍 Idar, Gujarat • 📞 Store Helpline: +91 94276 44222</span>
          </span>
          <span style={{ margin: '0 1.25rem', opacity: 0.35 }}>|</span>
        </div>

        {/* Duplicate content block for continuous seamless infinite loop */}
        <div className="marquee-content" aria-hidden="true">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#FFD166', fontWeight: 700 }}>
            <span>🎁 SPECIAL MULTI-PAIR OFFER:</span>
            <span style={{ color: '#FFF', fontWeight: 600 }}>Buy 2 Get 10% Instant OFF • Buy 3+ Get 15% Instant OFF (Auto-Applied in Cart!)</span>
          </span>
          <span style={{ margin: '0 1.25rem', opacity: 0.35 }}>|</span>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#E0DDD7', fontWeight: 600 }}>
            <Truck size={13} style={{ color: '#D4A373' }} />
            <span>Free Express Delivery Across India on Orders Above ₹999</span>
          </span>
          <span style={{ margin: '0 1.25rem', opacity: 0.35 }}>|</span>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#88B090', fontWeight: 700 }}>
            <ShieldCheck size={13} style={{ color: '#88B090' }} />
            <span>100% Genuine Handcrafted Footwear Guaranteed • {STORE_INFO.name} (Est. 1998)</span>
          </span>
          <span style={{ margin: '0 1.25rem', opacity: 0.35 }}>|</span>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#D4A373', fontWeight: 600 }}>
            <span>📍 Idar, Gujarat • 📞 Store Helpline: +91 94276 44222</span>
          </span>
          <span style={{ margin: '0 1.25rem', opacity: 0.35 }}>|</span>
        </div>
      </div>

      <style>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 26s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-content {
          display: flex;
          align-items: center;
          white-space: nowrap;
          flex-shrink: 0;
        }
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
