import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { STORE_INFO } from '../../data/storeInfo';
import { Leaf, Phone, MapPin, Clock, MessageCircle, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer = ({ onOpenSizeGuide, onOpenStory, onSelectGender, onOpenAdmin }) => {
  const navigate = useNavigate();
  const { openAuthModal, isOwner } = useAuth();

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(`Namaste Shri Manak Kothari ji! I would like to enquire about footwear sizes at Kothari Footwear.`);
    window.open(`https://wa.me/${STORE_INFO.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <footer style={{ background: 'var(--bg-dark)', color: '#EDE8E1', paddingTop: '3.5rem', paddingBottom: '5rem', marginTop: '4rem', borderTop: '1px solid #332F2B' }}>
      <div className="container-custom">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Col 1: Brand & Legacy */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-sage)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18c0-3.5 2.5-6 6-6 4 0 5-3 8-3a4 4 0 0 1 4 4v5H3z"/><path d="M3 18v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/></svg>
              </div>
              <div>
                <h4 style={{ color: '#FFF', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.03em' }}>{STORE_INFO.name}</h4>
                <p style={{ color: '#A69E94', fontSize: '0.75rem' }}>Owner: {STORE_INFO.ownerName} (Est. 1998)</p>
              </div>
            </div>
            <p style={{ color: '#BDB6AB', fontSize: '0.8125rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Founded in 1998 as <em>Kothari Shoes</em> in Idar, Gujarat. Built with 28+ years of craftsmanship, honest Indian sizing, and doctor-approved arch comfort.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#252F27', color: '#8FBC99', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', border: '1px solid #394A3D' }}>
              <Leaf size={14} />
              <span>100% Plastic-Free Packaging</span>
            </div>
          </div>

          {/* Col 2: Collections & Sizing */}
          <div>
            <h5 style={{ color: '#FFF', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Indian Standard Collections
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8125rem', color: '#BDB6AB' }}>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/mens-wear');
                    if (onSelectGender) onSelectGender('Men');
                  }}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Men's Handcrafted Leather Oxfords (IND 6–12)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/mens-wear');
                    if (onSelectGender) onSelectGender('Men');
                  }}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Men's Traditional Kolhapuris & Juttis
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/womens-wear');
                    if (onSelectGender) onSelectGender('Women');
                  }}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Women's Zari Silk Mojaris (IND 3–9)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/womens-wear');
                    if (onSelectGender) onSelectGender('Women');
                  }}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Women's Orthopedic Cork Comfort Slides
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  style={{ background: 'none', border: 'none', color: '#D4A373', cursor: 'pointer', textAlign: 'left', padding: 0, fontWeight: 600 }}
                >
                  📖 Our 1998 Journey & Heritage (Idar)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
                  style={{ background: 'none', border: 'none', color: '#88B090', cursor: 'pointer', textAlign: 'left', padding: 0, fontWeight: 600 }}
                >
                  🧾 Track Orders & Tax Invoices
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenSizeGuide('Men')}
                  style={{ background: 'none', border: 'none', color: '#BDB6AB', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  📐 Foot Measurement Tool (cm to IND)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Father's Physical Store & Contact in Idar */}
          <div>
            <h5 style={{ color: '#FFF', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Visit Us in Idar, Gujarat
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem', color: '#BDB6AB' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: '#D4A373', flexShrink: 0, marginTop: '2px' }} />
                <span>{STORE_INFO.contact.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Clock size={16} style={{ color: '#88B090', flexShrink: 0 }} />
                <span>{STORE_INFO.contact.hours}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={16} style={{ color: '#D4A373', flexShrink: 0 }} />
                <span>+91 <strong>{STORE_INFO.contact.phone}</strong> (Shri Manak Kothari)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={16} style={{ color: '#88B090', flexShrink: 0 }} />
                <span>manakkothari132@gmail.com</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppChat}
              className="btn btn-sage"
              style={{ marginTop: '1rem', width: '100%', fontSize: '0.8125rem', padding: '0.55rem' }}
            >
              <MessageCircle size={15} />
              <span>WhatsApp Shri Manak Kothari</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid #2B2723',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.75rem',
          color: '#8A837A'
        }}>
          <div>
            © {new Date().getFullYear()} {STORE_INFO.name}. Idar, Gujarat 383430. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span>7-Day Doorstep Exchange</span>
            <span>Indian Standards (IND/UK)</span>
            {isOwner && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                style={{ background: 'none', border: 'none', color: '#D4A373', fontSize: 'inherit', cursor: 'pointer', textDecoration: 'underline', fontWeight: 700 }}
              >
                Owner Portal (Admin)
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
