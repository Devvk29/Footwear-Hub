import React, { useState } from 'react';
import { STORE_INFO } from '../../data/storeInfo';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppDirect = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Namaste Shri Manak Kothari ji! I would like to enquire about footwear sizes, stock and custom fitting at Kothari Footwear, Idar.`);
    window.open(`https://wa.me/${STORE_INFO.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '1.5rem', zIndex: 35, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
      
      {showTooltip && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 0.85rem',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.8125rem',
          maxWidth: '230px',
          color: 'var(--text-primary)',
          position: 'relative'
        }}>
          <button
            onClick={() => setShowTooltip(false)}
            style={{ position: 'absolute', top: '4px', right: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={12} />
          </button>
          <p style={{ fontWeight: 700, color: 'var(--accent-sage)', marginBottom: '0.15rem' }}>Chat with Shri Manak Kothari</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Get direct size guidance & custom fitting advice on WhatsApp (+91 94276 44222)</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleWhatsApp}
        onMouseEnter={() => setShowTooltip(true)}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#25D366',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 18px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        title="Chat with Shri Manak Kothari on WhatsApp (+91 94276 44222)"
      >
        <MessageCircle size={26} fill="#FFFFFF" />
      </button>
    </div>
  );
};
