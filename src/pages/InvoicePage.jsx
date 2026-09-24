import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Printer,
  Download,
  MessageCircle,
  Mail,
  ArrowLeft,
  CheckCircle2,
  FileText,
  MapPin,
  Truck,
  RotateCcw,
  ShieldCheck,
  Search
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { STORE_INFO } from '../data/storeInfo';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const InvoicePage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { allOrders } = useDatabase();
  const { isOwner } = useAuth();

  const queryId = searchParams.get('invoice') || searchParams.get('order');
  const targetId = (orderId || queryId || '').trim().toUpperCase();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [searchManualId, setSearchManualId] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareNotice, setShareNotice] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!targetId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setNotFound(false);

    // 1. Search in memory allOrders first
    if (allOrders && allOrders.length > 0) {
      const match = allOrders.find(
        (o) => String(o.id).toUpperCase() === targetId
      );
      if (match) {
        setOrder(match);
        setLoading(false);
        return;
      }
    }

    // 2. Query Firestore directly
    getDoc(doc(db, 'orders', targetId))
      .then((snap) => {
        if (snap.exists()) {
          setOrder({ ...snap.data(), id: snap.id });
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.warn('Firestore invoice lookup note:', err);
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [targetId, allOrders]);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/orders');
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (searchManualId.trim()) {
      navigate(`/invoice/${searchManualId.trim().toUpperCase()}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper: Trigger reliable mobile & desktop file download via Blob URL
  const triggerPdfBlobDownload = (pdf, fileName) => {
    try {
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      setTimeout(() => {
        if (downloadLink.parentNode) {
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(blobUrl);
      }, 1500);
    } catch {
      pdf.save(fileName);
    }
  };

  const generatePdfDocument = async () => {
    const invoiceElement = document.getElementById('printable-invoice-page');
    if (!invoiceElement) return null;

    try {
      // Temporarily scroll to top so html2canvas renders from origin
      const currentScrollY = window.scrollY;
      window.scrollTo(0, 0);

      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        scrollX: 0,
        scrollY: 0
      });

      // Restore scroll position
      window.scrollTo(0, currentScrollY);

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageW = 210;
      const pageH = 297;
      const margin = 8;
      const usableW = pageW - margin * 2;
      const usableH = pageH - margin * 2;

      const imgHeightMm = (canvas.height / canvas.width) * usableW;

      if (imgHeightMm <= usableH * 1.08) {
        const finalW = imgHeightMm > usableH ? (usableH / imgHeightMm) * usableW : usableW;
        const finalH = imgHeightMm > usableH ? usableH : imgHeightMm;
        const xOffset = margin + (usableW - finalW) / 2;
        pdf.addImage(imgData, 'JPEG', xOffset, margin, finalW, finalH);
      } else {
        let yOffset = margin;
        let heightRemaining = imgHeightMm;

        pdf.addImage(imgData, 'JPEG', margin, yOffset, usableW, imgHeightMm);
        heightRemaining -= usableH;

        while (heightRemaining > 0) {
          pdf.addPage();
          yOffset = -(imgHeightMm - heightRemaining) - margin;
          pdf.addImage(imgData, 'JPEG', margin, yOffset, usableW, imgHeightMm);
          heightRemaining -= usableH;
        }
      }

      return pdf;
    } catch (err) {
      console.error('PDF generation error:', err);
      return null;
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const pdf = await generatePdfDocument();
      if (pdf) {
        triggerPdfBlobDownload(pdf, `Invoice_${order?.id || 'KF-ORDER'}.pdf`);
      } else {
        window.print();
      }
    } catch (err) {
      console.warn('PDF download fallback:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareWhatsApp = async () => {
    if (!order) return;
    setIsSharing(true);
    const shipping = order.shippingAddress || {};
    const totalAmount = order.pricing?.finalTotal || order.pricing?.subtotal || order.total || 0;
    const itemsText = (order.items || []).map((it, idx) =>
      `${idx + 1}. ${it.name} (IND ${it.size}${it.color ? `, ${it.color}` : ''}) x${it.quantity} - ₹${((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}`
    ).join('\n');

    const msg =
      `✨ *KOTHARI FOOTWEAR - RETAIL TAX INVOICE* ✨\n` +
      `*Authentic Footwear • Est. 1998, Idar (Gujarat)*\n\n` +
      `Dear ${shipping.fullName || order.customer?.name || 'Valued Customer'},\n` +
      `Please find attached your official Retail Tax Invoice #${order.id} as a PDF document.\n\n` +
      `🧾 *INVOICE DETAILS*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Invoice Number:* #${order.id}\n` +
      `*Date:* ${order.date || 'Recent Order'}\n` +
      `*Total Paid:* ₹${totalAmount.toLocaleString('en-IN')}\n` +
      `*Payment:* ${order.paymentMethod || 'Verified UPI / COD'}\n` +
      `*Delivery To:* ${shipping.city || 'Idar'} (PIN: ${shipping.pincode || ''})\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Items:*\n${itemsText}\n\n` +
      `📄 *Attached Document:* Invoice_${order.id}.pdf\n` +
      `📞 *Store Helpline:* +91 94276 44222 (Shri Manak Kothari)\n` +
      `Thank you for trusting Kothari Footwear!`;

    const rawPhone = (shipping.phone || order.customer?.phone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '';
    const targetPhone = cleanPhone ? `91${cleanPhone}` : `91${STORE_INFO.contact.whatsapp}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(msg)}`;

    try {
      const pdf = await generatePdfDocument();
      if (pdf) {
        const blob = pdf.output('blob');
        const file = new File([blob], `Invoice_${order.id}.pdf`, { type: 'application/pdf' });
        
        // On mobile devices supporting Web Share API with files:
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Tax Invoice #${order.id} - Kothari Footwear`,
              text: msg,
              files: [file]
            });
            setIsSharing(false);
            return;
          } catch (shareErr) {
            console.log('Mobile share dismissed:', shareErr);
          }
        }
        
        // On Desktop / Laptop: always trigger the actual authentic PDF file download
        triggerPdfBlobDownload(pdf, `Invoice_${order.id}.pdf`);
        setShareNotice('Invoice PDF downloaded! Opening WhatsApp — please attach the downloaded Invoice PDF to this chat.');
        setTimeout(() => setShareNotice(''), 7000);
      }

      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = whatsappUrl;
      } else {
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (link.parentNode) document.body.removeChild(link);
        }, 500);
      }
    } catch (e) {
      console.warn('WhatsApp share note:', e);
      window.location.href = whatsappUrl;
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareEmail = async () => {
    if (!order) return;
    setIsSharing(true);
    const shipping = order.shippingAddress || {};
    const custEmail = order.customer?.email || shipping.email || '';
    const totalAmount = order.pricing?.finalTotal || order.pricing?.subtotal || order.total || 0;

    const emailSubject = `Official Retail Tax Invoice #${order.id} - Kothari Footwear (Est. 1998)`;
    const emailBody =
      `Dear ${shipping.fullName || 'Valued Customer'},\n\n` +
      `Thank you for shopping with Kothari Footwear (Est. 1998, Idar, Gujarat).\n\n` +
      `TAX INVOICE DETAILS:\n` +
      `===============================\n` +
      `Invoice Number: #${order.id}\n` +
      `Date: ${order.date || 'Recent Order'}\n` +
      `Total Amount: Rs. ${totalAmount.toLocaleString('en-IN')}\n` +
      `Payment Status: ${order.paymentMethod || 'Verified UPI / COD'}\n` +
      `Delivery To: ${shipping.city || 'Idar'} (PIN: ${shipping.pincode || ''})\n` +
      `Attached Document: Invoice_${order.id}.pdf\n\n` +
      `Store Address: 134, Near Tiranga Circle, Idar, Gujarat - 383430\n` +
      `Owner & Helpline: +91 94276 44222 / manakkothari132@gmail.com\n\n` +
      `With warm regards,\nShri Manak Kothari\nFounder, KOTHARI FOOTWEAR`;

    try {
      const pdf = await generatePdfDocument();
      if (pdf) {
        const blob = pdf.output('blob');
        const file = new File([blob], `Invoice_${order.id}.pdf`, { type: 'application/pdf' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: emailSubject,
              text: emailBody,
              files: [file]
            });
            setIsSharing(false);
            return;
          } catch (shareErr) {
            console.log('Mobile email share dismissed:', shareErr);
          }
        }

        // On desktop: trigger PDF file download and notify
        triggerPdfBlobDownload(pdf, `Invoice_${order.id}.pdf`);
        setShareNotice('Invoice PDF downloaded! Opening email — please attach the downloaded Invoice PDF file.');
        setTimeout(() => setShareNotice(''), 7000);
      }

      const mailtoUrl = `mailto:${custEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoUrl;
    } catch (e) {
      console.warn('Email share note:', e);
      const mailtoUrl = `mailto:${custEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoUrl;
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid #E5DFD5', borderTopColor: '#2E693D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#57534E', fontWeight: 600 }}>Loading Official Retail Tax Invoice...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div style={{ minHeight: '75vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <FileText size={32} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C1917', marginBottom: '0.5rem' }}>
          Tax Invoice Not Found
        </h2>
        <p style={{ color: '#78716C', maxWidth: '420px', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          We could not find an official invoice for order ID <strong>"{targetId || 'None specified'}"</strong>. Please check your order ID or enter it below:
        </p>

        <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: '360px', width: '100%', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Enter Order ID (e.g. KF-123456)"
            value={searchManualId}
            onChange={(e) => setSearchManualId(e.target.value)}
            style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid #D1D5DB', fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn btn-sage" style={{ padding: '0.65rem 1rem' }}>
            <Search size={15} />
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
            <ArrowLeft size={15} />
            <span>Back to Storefront</span>
          </Link>
          <Link to="/orders" className="btn btn-sage" style={{ padding: '0.6rem 1.25rem' }}>
            <span>View My Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const shipping = order.shippingAddress || {
    fullName: order.customer?.name || 'Valued Customer',
    phone: order.customer?.phone || '',
    email: order.customer?.email || '',
    street: 'Direct Store Order',
    city: 'Gujarat',
    state: 'India',
    pincode: ''
  };

  const pricing = order.pricing || {
    subtotal: order.total || 0,
    multiPairDiscount: 0,
    multiPairDiscountPercent: 0,
    couponDiscount: 0,
    shippingFee: 0,
    finalTotal: order.total || 0
  };

  const orderItems = order.items || [];

  return (
    <div className="container-custom" style={{ padding: '1.5rem 1rem 4rem', maxWidth: '820px', margin: '0 auto' }}>
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleBack}
            className="btn btn-secondary"
            style={{ minHeight: '44px', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', borderRadius: 'var(--radius-md)' }}
            title="Go to previous page"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <Link
            to="/"
            className="btn btn-secondary"
            style={{ minHeight: '44px', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', borderRadius: 'var(--radius-md)' }}
          >
            <span>Dashboard</span>
          </Link>
          <Link
            to="/orders"
            className="btn btn-secondary"
            style={{ minHeight: '44px', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', borderRadius: 'var(--radius-md)' }}
          >
            My Orders
          </Link>
          {location.state?.from === '/admin' && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn btn-secondary"
              style={{ minHeight: '44px', padding: '0.5rem 0.85rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', background: '#F3F4F6', borderRadius: 'var(--radius-md)' }}
            >
              <ArrowLeft size={14} />
              <span>Return to Admin Panel</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Printer size={14} />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="btn btn-sage"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Download size={14} />
            <span>{isDownloading ? 'Preparing PDF...' : 'Download PDF'}</span>
          </button>
          {/* WhatsApp & Email sharing: Admin Panel only */}
          {(isOwner || location.state?.from === '/admin') && (
            <>
              <button
                type="button"
                onClick={handleShareWhatsApp}
                disabled={isSharing}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', color: '#15803D', borderColor: '#BBF7D0', background: '#F0FDF4' }}
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={handleShareEmail}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Mail size={14} />
                <span>Email</span>
              </button>
            </>
          )}
        </div>
      </div>

      {shareNotice && (
        <div style={{
          background: '#ECFDF5',
          border: '1.5px solid #A7F3D0',
          borderRadius: '8px',
          padding: '0.65rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          color: '#065F46',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
          <span>{shareNotice}</span>
        </div>
      )}

      {/* OFFICIAL KOTHARI FOOTWEAR INVOICE PAPER */}
      <div
        id="printable-invoice-page"
        style={{
          background: '#FFFFFF',
          border: '2px solid #E5DFD5',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          color: '#1C1917',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* High-Resolution Watermark */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-12deg)',
          pointerEvents: 'none',
          opacity: 0.1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0,
          userSelect: 'none'
        }}>
          <div style={{
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            border: '14px double #1C1917',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10px'
          }}>
            <div style={{
              fontSize: '7rem',
              fontWeight: 900,
              fontFamily: "'Outfit', 'Cinzel', serif",
              color: '#1C1917',
              lineHeight: 0.9,
              letterSpacing: '0.05em'
            }}>
              KF
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          
          {/* Header Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #1C1917',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: '#1C1917',
                  border: '1.5px solid #D4A373',
                  color: '#D4A373',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  KF
                </div>
                <div>
                  <h1 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, letterSpacing: '0.04em', color: '#1C1917' }}>
                    KOTHARI FOOTWEAR
                  </h1>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#78716C', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Authentic Artisan Footwear • Estd. 1998
                  </span>
                </div>
              </div>
              <p style={{ color: '#57534E', fontSize: '0.75rem', marginTop: '6px', lineHeight: 1.4, margin: '6px 0 0' }}>
                134, Near Tiranga Circle, Station Road, Idar, Dist. Sabarkantha, Gujarat - 383430 <br />
                Helpline: +91 94276 44222 • Email: manakkothari132@gmail.com
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                background: '#1C1917',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '3px 10px',
                borderRadius: '4px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '4px'
              }}>
                RETAIL TAX INVOICE
              </span>
              <p style={{ fontWeight: 800, fontSize: '0.95rem', margin: '3px 0 2px', color: '#1C1917' }}>
                #{order.id}
              </p>
              <p style={{ color: '#78716C', fontSize: '0.72rem', margin: 0 }}>
                Date: {order.date || new Date().toLocaleDateString('en-IN')}
              </p>
              <p style={{ color: '#2E693D', fontSize: '0.72rem', fontWeight: 700, margin: '2px 0 0' }}>
                Status: {order.status || 'Verified Order'}
              </p>
            </div>
          </div>

          {/* Address Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            padding: '1rem',
            background: '#FAF8F5',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontSize: '0.78rem'
          }}>
            {/* Store Origin */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#78716C', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.35rem' }}>
                <MapPin size={12} style={{ color: '#2E693D' }} />
                <span>Dispatched From (Store):</span>
              </div>
              <p style={{ fontWeight: 800, color: '#1C1917', margin: '0 0 2px 0' }}>KOTHARI FOOTWEAR</p>
              <p style={{ color: '#57534E', margin: '0 0 3px 0', lineHeight: 1.4 }}>
                134, Near Tiranga Circle, Station Road <br />
                Idar, Dist. Sabarkantha, Gujarat - 383430
              </p>
              <p style={{ color: '#78716C', fontSize: '0.7rem', margin: 0 }}>
                📞 +91 94276 44222 • Shri Manak Kothari
              </p>
            </div>

            {/* Customer Destination */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#78716C', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.35rem' }}>
                <Truck size={12} style={{ color: '#D4A373' }} />
                <span>Delivered To (Customer):</span>
              </div>
              <p style={{ fontWeight: 800, color: '#1C1917', margin: '0 0 2px 0' }}>
                {shipping.fullName || order.customer?.name || 'Valued Customer'}
              </p>
              <p style={{ color: '#44403C', margin: '0 0 3px 0', lineHeight: 1.4 }}>
                {shipping.street || 'Customer Address'}, {shipping.city || 'City'}, {shipping.state || 'Gujarat'} - {shipping.pincode || '380001'}
              </p>
              <p style={{ color: '#57534E', fontSize: '0.72rem', margin: '0 0 2px 0' }}>
                📞 +91 {shipping.phone || order.customer?.phone || '9427644222'}
              </p>
              <p style={{ color: '#78716C', fontSize: '0.7rem', margin: 0 }}>
                Payment: <strong>{order.paymentMethod || 'Verified UPI / COD'}</strong>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
            <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#1C1917', color: '#FFFFFF', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0.75rem', borderRadius: '4px 0 0 0' }}>Footwear Item & Specifications</th>
                  <th style={{ padding: '0.5rem 0.5rem', textAlign: 'center' }}>Size</th>
                  <th style={{ padding: '0.5rem 0.5rem', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderRadius: '0 4px 0 0' }}>Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E7E0D4' }}>
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#1C1917' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#78716C' }}>Color: {item.color || 'Standard'}</div>
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center', fontWeight: 700 }}>
                      IND {item.size || 8}
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>
                      {item.quantity || 1}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>
                      ₹{((item.price || 599) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
            <div style={{ width: '280px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#57534E' }}>
                <span>Subtotal:</span>
                <span>₹{(pricing.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              {pricing.multiPairDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#B45309', fontWeight: 700 }}>
                  <span>Multi-Pair Savings ({pricing.multiPairDiscountPercent}%):</span>
                  <span>-₹{(pricing.multiPairDiscount).toLocaleString('en-IN')}</span>
                </div>
              )}
              {pricing.couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E693D', fontWeight: 700 }}>
                  <span>Coupon Savings:</span>
                  <span>-₹{(pricing.couponDiscount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#57534E' }}>
                <span>Delivery (Express India):</span>
                <span>{pricing.shippingFee === 0 ? 'FREE' : `₹${pricing.shippingFee}`}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.05rem',
                fontWeight: 900,
                color: '#1C1917',
                borderTop: '2px solid #1C1917',
                paddingTop: '0.45rem',
                marginTop: '0.2rem'
              }}>
                <span>Total Payable:</span>
                <span>₹{(pricing.finalTotal || pricing.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Seals & Signatures */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #E7E0D4',
            paddingTop: '1rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#78716C', maxWidth: '300px' }}>
              <p style={{ margin: '0 0 2px' }}>✓ 100% Genuine Handcrafted Footwear Guaranteed</p>
              <p style={{ margin: '0 0 2px' }}>✓ 7-Day Hassle-Free Doorstep Size Exchange</p>
              <p style={{ margin: '4px 0 0', fontStyle: 'italic', color: '#57534E' }}>
                Thank you for choosing Kothari Footwear, Idar.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: 'auto' }}>
              {/* KF Rubber Seal */}
              <div style={{
                border: '2px solid #15803D',
                borderRadius: '50%',
                width: '85px',
                height: '85px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transform: 'rotate(-5deg)',
                background: 'rgba(21, 128, 61, 0.05)',
                color: '#15803D',
                padding: '4px',
                boxShadow: 'inset 0 0 0 1.5px rgba(21, 128, 61, 0.4)'
              }}>
                <span style={{ fontSize: '0.44rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  KOTHARI FOOTWEAR
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#15803D', lineHeight: 1, margin: '1px 0' }}>
                  KF
                </span>
                <span style={{ fontSize: '0.42rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  ★ OFFICIAL SEAL ★
                </span>
                <span style={{ fontSize: '0.38rem', fontWeight: 700, color: '#166534' }}>
                  ESTD. 1998
                </span>
              </div>

              {/* Owner Signature */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Great Vibes', cursive, 'Brush Script MT', sans-serif",
                  fontSize: '1.75rem',
                  color: '#1C1917',
                  lineHeight: 1,
                  marginBottom: '2px',
                  transform: 'rotate(-2deg)'
                }}>
                  Manak Kothari
                </div>
                <div style={{ width: '130px', height: '1.5px', background: '#1C1917', margin: '0 auto 3px auto' }} />
                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1C1917', margin: 0 }}>
                  Shri Manak Kothari
                </p>
                <p style={{ fontSize: '0.6rem', color: '#78716C', textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>
                  Authorized Signatory • Owner
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
