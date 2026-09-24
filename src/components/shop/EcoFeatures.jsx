import React from 'react';
import { Leaf, Hammer, ShieldCheck, HeartHandshake } from 'lucide-react';

export const EcoFeatures = () => {
  const features = [
    {
      icon: Leaf,
      title: "Tree-Bark Vegetable Tanning",
      desc: "Tanned using natural mimosa and chestnut extracts, preventing toxic chromium from entering our rivers and groundwater."
    },
    {
      icon: Hammer,
      title: "Resolable & Long-Lasting",
      desc: "Engineered with stitch-down welted soles. When worn out, they can be easily resoled, lasting you 5 to 10+ years."
    },
    {
      icon: ShieldCheck,
      title: "Zero Plastic Packaging",
      desc: "Delivered in 100% recycled unbleached cardboard boxes with reusable pure cotton dust bags and paper tapes."
    },
    {
      icon: HeartHandshake,
      title: "Direct Artisan Empowerment",
      desc: "Every pair supports multi-generation master shoemakers in Kolhapur, Agra, and Jaipur with ethical living wages."
    }
  ];

  return (
    <section style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '3.5rem 0',
      margin: '3.5rem 0'
    }}>
      <div className="container-custom">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
          <span className="badge-eco" style={{ marginBottom: '0.5rem' }}>
            IDAR HERITAGE • SINCE 1985
          </span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            The Kothari Heritage Craft Promise
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.6 }}>
            Curated personally by Shri Manak Kothari. We blend multi-generation Indian artisanal shoemaking with modern ergonomic cushioning for a lifetime of comfortable steps.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-sage-light)',
                  color: 'var(--accent-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {f.title}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
