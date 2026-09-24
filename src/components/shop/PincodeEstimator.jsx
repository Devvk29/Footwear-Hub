import React, { useState, useEffect } from 'react';
import { MapPin, Truck, CheckCircle2, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export const PincodeEstimator = ({ compact = false, onPincodeSet }) => {
  const [pincode, setPincode] = useState(() => {
    try {
      return localStorage.getItem('kf_customer_pincode') || '';
    } catch {
      return '';
    }
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pincode && pincode.length === 6) {
      calculateDelivery(pincode);
    }
  }, []);

  const calculateDelivery = (code) => {
    if (!/^\d{6}$/.test(code)) {
      setResult({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const pinNum = parseInt(code, 10);
      let region = 'Rest of India';
      let days = 3;
      let hub = 'National Logistics Network';

      // Gujarat & Sabarkantha / North Gujarat area (360xxx - 396xxx)
      if (pinNum >= 360000 && pinNum <= 396999) {
        if (code === '383430') {
          region = 'Idar (Local Same-Day / 24h Express)';
          days = 1;
          hub = 'Direct Idar Showroom Pickup / Doorstep';
        } else if (code.startsWith('383') || code.startsWith('380') || code.startsWith('382') || code.startsWith('384')) {
          region = 'Sabarkantha & Ahmedabad Hub';
          days = 1;
          hub = 'Gujarat Express Fleet';
        } else {
          region = 'Gujarat State';
          days = 2;
          hub = 'Statewide Express Partner';
        }
      } else if (code.startsWith('40') || code.startsWith('41') || code.startsWith('42')) {
        region = 'Maharashtra & Mumbai';
        days = 2;
        hub = 'West Zone Logistics';
      } else if (code.startsWith('11') || code.startsWith('12') || code.startsWith('20')) {
        region = 'Delhi NCR & North Zone';
        days = 3;
        hub = 'North Zone Air/Surface Express';
      } else if (code.startsWith('56') || code.startsWith('50') || code.startsWith('60')) {
        region = 'South India (Bangalore / Hyderabad / Chennai)';
        days = 3;
        hub = 'South Zone Air Express';
      } else if (code.startsWith('30') || code.startsWith('31') || code.startsWith('32')) {
        region = 'Rajasthan';
        days = 2;
        hub = 'Border Zone Express';
      } else {
        days = 4;
      }

      const arrivalDate = new Date();
      arrivalDate.setDate(arrivalDate.getDate() + days);
      const formattedDate = arrivalDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });

      const resData = {
        valid: true,
        pincode: code,
        region,
        days,
        arrivalDate: formattedDate,
        hub,
        isFreeDelivery: true,
        isCodAvailable: true
      };

      setResult(resData);
      setIsLoading(false);
      try {
        localStorage.setItem('kf_customer_pincode', code);
      } catch {}

      if (onPincodeSet) onPincodeSet(resData);
    }, 300);
  };

  const handleCheck = (e) => {
    e.preventDefault();
    calculateDelivery(pincode);
  };

  if (compact) {
    return (
      <div style={{
        background: '#FAF7F2',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.65rem 0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Truck size={14} style={{ color: 'var(--accent-sage)' }} />
            Delivery Estimator:
          </span>
          {result?.valid && (
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-sage)', fontWeight: 700 }}>
              PIN: {result.pincode}
            </span>
          )}
        </div>

        <form onSubmit={handleCheck} style={{ display: 'flex', gap: '0.35rem' }}>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit PIN code"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            style={{
              flex: 1,
              padding: '0.35rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              background: '#FFF',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isLoading || pincode.length !== 6}
            style={{
              padding: '0.35rem 0.75rem',
              background: 'var(--accent-sage)',
              color: '#FFF',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: pincode.length === 6 ? 'pointer' : 'default',
              opacity: pincode.length === 6 ? 1 : 0.6
            }}
          >
            {isLoading ? '...' : 'Check'}
          </button>
        </form>

        {result?.valid && (
          <div style={{ marginTop: '0.45rem', fontSize: '0.72rem', color: 'var(--text-primary)' }}>
            <p style={{ fontWeight: 700, color: 'var(--accent-sage)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={12} />
              Estimated Delivery by {result.arrivalDate}
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '1px' }}>
              {result.region} • Free Shipping & COD Available
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EFE6 100%)',
      border: '1.5px solid #E6DFD5',
      borderRadius: 'var(--radius-md)',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--accent-sage)',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Truck size={16} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Doorstep Delivery & COD Checker
          </h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Direct dispatch from Kothari Footwear Idar Showroom
          </p>
        </div>
      </div>

      <form onSubmit={handleCheck} style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <MapPin size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            maxLength={6}
            placeholder="Enter your 6-digit Pincode (e.g. 383430)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            style={{
              width: '100%',
              padding: '0.5rem 0.65rem 0.5rem 2rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              background: '#FFFFFF',
              outline: 'none',
              fontWeight: 600
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || pincode.length !== 6}
          className="btn btn-sage"
          style={{ padding: '0.5rem 1rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
        >
          {isLoading ? 'Checking...' : 'Check Availability'}
        </button>
      </form>

      {result?.valid && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid #D4ECD5',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--accent-sage)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} />
              Guaranteed Delivery by {result.arrivalDate}
            </span>
            <span style={{ fontSize: '0.68rem', background: 'var(--accent-sage-light)', color: 'var(--accent-sage)', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
              {result.days === 1 ? '⚡ 24-Hour Express' : `${result.days} Days Transit`}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.4rem', marginTop: '0.2rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ color: 'var(--accent-sage)' }}>✓</span>
              <span>Cash on Delivery (COD)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ color: 'var(--accent-sage)' }}>✓</span>
              <span>Free Delivery Above ₹999</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ color: 'var(--accent-sage)' }}>✓</span>
              <span>7-Day Easy Size Exchange</span>
            </div>
          </div>
        </div>
      )}

      {result && !result.valid && (
        <p style={{ fontSize: '0.72rem', color: '#B91C1C', fontWeight: 600 }}>
          {result.message}
        </p>
      )}
    </div>
  );
};
