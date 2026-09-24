import React, { useState } from 'react';
import { BookOpen, ArrowRight, Sparkles, Clock, X, CheckCircle, ShieldCheck } from 'lucide-react';

const ARTICLES = [
  {
    id: "art-01",
    title: "The Art of Handcrafted Mojaris & Juttis: 28 Years in Idar",
    tag: "Heritage Craft",
    readTime: "3 min read",
    image: "/images/products/women_bridal_jutti_1789973887134.jpg",
    summary: "Discover how traditional artisans in Idar, Gujarat hand-stitch double-cushioned bite-free juttis with pure zari work for festive elegance and all-day ease.",
    content: [
      "For over two decades in Idar's historic market, Kothari Footwear has worked alongside generational craftsmen who treat shoe-making as an heirloom art. Traditional Indian festive footwear often suffered from stiff back-counters that caused shoe bites.",
      "Our artisan juttis and mojaris incorporate hidden EVA heel cushioning and soft silk velvet linings. Each pair undergoes vegetable-oil softening so you can dance through Navratri and wedding sangeets without sore feet.",
      "Key Artisan Steps: 1) Pure brass needle embroidery with metallic zari, 2) Hand-buffed goat leather base, 3) 4mm memory foam insole insertion, 4) Stitch-welting without harmful chemical adhesives."
    ]
  },
  {
    id: "art-02",
    title: "Doctor-Recommended Orthopedic Soles for Indian Homes",
    tag: "Foot Health",
    readTime: "4 min read",
    image: "/images/products/women_doctor_ortho_1789974034870.jpg",
    summary: "Why hard tiled floors cause heel pain and how orthopedic anatomical footbeds provide relief for plantar fasciitis, knee joints, and back posture.",
    content: [
      "Walking barefoot on hard marble, vitrified tiles, and concrete surfaces exerts direct impact on your calcaneus (heel bone). Over time, this leads to morning heel stiffness, calcaneal spurs, and knee fatigue.",
      "Orthopedic chappals designed at Kothari Footwear feature contoured arch support that redistributes your body weight evenly across the entire footbed.",
      "The deep heel cup locks your stride, preventing ankle rolling, while the high-density EVA foam absorbs 65% of floor impact during daily cooking, chores, and evening walks."
    ]
  },
  {
    id: "art-03",
    title: "Vegetable-Tanned Leather: Why Natural Curing Matters",
    tag: "Material Science",
    readTime: "3 min read",
    image: "/images/products/men_oxford_leather_1789973432066.jpg",
    summary: "Understand the difference between chemical chrome tanning and artisanal vegetable curing with natural tree barks for breathable, odor-free formal shoes.",
    content: [
      "Commercial mass-market shoes often use heavy chromium salts to speed up tanning, which traps moisture and produces unpleasant odor in humid Indian climates.",
      "Our artisan leather oxfords and formal loafers are treated with organic acacia and chestnut tree extracts. This breathable natural structure allows air circulation and absorbs perspiration.",
      "With every wear, genuine full-grain vegetable-tanned leather molds naturally to your unique Indian foot contour (IND 6 to 12), developing a rich honey-amber patina over years of use."
    ]
  },
  {
    id: "art-04",
    title: "Monsoon & Summer Footwear Care: 5 Master Tips",
    tag: "Footwear Care",
    readTime: "2 min read",
    image: "/images/products/women_crocs_pastel_1789973846505.jpg",
    summary: "Essential advice from Shri Manak Kothari on washing waterproof clogs, preserving leather during monsoon humidity, and drying soles without damage.",
    content: [
      "1. Never dry leather footwear under direct scorching noon sunlight — always dry in a well-ventilated shaded room to prevent leather cracking.",
      "2. For waterproof EVA slides and garden clogs, a gentle rinse with mild soap and room temperature tap water restores fresh grip and color instantly.",
      "3. Use cedar shoe trees or dry paper stuffing inside formal shoes during the monsoon to absorb moisture and maintain the sharp toe-box silhouette.",
      "4. Store daily chappals on an open rack with air flow rather than sealed plastic bags to prevent sole dampness."
    ]
  }
];

export const FootwearArticles = ({ onSelectCategory }) => {
  const [activeArticle, setActiveArticle] = useState(null);

  return (
    <section style={{ padding: '3.5rem 0', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', mdDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--accent-sage-light)', color: 'var(--accent-sage)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
              <BookOpen size={13} />
              <span>Footwear Knowledge & Craft</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Footwear Guides, Heritage & Sole Care
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '650px' }}>
              Authentic insights from our 28-year journey in Idar, Gujarat — from orthopedic foot health to traditional handloom zari craftsmanship.
            </p>
          </div>
        </div>

        {/* 4 Articles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem'
        }}>
          {ARTICLES.map((art) => (
            <article
              key={art.id}
              onClick={() => setActiveArticle(art)}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              {/* Article Cover Image */}
              <div style={{ position: 'relative', width: '100%', paddingTop: '58%', overflow: 'hidden', background: '#F5EFE6' }}>
                <img
                  src={art.image}
                  alt={art.title}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '0.6rem',
                  left: '0.6rem',
                  background: 'rgba(25, 24, 23, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {art.tag}
                </span>
              </div>

              {/* Article Text */}
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <Clock size={12} />
                    <span>{art.readTime}</span>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: '0.45rem' }}>
                    {art.title}
                  </h3>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {art.summary}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-sage)', fontSize: '0.78rem', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Interactive Article Reading Modal */}
      {activeArticle && (
        <div className="modal-overlay" onClick={() => setActiveArticle(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: '640px', width: '100%', padding: '0', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Cover Image */}
            <div style={{ position: 'relative', width: '100%', height: '220px', background: '#191817' }}>
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
              />
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
              <span style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1.25rem',
                background: 'var(--accent-sage)',
                color: '#FFF',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                {activeArticle.tag} • {activeArticle.readTime}
              </span>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem', maxHeight: '55vh', overflowY: 'auto' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '1rem' }}>
                {activeArticle.title}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={24} style={{ color: 'var(--accent-sage)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Kothari Footwear Quality Assurance
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    All products are personally curated and verified by Shri Manak Kothari (Est. 1998, Idar).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem' }}
              >
                Close & Browse Shoes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
