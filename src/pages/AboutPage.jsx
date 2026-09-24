import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STORE_INFO } from '../data/storeInfo';
import { CUSTOMER_REVIEWS } from '../data/reviews';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Star,
  Heart,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

export const AboutPage = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Namaste Shri Manak Kothari ji! I am reading about Kothari Footwear and would love guidance on shoe sizing or visiting your shop in Idar.'
    );
    window.open(`https://wa.me/${STORE_INFO.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div style={{ minHeight: '85vh', background: '#FAF9F6', paddingBottom: '4rem' }}>
      {/* Top Breadcrumb Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)', padding: '0.75rem 1rem' }}>
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
              style={{
                minHeight: '44px',
                minWidth: '44px',
                padding: '0.5rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)'
              }}
              title="Go to previous page"
            >
              <ArrowLeft size={16} />
              <span>← Back</span>
            </button>

            <Link
              to="/"
              className="btn btn-ghost"
              style={{
                minHeight: '44px',
                padding: '0.5rem 0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <span>Back to Dashboard</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
              <ChevronRight size={13} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>About & Heritage</span>
            </div>
          </div>

          <Link
            to="/"
            className="btn btn-primary"
            style={{ minHeight: '44px', padding: '0.45rem 1rem', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ShoppingBag size={14} />
            <span>Browse Shoes</span>
          </Link>
        </div>
      </div>

      <div className="container-custom" style={{ maxWidth: '900px', marginTop: '2rem', padding: '0 1rem' }}>
        {/* Hero Tribute Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #2E2926 100%)',
            borderRadius: '20px',
            border: '2px solid #D4A373',
            padding: '2rem 1.5rem',
            color: '#FFFFFF',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4A373', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            <Award size={18} />
            <span>ESTABLISHED 1998 • IDAR, GUJARAT</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
            The Story of {STORE_INFO.name}
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#D4A373', marginTop: '0.5rem', fontWeight: 600 }}>
            Master Craftsman & Store Owner: <strong>{STORE_INFO.ownerName}</strong> • Formerly known as <em>{STORE_INFO.previousName}</em>
          </p>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="btn btn-accent"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <MessageCircle size={16} />
              <span>Connect on WhatsApp</span>
            </button>
            <a
              href={`tel:${STORE_INFO.contact.phone}`}
              className="btn"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#FFF',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.6rem 1.25rem',
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Phone size={16} />
              <span>+91 94276 44222</span>
            </a>
          </div>
        </div>

        {/* Emotional Tribute Narrative Box */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2D9CD',
            padding: '2rem 1.75rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            marginBottom: '2rem',
            lineHeight: 1.8,
            fontSize: '0.95rem',
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-tan)', fontWeight: 800, marginBottom: '1rem', fontSize: '1.15rem' }}>
            <Heart size={20} fill="currentColor" />
            <span>{STORE_INFO.journeyStory.title}</span>
          </div>

          <p style={{ marginBottom: '1rem' }}>
            In <strong>1998</strong>, our story began under the name <strong>'Kothari Shoes'</strong>. Following the sudden and untimely demise of his father (our revered grandfather), a young 19-year-old boy, <strong>Shri Manak Kothari</strong>, faced an immense crossroad in life.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            With unwavering determination and the blessings of his mother (our grandmother), Manak Kothari stepped into the shop every single morning. He dedicated his youth to understanding every curve of the human foot, master craftsmanship, genuine vegetable-tanned leathers, and ethical business values.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Over the next 28+ years, through tireless devotion and word-of-mouth trust, he expanded the shop into <strong>'KOTHARI FOOTWEAR'</strong> — transforming it into the most cherished footwear landmark in Idar, Sabarkantha, and across Gujarat.
          </p>
          <p
            style={{
              fontStyle: 'italic',
              color: 'var(--accent-charcoal)',
              fontWeight: 700,
              borderTop: '1px solid #E0D6C8',
              paddingTop: '1rem',
              marginTop: '1rem',
              background: '#FAF7F2',
              padding: '1rem',
              borderRadius: '8px'
            }}
          >
            "Every stitch and sole we sell carries our father’s promise: uncompromised quality, fair pricing, and pure walking comfort for every Indian family."
          </p>
        </div>

        {/* Trust Badges 3-Column */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={26} style={{ color: 'var(--accent-sage)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>100% Genuine Footwear</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>Sourced straight from premier artisans with genuine materials and fair MRP pricing.</p>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Award size={26} style={{ color: 'var(--accent-tan)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>28+ Years of Trust</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>Serving generations of Indian families in Idar and across Gujarat since 1998.</p>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={26} style={{ color: '#15803D', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>GST Retail Invoices</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>Compliant computer tax invoices with store rubber stamp on every order.</p>
            </div>
          </div>
        </div>

        {/* Store Location & Timings */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '1.75rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Visit Our Flagship Store in Idar
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <MapPin size={20} style={{ color: 'var(--accent-sage)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>Store Address</strong>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', lineHeight: 1.5 }}>
                  {STORE_INFO.address.street}, {STORE_INFO.address.area}<br />
                  {STORE_INFO.address.city}, {STORE_INFO.address.state} - {STORE_INFO.address.pincode}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <Clock size={20} style={{ color: 'var(--accent-sage)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>Opening Hours</strong>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                  Monday - Sunday: 9:00 AM – 9:00 PM<br />
                  Open all 7 days for our valued patrons
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Patron Reviews & Experiences
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1rem' }}>
            {CUSTOMER_REVIEWS.map((rev) => (
              <div key={rev.id} style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#F59E0B', marginBottom: '0.5rem' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                  "{rev.comment}"
                </p>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{rev.userName}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{rev.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Frequently Asked Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STORE_INFO.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isOpen ? '#FAF9F6' : '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0.9rem 1.1rem', background: '#FAF9F6', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)' }}>
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
  );
};
export default AboutPage;
