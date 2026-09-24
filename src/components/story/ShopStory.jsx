import React, { useState } from 'react';
import { STORE_INFO } from '../../data/storeInfo';
import { CUSTOMER_REVIEWS } from '../../data/reviews';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Star,
  Heart,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ShopStory = ({ isOpen, onClose }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  if (!isOpen) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Namaste Shri Manak Kothari ji! I would like to enquire about footwear sizing and visiting your shop in Idar.`);
    window.open(`https://wa.me/${STORE_INFO.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ width: '100%', maxWidth: '860px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-sage)', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              <Award size={16} />
              <span>ESTABLISHED 1998 • IDAR, GUJARAT</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              The Story of {STORE_INFO.name}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Owner: <strong>{STORE_INFO.ownerName}</strong> • Formerly known as <em>{STORE_INFO.previousName}</em>
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

        {/* Story Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Emotional Tribute Narrative Box */}
          <div style={{
            background: 'linear-gradient(135deg, #FAF7F2 0%, #F3ECE2 100%)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #E2D9CD',
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: 'var(--text-primary)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-tan)', fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.05rem' }}>
              <Heart size={18} fill="currentColor" />
              <span>{STORE_INFO.journeyStory.title}</span>
            </div>

            <p style={{ marginBottom: '0.85rem' }}>
              In <strong>1998</strong>, our story began under the name <strong>'Kothari Shoes'</strong>. Following the sudden and untimely demise of his father (our revered grandfather), a young 19-year-old boy, <strong>Shri Manak Kothari</strong>, faced an immense crossroad in life.
            </p>
            <p style={{ marginBottom: '0.85rem' }}>
              With unwavering determination and the blessings of his mother (our grandmother), Manak Kothari stepped into the shop every single morning. He dedicated his youth to understanding every curve of the human foot, master craftsmanship, genuine vegetable-tanned leathers, and ethical business values.
            </p>
            <p style={{ marginBottom: '0.85rem' }}>
              Over the next 28+ years, through tireless devotion and word-of-mouth trust, he expanded the shop into <strong>'KOTHARI FOOTWEAR'</strong> — transforming it into the most cherished footwear landmark in Idar, Sabarkantha, and across Gujarat.
            </p>
            <p style={{ fontStyle: 'italic', color: 'var(--accent-charcoal)', fontWeight: 600, borderTop: '1px solid #E0D6C8', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
              "Every stitch and sole we sell carries our father’s promise: uncompromised quality, fair pricing, and pure walking comfort for every Indian family."
            </p>
          </div>

          {/* Physical Store Visiting Guide in Idar, Gujarat */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Visit Our Showroom in Idar, Gujarat
            </h3>
            <div style={{
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              fontSize: '0.875rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  <MapPin size={16} style={{ color: 'var(--accent-tan)' }} />
                  <span>Showroom Address</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                  {STORE_INFO.contact.address}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  <Clock size={16} style={{ color: 'var(--accent-sage)' }} />
                  <span>Opening Timings</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                  {STORE_INFO.contact.hours}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                  Open all 7 days of the week
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  <Phone size={16} style={{ color: 'var(--accent-charcoal)' }} />
                  <span>Direct Contact</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                  📞 +91 <strong>9427644222</strong>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                  ✉️ manakkothari132@gmail.com
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="btn btn-sage"
                style={{ flex: 1, padding: '0.7rem' }}
              >
                <MessageCircle size={16} />
                <span>Chat Directly with Shri Manak Kothari on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Customer Reviews Spotlight */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Customer Testimonials
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {CUSTOMER_REVIEWS.slice(0, 2).map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: 'var(--bg-primary)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8125rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#D4A373', marginBottom: '0.25rem' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="#D4A373" />
                    ))}
                  </div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    "{rev.title}"
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                    {rev.comment}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>{rev.author} ({rev.city})</span>
                    <span style={{ color: 'var(--accent-sage)', fontWeight: 600 }}>Size: {rev.sizePurchased}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Frequently Asked Questions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STORE_INFO.faqs.map((faq, i) => {
                const isOpenFaq = openFaqIndex === i;
                return (
                  <div
                    key={i}
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-primary)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpenFaq ? -1 : i)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span>{faq.q}</span>
                      {isOpenFaq ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isOpenFaq && (
                      <div style={{ padding: '0 1rem 0.85rem 1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
