import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ArrowLeft,
  MessageCircle,
  Share2
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { INITIAL_PRODUCTS, getProductStockForSize } from '../data/products';
import { getColorHex } from '../utils/colorUtils';
import { STORE_INFO } from '../data/storeInfo';

export const ProductDetailPage = ({ onOpenSizeGuide, onOpenCheckout }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products } = useDatabase();
  const { addToCart, buyNow } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const product =
    (products || []).find((p) => String(p.id).toLowerCase() === String(productId).toLowerCase()) ||
    INITIAL_PRODUCTS.find((p) => String(p.id).toLowerCase() === String(productId).toLowerCase());

  const [selectedColor, setSelectedColor] = useState('Standard');
  const [selectedSize, setSelectedSize] = useState(8);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Standard';
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 8;
      setSelectedColor(defaultColor);
      setSelectedSize(defaultSize);

      const colorImg = (product.colorImages && product.colorImages[defaultColor]) ||
        (product.gallery && product.gallery[0]) ||
        product.image;
      setActiveImage(colorImg);
    }
  }, [productId, product?.id]);

  if (!product) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <h2>Footwear Not Found</h2>
        <p style={{ color: '#78716C', margin: '0.5rem 0 1.5rem' }}>
          The product you are looking for may have been moved or updated.
        </p>
        <Link to="/" className="btn btn-sage">
          <ArrowLeft size={16} />
          <span>Browse All Footwear</span>
        </Link>
      </div>
    );
  }

  const wish = isWishlisted(product.id);
  const currentStock = getProductStockForSize(product, selectedSize);
  const isOutOfStock = currentStock === 0;

  const handleColorChange = (colorName, idx) => {
    setSelectedColor(colorName);
    const resolvedImg =
      (product.colorImages && product.colorImages[colorName]) ||
      (product.gallery && product.gallery[idx]) ||
      product.image;
    setActiveImage(resolvedImg);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    buyNow(product, selectedSize, selectedColor);
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = (products || [])
    .filter((p) => p.id !== product.id && (p.gender === product.gender || p.category === product.category))
    .slice(0, 4);

  const genderUrl = product.gender === 'Women' ? '/womens-wear' : (product.gender === 'Kids' ? '/kids-wear' : '/mens-wear');

  return (
    <div className="container-custom" style={{ padding: '1.5rem 1rem 4rem' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#78716C', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link to={genderUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
          {product.gender}'s Wear
        </Link>
        <span>/</span>
        <span style={{ color: '#1C1917', fontWeight: 700 }}>{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'flex-start',
        marginBottom: '3rem'
      }}>
        
        {/* Left Side: Images & Gallery */}
        <div>
          {/* Main Photo Display */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '85%',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#F3EFE9',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <img
              src={activeImage || product.image}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {product.ecoBadge && (
              <span className="badge-pill badge-eco-pill" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                {product.ecoBadge}
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="shoe-wishlist-btn"
              style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              title="Save to Wishlist"
            >
              <Heart size={16} fill={wish ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Thumbnails Gallery */}
          {product.gallery && product.gallery.length > 1 && (
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.85rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: activeImage === imgUrl ? '2px solid #2E693D' : '1.5px solid #E5E7EB',
                    padding: 0,
                    background: '#F3EFE9',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Purchase Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', fontSize: '0.82rem', color: '#78716C' }}>
              <span style={{ fontWeight: 800, color: '#1C1917' }}>{product.brand}</span>
              <span>•</span>
              <span>{product.gender}'s Footwear</span>
              <span>•</span>
              <span style={{ color: '#2E693D', fontWeight: 700 }}>Artisan Handcrafted</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.85rem)', fontWeight: 900, color: '#1C1917', margin: 0, lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {/* Ratings & Best Seller */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#FEF3C7', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 800, color: '#92400E' }}>
                <Star size={13} fill="#D97706" color="#D97706" />
                <span>{product.rating || 4.9}</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#78716C' }}>({product.reviewCount || 120} Customer Reviews)</span>
              {product.isBestSeller && (
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px' }}>
                  BESTSELLER
                </span>
              )}
            </div>
          </div>

          {/* Price Strip */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1C1917' }}>
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: '1.1rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803D' }}>
                  {discountPercent}% OFF
                </span>
              </>
            )}
            <span style={{ fontSize: '0.72rem', color: '#78716C', marginLeft: 'auto' }}>
              Inclusive of all taxes
            </span>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.45rem' }}>
                Select Color: <span style={{ color: '#1C1917' }}>{selectedColor}</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.colors.map((c, idx) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleColorChange(c, idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: selectedColor === c ? '2px solid #1C1917' : '1.5px solid #E5E7EB',
                      background: selectedColor === c ? '#F9FAFB' : '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: selectedColor === c ? 800 : 500
                    }}
                  >
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: getColorHex(c), border: '1px solid rgba(0,0,0,0.15)' }} />
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection with Instant Stock Matrix */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
                Select Indian Size (IND / UK):
              </label>
              {onOpenSizeGuide && (
                <button
                  type="button"
                  onClick={() => onOpenSizeGuide(product.gender)}
                  style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Size Guide & Chart
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: '0.5rem' }}>
              {(product.sizes || [7, 8, 9, 10]).map((sz) => {
                const stock = getProductStockForSize(product, sz);
                const isSelected = selectedSize === sz;
                const isZero = stock === 0;

                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    disabled={isZero}
                    style={{
                      padding: '0.65rem 0.35rem',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #1C1917' : (isZero ? '1px dashed #D1D5DB' : '1.5px solid #E5E7EB'),
                      background: isSelected ? '#1C1917' : (isZero ? '#F3F4F6' : '#FFFFFF'),
                      color: isSelected ? '#FFFFFF' : (isZero ? '#9CA3AF' : '#111827'),
                      fontWeight: 800,
                      cursor: isZero ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      position: 'relative'
                    }}
                  >
                    <span style={{ fontSize: '0.9rem' }}>{sz}</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, color: isSelected ? '#A7F3D0' : (isZero ? '#DC2626' : (stock <= 3 ? '#D97706' : '#15803D')) }}>
                      {isZero ? 'Sold Out' : (stock <= 3 ? `${stock} left` : 'In Stock')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn btn-secondary"
                style={{ padding: '0.85rem', fontSize: '0.9rem', fontWeight: 800, justifyContent: 'center' }}
              >
                <ShoppingBag size={17} />
                <span>{addedNotice ? 'Added to Bag! ✓' : 'Add to Bag'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn btn-sage"
                style={{ padding: '0.85rem', fontSize: '0.9rem', fontWeight: 800, justifyContent: 'center' }}
              >
                <Zap size={17} />
                <span>{isOutOfStock ? 'Out of Stock' : 'Buy Now (Instant)'}</span>
              </button>
            </div>

            {/* WhatsApp Inquiry Button */}
            <a
              href={`https://wa.me/${STORE_INFO.contact.whatsapp}?text=${encodeURIComponent(`Hello Shri Manak Kothari, I am interested in ${product.name} (IND ${selectedSize}, ${selectedColor}). Please share more details.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem',
                borderRadius: '8px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#15803D',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={15} />
              <span>Ask Shri Manak Kothari on WhatsApp</span>
            </a>
          </div>

          {/* Value Propositions / Store Trust Badges */}
          <div style={{
            background: '#FAF8F5',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid #E5DFD5',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Truck size={16} style={{ color: '#2E693D', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#1C1917', display: 'block' }}>Express Delivery</strong>
                <span style={{ color: '#78716C' }}>Dispatched from Idar, Gujarat</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <RotateCcw size={16} style={{ color: '#D4A373', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#1C1917', display: 'block' }}>7-Day Size Exchange</strong>
                <span style={{ color: '#78716C' }}>Doorstep size swap assistance</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <ShieldCheck size={16} style={{ color: '#2E693D', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#1C1917', display: 'block' }}>100% Genuine</strong>
                <span style={{ color: '#78716C' }}>Direct from Kothari Footwear</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Check size={16} style={{ color: '#15803D', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#1C1917', display: 'block' }}>Tax Invoice Included</strong>
                <span style={{ color: '#78716C' }}>Official A4 GST invoice copy</span>
              </div>
            </div>
          </div>

          {/* Description & Specifications */}
          {product.description && (
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1917', marginBottom: '0.4rem' }}>
                Footwear Specifications & Materials
              </h3>
              <p style={{ color: '#57534E', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                {product.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.78rem' }}>
                {product.material && <div><strong>Upper:</strong> {product.material}</div>}
                {product.sole && <div><strong>Sole:</strong> {product.sole}</div>}
                {product.occasion && <div><strong>Occasion:</strong> {product.occasion}</div>}
                <div><strong>Dispatch Location:</strong> Idar, Gujarat - 383430</div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Related Products from same category */}
      {relatedProducts.length > 0 && (
        <div style={{ borderTop: '2px solid #E5DFD5', paddingTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C1917', marginBottom: '1rem' }}>
            Similar Footwear You Might Like
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', padding: '0.75rem' }}>
                  <div style={{ width: '100%', paddingTop: '85%', position: 'relative', background: '#F3EFE9', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <img src={p.image} alt={p.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', margin: '0 0 2px' }}>{p.name}</h4>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '4px' }}>{p.brand} • {p.gender}</div>
                  <div style={{ fontWeight: 900, color: '#15803D' }}>₹{p.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
