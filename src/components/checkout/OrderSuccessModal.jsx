import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ArrowRight,
  MessageCircle,
  X,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Download,
  FileText,
  Share2,
  Sparkles
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { STORE_INFO } from '../../data/storeInfo';
import { useAuth } from '../../context/AuthContext';

export const OrderSuccessModal = ({ order, isOpen, onClose }) => {
  const { isOwner } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [cachedPdfObj, setCachedPdfObj] = useState(null);
  const [cachedPdfFile, setCachedPdfFile] = useState(null);

  // Celebration confetti only on fresh orders (not when inspecting invoices from admin)
  useEffect(() => {
    const isFreshOrder = !!(order?.isNewOrder || (order?.createdAt && (Date.now() - order.createdAt < 20000)));
    if (isOpen && isFreshOrder) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const celebrationColors = [
        '#D4A373', '#15803D', '#2563EB', '#E11D48',
        '#F59E0B', '#8B5CF6', '#EC4899', '#10B981', '#FFFFFF'
      ];

      // Initial Grand Party Popper Cannon Bursts (Immediate High-Energy Blast)
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors: celebrationColors,
        zIndex: 999999,
        scalar: 1.2
      });

      confetti({
        particleCount: 40,
        angle: 60,
        spread: 70,
        origin: { x: 0.05, y: 0.7 },
        colors: celebrationColors,
        zIndex: 999999,
        scalar: 1.1
      });

      confetti({
        particleCount: 40,
        angle: 120,
        spread: 70,
        origin: { x: 0.95, y: 0.7 },
        colors: celebrationColors,
        zIndex: 999999,
        scalar: 1.1
      });

      // 6 Seconds Continuous Flowing Confetti & Paper Streamers
      const duration = 4 * 1000;
      const end = Date.now() + duration;

      let lastCannonTime = 0;

      const frame = (timestamp) => {
        // Continuous gentle floating paper ribbons
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: celebrationColors,
          zIndex: 999999,
          shapes: ['square', 'circle']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: celebrationColors,
          zIndex: 999999,
          shapes: ['square', 'circle']
        });
        confetti({
          particleCount: 2,
          angle: 90,
          spread: 80,
          origin: { x: 0.5, y: 0.1 },
          colors: celebrationColors,
          zIndex: 999999,
          shapes: ['square', 'circle']
        });

        // Periodic periodic burst every 2.5 seconds during the 10-second window
        if (!lastCannonTime || timestamp - lastCannonTime > 2500) {
          lastCannonTime = timestamp;
          confetti({
            particleCount: 30,
            spread: 80,
            origin: { x: Math.random() * 0.6 + 0.2, y: 0.5 },
            colors: celebrationColors,
            zIndex: 999999,
            scalar: 1.1
          });
        }

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      requestAnimationFrame(frame);

      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  const shipping = order?.shippingAddress || {
    fullName: order?.customer?.name || 'Valued Customer',
    phone: order?.customer?.phone || '',
    email: order?.customer?.email || '',
    street: 'Direct Store Order',
    city: 'Gujarat',
    state: 'India',
    pincode: ''
  };

  const pricing = order?.pricing || {
    subtotal: 0,
    multiPairDiscount: 0,
    multiPairDiscountPercent: 0,
    couponDiscount: 0,
    shippingFee: 0,
    finalTotal: 0
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
      downloadLink.target = '_blank';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      setTimeout(() => {
        if (downloadLink.parentNode) {
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(blobUrl);
      }, 1500);
    } catch (err) {
      pdf.save(fileName);
    }
  };

  // Helper: Generate Authentic Standard A4 PDF (100% Mobile & Desktop Compatible)
  // Uses positive absolute positioning (0 opacity) so mobile Blink/WebKit engines render styles and fonts without blank clips
  const generatePdfDocument = async () => {
    const invoiceElement = document.getElementById('printable-invoice');
    if (!invoiceElement) return null;

    // Standard A4 width: 794px at standard 96dpi (210mm)
    const A4_WIDTH_PX = 794;
    const cloneWrapper = document.createElement('div');
    cloneWrapper.style.cssText = [
      'position:absolute',
      'left:0',
      'top:0',
      'opacity:0',
      'pointer-events:none',
      `width:${A4_WIDTH_PX}px`,
      'background:#FFFFFF',
      'padding:20px',
      'box-sizing:border-box',
      'font-family:Outfit,sans-serif',
      'z-index:-99999'
    ].join(';');

    const clone = invoiceElement.cloneNode(true);
    cloneWrapper.appendChild(clone);
    document.body.appendChild(cloneWrapper);

    try {
      const canvas = await html2canvas(cloneWrapper, {
        scale: 2, // High resolution retina without memory crashing mobile devices
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        width: A4_WIDTH_PX,
        windowWidth: A4_WIDTH_PX
      });

      // JPEG compression yields ~250KB crisp PDF opening instantly in any mobile PDF reader
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageW = 210;     // A4 width in mm
      const pageH = 297;     // A4 height in mm
      const margin = 8;      // mm margin
      const usableW = pageW - margin * 2; // 194mm
      const usableH = pageH - margin * 2; // 281mm

      const imgHeightMm = (canvas.height / canvas.width) * usableW;

      // Fit gracefully onto standard single A4 page so mobile viewers don't create awkward cut-offs
      if (imgHeightMm <= usableH * 1.15) {
        const finalW = imgHeightMm > usableH ? (usableH / imgHeightMm) * usableW : usableW;
        const finalH = imgHeightMm > usableH ? usableH : imgHeightMm;
        const xOffset = margin + (usableW - finalW) / 2;
        pdf.addImage(imgData, 'JPEG', xOffset, margin, finalW, finalH);
      } else {
        // Multi-page handling for very long orders
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
    } finally {
      if (cloneWrapper.parentNode) {
        document.body.removeChild(cloneWrapper);
      }
    }
  };

  // Background prepare official PDF document as soon as modal opens so user activation gesture is instant
  useEffect(() => {
    let active = true;
    if (isOpen && order) {
      const timer = setTimeout(async () => {
        try {
          const pdf = await generatePdfDocument();
          if (pdf && active) {
            const blob = pdf.output('blob');
            const file = new File(
              [blob],
              `Invoice_${order.id || 'KF-ORDER'}.pdf`,
              { type: 'application/pdf' }
            );
            setCachedPdfObj(pdf);
            setCachedPdfFile(file);
          }
        } catch (e) {
          console.warn('Background PDF preparation note:', e);
        }
      }, 350);

      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [isOpen, order?.id]);

  if (!isOpen || !order) return null;

  const getPreparedPdf = async () => {
    if (cachedPdfFile && cachedPdfObj) {
      return { pdf: cachedPdfObj, file: cachedPdfFile };
    }
    const pdf = await generatePdfDocument();
    if (!pdf) return null;
    const blob = pdf.output('blob');
    const file = new File(
      [blob],
      `Invoice_${order.id || 'KF-ORDER'}.pdf`,
      { type: 'application/pdf' }
    );
    setCachedPdfObj(pdf);
    setCachedPdfFile(file);
    return { pdf, file };
  };

  // 100% Native PDF Download - Universal mobile & desktop download
  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const prepared = await getPreparedPdf();
      if (prepared?.pdf) {
        triggerPdfBlobDownload(prepared.pdf, `Invoice_${order.id || 'KF-ORDER'}.pdf`);
      } else {
        window.print();
      }
    } catch (e) {
      console.warn('PDF download fallback:', e);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  // WhatsApp Share: Shares PDF file with confirmation message on mobile, or downloads PDF + opens WhatsApp on desktop
  const handleWhatsAppCustomerInvoice = async () => {
    setIsSharing(true);
    const totalAmount = order.pricing?.finalTotal || order.pricing?.subtotal || 0;
    const itemsText = (order.items || []).map((it, idx) =>
      `${idx + 1}. ${it.name} (IND ${it.size}, ${it.color}) x${it.quantity} - ₹${(it.price * it.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
    const onlineInvoiceUrl = `${window.location.origin}${base}/invoice/${order.id}`;

    const msg =
      `✨ *GREETINGS FROM KOTHARI FOOTWEAR (Est. 1998)* ✨\n\n` +
      `Dear ${shipping.fullName},\n` +
      `Warm greetings from Shri Manak Kothari in Idar, Gujarat! 🙏\n\n` +
      `Your handcrafted footwear order #${order.id} has been registered. Here is your official Retail Tax Invoice:\n\n` +
      `🧾 *OFFICIAL RETAIL TAX INVOICE*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Invoice Number:* #${order.id}\n` +
      `*Date:* ${order.date || new Date().toLocaleString('en-IN')}\n` +
      `*Registered Mobile:* +91 ${shipping.phone}\n` +
      `*Delivery Address:* ${shipping.street}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Ordered Items:*\n${itemsText}\n\n` +
      `*Subtotal:* ₹${(order.pricing?.subtotal || 0).toLocaleString('en-IN')}\n` +
      (order.pricing?.multiPairDiscount > 0 ? `*Multi-Pair Savings:* -₹${order.pricing.multiPairDiscount.toLocaleString('en-IN')}\n` : '') +
      (order.pricing?.couponDiscount > 0 ? `*Coupon Discount:* -₹${order.pricing.couponDiscount.toLocaleString('en-IN')}\n` : '') +
      `*Final Total:* ₹${totalAmount.toLocaleString('en-IN')}\n` +
      `*Payment Status:* ${order.paymentMethod || 'Verified UPI / COD'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📄 *Attached PDF:* Official Tax Invoice (Invoice_${order.id}.pdf)\n\n` +
      `📦 *Dispatch From:* 134, Near Tiranga Circle, Idar, Gujarat - 383430\n` +
      `📞 *Owner Helpline:* +91 94276 44222 (Shri Manak Kothari)\n\n` +
      `Thank you for trusting Kothari Footwear for authentic quality!`;

    // Sanitize customer phone: strip non-digits, take last 10 digits
    const rawPhone = (shipping.phone || order.customer?.phone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '';
    const targetPhone = cleanPhone ? `91${cleanPhone}` : `91${STORE_INFO.contact.whatsapp}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(msg)}`;

    try {
      const prepared = await getPreparedPdf();
      
      // On mobile devices supporting Web Share API with files:
      // Shares the PDF file directly with the confirmation message to WhatsApp or any chosen app
      if (prepared?.file && navigator.canShare && navigator.canShare({ files: [prepared.file] })) {
        try {
          await navigator.share({
            title: `Official Retail Tax Invoice #${order.id} - Kothari Footwear`,
            text: msg,
            files: [prepared.file]
          });
          setIsSharing(false);
          return;
        } catch (shareErr) {
          if (shareErr?.name === 'AbortError') {
            setIsSharing(false);
            return;
          }
          console.warn('Native mobile share failed, using fallback:', shareErr);
        }
      }

      // Fallback for desktop or browsers without file share API support:
      if (prepared?.pdf) {
        triggerPdfBlobDownload(prepared.pdf, `Invoice_${order.id || 'KF-ORDER'}.pdf`);
      }

      const isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobileDevice) {
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
      console.warn('WhatsApp share fallback note:', e);
      window.location.href = whatsappUrl;
    } finally {
      setIsSharing(false);
    }
  };

  const handleWhatsAppUpdate = handleWhatsAppCustomerInvoice;

  // Email Receipt: shares PDF file directly via Web Share API on mobile, or downloads PDF + opens mailto
  const handleEmailCustomerInvoice = async () => {
    setIsSharing(true);
    const custEmail = order.customer?.email || shipping.email || '';
    const totalAmount = order.pricing?.finalTotal || order.pricing?.subtotal || 0;
    const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
    const onlineInvoiceUrl = `${window.location.origin}${base}/invoice/${order.id}`;

    const itemsText = (order.items || []).map((it, idx) =>
      `${idx + 1}. ${it.name} (IND ${it.size}, Color: ${it.color}) x${it.quantity} - Rs. ${(it.price * it.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const emailSubject = `Official Retail Tax Invoice #${order.id} - Kothari Footwear (Est. 1998)`;
    const emailBody =
      `Dear ${shipping.fullName},\n\n` +
      `Warm Greetings from Shri Manak Kothari & KOTHARI FOOTWEAR (Est. 1998, Idar, Gujarat)!\n\n` +
      `Thank you for shopping with us. We have received your order and our artisan team is preparing your package for express dispatch.\n\n` +
      `RETAIL TAX INVOICE DETAILS:\n` +
      `===============================\n` +
      `Invoice Number: #${order.id}\n` +
      `Order Date: ${order.date || new Date().toLocaleString('en-IN')}\n` +
      `Registered Mobile: +91 ${shipping.phone}\n` +
      `Registered Email: ${custEmail || 'Linked to Mobile'}\n` +
      `Payment Method: ${order.paymentMethod || 'Verified UPI / COD'}\n` +
      `Total Paid / Payable: Rs. ${totalAmount.toLocaleString('en-IN')}\n\n` +
      `ORDERED ITEMS:\n${itemsText}\n\n` +
      `DELIVERY ADDRESS:\n${shipping.street}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}\n` +
      `Contact Phone: +91 ${shipping.phone}\n\n` +
      `ATTACHED DOCUMENT: Invoice_${order.id}.pdf\n\n` +
      `DISPATCHED FROM:\n` +
      `Kothari Footwear\n134, Near Tiranga Circle, Idar, Gujarat - 383430\n` +
      `Owner & Store Helpline: +91 94276 44222 / manakkothari132@gmail.com\n\n` +
      `With warm regards,\nShri Manak Kothari\nFounder & Master Shoemaker\nKOTHARI FOOTWEAR`;

    try {
      const prepared = await getPreparedPdf();

      // On mobile devices supporting Web Share API with files:
      // Shares the PDF file directly to Gmail or default mail app with the PDF attached!
      if (prepared?.file && navigator.canShare && navigator.canShare({ files: [prepared.file] })) {
        try {
          await navigator.share({
            title: emailSubject,
            text: emailBody,
            files: [prepared.file]
          });
          setIsSharing(false);
          return;
        } catch (shareErr) {
          if (shareErr?.name === 'AbortError') {
            setIsSharing(false);
            return;
          }
          console.warn('Native email share failed, using mailto fallback:', shareErr);
        }
      }

      // Fallback for desktop or devices without file sharing:
      // Download the PDF file to user's downloads folder and launch email client without about:blank
      if (prepared?.pdf) {
        triggerPdfBlobDownload(prepared.pdf, `Invoice_${order.id || 'KF-ORDER'}.pdf`);
      }
      const mailtoUrl = `mailto:${custEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoUrl;
    } catch (e) {
      console.warn('Email receipt sharing note:', e);
    } finally {
      setIsSharing(false);
    }
  };

  const orderItems = order.items || [];

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        overflowY: 'auto'
      }}
    >
      <div
        className="modal-card invoice-modal-container"
        style={{ width: '100%', maxWidth: '720px', padding: '1.25rem', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Hidden on print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-sage)', fontWeight: 700, fontSize: '0.8125rem' }}>
            <CheckCircle2 size={18} />
            <span>OFFICIAL RETAIL TAX INVOICE & RECEIPT</span>
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
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Instant Mobile & Email Dispatch Notice Banner */}
        <div className="no-print" style={{
          background: 'linear-gradient(135deg, #FAF8F5 0%, #E7EFE9 100%)',
          border: '1px solid rgba(46, 105, 61, 0.3)',
          borderRadius: '8px',
          padding: '0.65rem 0.85rem',
          marginBottom: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.76rem'
        }}>
          <div>
            <span style={{ fontWeight: 800, color: 'var(--accent-sage)' }}>
              📲 Order Confirmed!
            </span>
            <span style={{ color: 'var(--text-secondary)', marginLeft: '0.35rem' }}>
              Invoice details linked to Mobile: <strong>+91 {shipping.phone || '9427644222'}</strong>
              {order.customer?.email && <span> & Email: <strong>{order.customer.email}</strong></span>}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={handleWhatsAppCustomerInvoice}
              style={{
                background: '#15803D',
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <MessageCircle size={12} />
              <span>WhatsApp Invoice</span>
            </button>
            <button
              type="button"
              onClick={handleEmailCustomerInvoice}
              style={{
                background: '#1C1917',
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Mail size={12} />
              <span>Email Receipt</span>
            </button>
          </div>
        </div>

        {/* OFFICIAL KOTHARI FOOTWEAR INVOICE PAPER */}
        <div id="printable-invoice" style={{
          background: '#FFFFFF',
          border: '2px solid #E5DFD5',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          color: '#1C1917',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          
          {/* High-Resolution Water-Based Official KF Monogram Watermark (Pure KF, High Clarity) */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            pointerEvents: 'none',
            opacity: 0.11,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 0,
            userSelect: 'none'
          }}>
            <div style={{
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              border: '12px double #1C1917',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '10px'
            }}>
              <div style={{
                fontSize: '6.5rem',
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

          {/* Invoice Content Wrapper with zIndex to sit above watermark */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Invoice Header */}
            <div style={{
            display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #1C1917',
              paddingBottom: '0.85rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
            className="invoice-header-row">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  background: '#1C1917',
                  border: '1.5px solid #D4A373',
                  color: '#D4A373',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  fontFamily: "'Outfit', sans-serif",
                  flexShrink: 0
                }}>
                  KF
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.04em', margin: 0, color: '#1C1917', lineHeight: 1.15 }}>
                    KOTHARI FOOTWEAR
                  </h2>
                  <p style={{ fontSize: '0.68rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '2px 0 0 0', fontWeight: 700 }}>
                    Official Retailer & Handcrafted Heritage • Est. 1998
                  </p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
              <span style={{ display: 'inline-block', background: '#1C1917', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Retail Tax Invoice
              </span>
              <p style={{ fontSize: '0.92rem', fontWeight: 800, marginTop: '0.35rem', color: '#1C1917' }}>
                {order.id || 'KF-SAMPLE-INV'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#78716C' }}>
                Date: {order.date || '21 Sep 2026, 02:30 PM'}
              </p>
            </div>
          </div>

          {/* Two-Column Dispatched From vs Delivered To Routing Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.85rem',
            background: '#FAF8F5',
            padding: '0.9rem',
            borderRadius: '8px',
            border: '1px solid #EBE4D8',
            fontSize: '0.78rem',
            marginBottom: '1rem'
          }}
          className="invoice-address-grid">
            {/* Store Origin (Dispatched From) */}
            <div className="invoice-store-col" style={{ borderRight: '1px solid #E5DFD5', paddingRight: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#78716C', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                <MapPin size={12} style={{ color: '#2E693D' }} />
                <span>Dispatched From (Store Address):</span>
              </div>
              <p style={{ fontWeight: 800, color: '#1C1917', fontSize: '0.86rem', margin: '0 0 2px 0' }}>
                KOTHARI FOOTWEAR
              </p>
              <p style={{ color: '#57534E', lineHeight: 1.4, margin: '0 0 3px 0' }}>
                134, Near Tiranga Circle, Station Road <br />
                Idar, Dist. Sabarkantha, Gujarat - 383430
              </p>
              <p style={{ color: '#78716C', fontSize: '0.7rem', margin: 0 }}>
                📞 +91 94276 44222 • ✉️ manakkothari132@gmail.com
              </p>
            </div>

            {/* Customer Destination (Delivered To) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#78716C', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                <Truck size={12} style={{ color: '#D4A373' }} />
                <span>Delivered To (Customer Address):</span>
              </div>
              <p style={{ fontWeight: 800, color: '#1C1917', fontSize: '0.86rem', margin: '0 0 2px 0' }}>
                {shipping.fullName || order.customer?.name || 'Valued Customer'}
              </p>
              <p style={{ color: '#44403C', lineHeight: 1.4, margin: '0 0 3px 0' }}>
                {shipping.street || 'Near Royal Heritage, Main Road'} <br />
                {shipping.city || 'Ahmedabad'}{shipping.city || shipping.state ? ', ' : ''}{shipping.state || 'Gujarat'} {shipping.pincode ? `- ${shipping.pincode}` : '- 380001'}
              </p>
              <p style={{ color: '#57534E', fontSize: '0.72rem', margin: '0 0 2px 0' }}>
                📞 +91 {shipping.phone || order.customer?.phone || '9876543210'}
              </p>
              <p style={{ color: '#78716C', fontSize: '0.7rem', margin: 0 }}>
                Payment: <strong>{order.paymentMethod || 'UPI (Google Pay / PhonePe Verified)'}</strong>
                {order.utrNumber && <span style={{ color: '#2E693D', fontWeight: 700, marginLeft: '4px' }}>(UTR: {order.utrNumber})</span>}
              </p>
            </div>
          </div>

          {/* Mobile Horizontal Slide Hint */}
          <div className="mobile-invoice-slide-hint" style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            fontSize: '0.72rem',
            color: '#78716C',
            padding: '0.35rem',
            background: '#F5F5F4',
            borderRadius: '6px',
            marginBottom: '0.5rem',
            fontWeight: 700
          }}>
            <span>↔️ Slide table horizontally to view size, quantity & amount</span>
          </div>

          {/* Itemized Table - 100% Responsive & Slideable */}
          <div className="invoice-table-scroll" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '1rem' }}>
            <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: '#1C1917', color: '#FFFFFF', textAlign: 'left' }}>
                  <th style={{ padding: '0.45rem 0.6rem', borderRadius: '4px 0 0 0' }}>Item & Specifications</th>
                  <th style={{ padding: '0.45rem 0.5rem', textAlign: 'center' }}>Size</th>
                  <th style={{ padding: '0.45rem 0.5rem', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.45rem 0.6rem', textAlign: 'right', borderRadius: '0 4px 0 0' }}>Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E7E0D4' }}>
                    <td style={{ padding: '0.55rem 0.6rem' }}>
                      <div style={{ fontWeight: 700, color: '#1C1917' }}>{item.name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#78716C' }}>Color: {item.color || 'Standard'}</div>
                    </td>
                    <td style={{ padding: '0.55rem 0.5rem', textAlign: 'center', fontWeight: 700 }}>
                      IND {item.size || 8}
                    </td>
                    <td style={{ padding: '0.55rem 0.5rem', textAlign: 'center' }}>
                      {item.quantity || 1}
                    </td>
                    <td style={{ padding: '0.55rem 0.6rem', textAlign: 'right', fontWeight: 700 }}>
                      ₹{((item.price || 599) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Calculation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
            <div className="invoice-total-col" style={{ width: '250px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
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
                  <span>Coupon Discount:</span>
                  <span>-₹{(pricing.couponDiscount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#57534E' }}>
                <span>Delivery (India):</span>
                <span>{pricing.shippingFee === 0 ? 'FREE' : `₹${pricing.shippingFee}`}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1rem',
                fontWeight: 900,
                color: '#1C1917',
                borderTop: '2px solid #1C1917',
                paddingTop: '0.4rem',
                marginTop: '0.15rem'
              }}>
                <span>Total Payable:</span>
                <span>₹{(pricing.finalTotal || pricing.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Official Sign & Stylized Distinctive Seal */}
          <div
            className="invoice-footer-row"
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #E7E0D4',
            paddingTop: '0.85rem',
            marginTop: '0.85rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '0.68rem', color: '#78716C', maxWidth: '280px' }}>
              <p>✓ 100% Genuine Handcrafted Footwear Guaranteed</p>
              <p>✓ 7-Day Hassle-Free Doorstep Size Exchange</p>
              <p style={{ marginTop: '3px', fontStyle: 'italic', color: '#57534E' }}>Thank you for choosing Kothari Footwear, Idar.</p>
            </div>

            {/* Official Store Stamp & Owner Signature */}
            <div className="invoice-signature-group" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: 'auto' }}>
              {/* Stylized Distinctive Official Rubber Stamp */}
              <div style={{
                border: '2px solid #15803D',
                borderRadius: '50%',
                width: '88px',
                height: '88px',
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
                <span style={{ fontSize: '0.44rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
                  KOTHARI FOOTWEAR
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#15803D', lineHeight: 1, margin: '1px 0', fontFamily: "'Outfit', sans-serif" }}>
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

        {/* Action Buttons: Download, Print & WhatsApp */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
          
          <div className="invoice-action-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
            {/* Download Invoice (Works on Mobile & Laptop) */}
            <button
              type="button"
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              className="btn btn-sage"
              style={{ padding: '0.65rem', fontSize: '0.8125rem' }}
            >
              <Download size={15} />
              <span>{isDownloading ? 'Preparing PDF...' : 'Download PDF'}</span>
            </button>

            {/* Admin Only: WhatsApp & Email Sharing with Attached PDF */}
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={handleWhatsAppCustomerInvoice}
                  disabled={isSharing}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem', fontSize: '0.8125rem', color: '#15803D', borderColor: '#BBF7D0', background: '#F0FDF4' }}
                  title="Admin only: Share PDF Invoice directly on WhatsApp"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp Invoice (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={handleEmailCustomerInvoice}
                  disabled={isSharing}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem', fontSize: '0.8125rem', color: '#1C1917' }}
                  title="Admin only: Share PDF Invoice via Email"
                >
                  <Mail size={15} />
                  <span>Email Receipt (PDF)</span>
                </button>
              </>
            )}

            {/* Print Official Invoice */}
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-secondary"
              style={{ padding: '0.65rem', fontSize: '0.8125rem' }}
            >
              <Printer size={15} />
              <span>Print Invoice</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.7rem', fontSize: '0.85rem' }}
          >
            <span>Continue Shopping</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .mobile-invoice-slide-hint {
            display: flex !important;
          }
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-modal-container, #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          .invoice-modal-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};
