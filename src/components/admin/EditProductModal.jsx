import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Camera,
  Check,
  Sparkles,
  Layers,
  Palette,
  Eye,
  RefreshCw
} from 'lucide-react';
import { CATEGORIES_LIST } from '../../data/products';
import { getColorHex } from '../../utils/colorUtils';

// Fast client-side image compression to convert any mobile/desktop photo into a lightweight data URL
const compressImageFile = (file, maxWidth = 900, quality = 0.72) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
};

export const EditProductModal = ({ isOpen, product, onClose, onSave }) => {
  const isEditing = !!product;

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Paragon');
  const [gender, setGender] = useState('Men');
  const [category, setCategory] = useState('Slippers & Daily Chappals');
  const [subCategory, setSubCategory] = useState('Slippers');
  const [price, setPrice] = useState(399);
  const [originalPrice, setOriginalPrice] = useState(599);
  const [sizes, setSizes] = useState([6, 7, 8, 9, 10]);
  const [material, setMaterial] = useState('High-Traction PU Upper');
  const [sole, setSole] = useState('Anti-Skid Cushioned Rubber Sole');
  const [occasion, setOccasion] = useState('Daily Wear');
  const [ecoBadge, setEcoBadge] = useState('Waterproof & Durable');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Image & Color State
  const [mainImage, setMainImage] = useState('');
  const [colors, setColors] = useState(['Classic Brown', 'Jet Black']);
  const [colorImages, setColorImages] = useState({});
  const [gallery, setGallery] = useState([]);
  const [newColorInput, setNewColorInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url'

  const mainFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setBrand(product.brand || 'Paragon');
      setGender(product.gender || 'Men');
      setCategory(product.category || 'Slippers & Daily Chappals');
      setSubCategory(product.subCategory || 'Slippers');
      setPrice(product.price || 399);
      setOriginalPrice(product.originalPrice || 599);
      setSizes(product.sizes || (product.gender === 'Women' ? [4, 5, 6, 7] : [6, 7, 8, 9, 10, 11]));
      setMaterial(product.material || '');
      setSole(product.sole || '');
      setOccasion(product.occasion || 'Daily Wear');
      setEcoBadge(product.ecoBadge || 'Premium Footwear');
      setDescription(product.description || '');
      setInStock(product.inStock ?? true);
      setIsBestSeller(product.isBestSeller ?? false);

      setMainImage(product.image || '');
      setColors(product.colors && product.colors.length > 0 ? product.colors : ['Classic Brown']);
      setColorImages(product.colorImages || {});
      setGallery(product.gallery || [product.image || '']);
    } else {
      setName('');
      setBrand('Paragon');
      setGender('Men');
      setCategory('Slippers & Daily Chappals');
      setSubCategory('Slippers');
      setPrice(399);
      setOriginalPrice(599);
      setSizes([6, 7, 8, 9, 10]);
      setMaterial('Waterproof Synthetic PU');
      setSole('Cushioned Anti-Slip Sole');
      setOccasion('Daily Wear');
      setEcoBadge('Comfort Wear');
      setDescription('');
      setInStock(true);
      setIsBestSeller(false);
      setMainImage('');
      setColors(['Classic Brown', 'Jet Black']);
      setColorImages({});
      setGallery([]);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const availableSizes = gender === 'Women'
    ? [3, 4, 5, 6, 7, 8, 9]
    : [5, 6, 7, 8, 9, 10, 11, 12];

  const toggleSize = (sz) => {
    setSizes(prev =>
      prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz].sort((a, b) => a - b)
    );
  };

  // Main Image upload handler
  const handleMainFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const dataUrl = await compressImageFile(file, 900, 0.72);
      setMainImage(dataUrl);

      // Set default color image if first color has none
      if (colors.length > 0 && !colorImages[colors[0]]) {
        setColorImages(prev => ({ ...prev, [colors[0]]: dataUrl }));
      }
      if (gallery.length === 0) {
        setGallery([dataUrl]);
      }
    } catch (err) {
      alert('Could not process photo. Please try another image.');
    } finally {
      setIsUploading(false);
    }
  };

  // Gallery multi-file upload handler
  const handleGalleryFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      const compressedUrls = await Promise.all(
        files.map(f => compressImageFile(f, 900, 0.72))
      );
      setGallery(prev => [...prev, ...compressedUrls]);
    } catch (err) {
      alert('Could not process some photos.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryImage = (idx) => {
    setGallery(prev => prev.filter((_, i) => i !== idx));
  };

  // Color-specific photo upload handler
  const handleColorImageUpload = async (colorName, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const dataUrl = await compressImageFile(file, 900, 0.72);
      setColorImages(prev => ({
        ...prev,
        [colorName]: dataUrl
      }));
    } catch (err) {
      alert(`Could not upload photo for ${colorName}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddColor = () => {
    const c = newColorInput.trim();
    if (c && !colors.includes(c)) {
      setColors(prev => [...prev, c]);
      setNewColorInput('');
    }
  };

  const handleRemoveColor = (c) => {
    setColors(prev => prev.filter(x => x !== c));
    setColorImages(prev => {
      const copy = { ...prev };
      delete copy[c];
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a footwear name.');
      return;
    }
    if (!mainImage) {
      alert('Please upload a product photo.');
      return;
    }

    onSave({
      ...(product || {}),
      id: product?.id || `prod-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim() || 'Kothari Footwear',
      gender,
      category,
      subCategory,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      sizes: sizes.length > 0 ? sizes : [7, 8, 9, 10],
      colors: colors.length > 0 ? colors : ['Standard'],
      colorImages: Object.keys(colorImages).length > 0 ? colorImages : { [colors[0] || 'Standard']: mainImage },
      image: mainImage,
      gallery: gallery.length > 0 ? gallery : [mainImage],
      material,
      sole,
      occasion,
      ecoBadge,
      description,
      inStock,
      isBestSeller
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1300, padding: '0.5rem' }}>
      <div
        className="modal-card edit-product-modal-card"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '16px',
          background: '#FFFFFF'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#F9FAFB'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#15803D', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={14} />
              <span>Owner Product Studio • Shri Manak Kothari</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', margin: '2px 0 0' }}>
              {isEditing ? `Edit Item: ${product.name}` : 'Add New Footwear (With Photo Upload)'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F3F4F6',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#111827'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', background: '#FAFAFA' }}>

          {/* 1. PHOTO UPLOAD SECTION */}
          <div style={{
            background: '#FFFFFF',
            border: '2px dashed #D1D5DB',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Camera size={16} style={{ color: '#15803D' }} />
                <span>Product Main Photo (Camera / Phone Gallery / PC) *</span>
              </label>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    borderRadius: '6px',
                    border: 'none',
                    background: activeTab === 'upload' ? '#111827' : '#F3F4F6',
                    color: activeTab === 'upload' ? '#FFF' : '#374151',
                    cursor: 'pointer'
                  }}
                >
                  Upload File / Camera
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    borderRadius: '6px',
                    border: 'none',
                    background: activeTab === 'url' ? '#111827' : '#F3F4F6',
                    color: activeTab === 'url' ? '#FFF' : '#374151',
                    cursor: 'pointer'
                  }}
                >
                  Paste URL
                </button>
              </div>
            </div>

            {/* Hidden Input for Main Image File Picker */}
            <input
              ref={mainFileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleMainFileChange}
            />

            {activeTab === 'upload' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mainImage ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: '#F9FAFB',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#F3F4F6', flexShrink: 0, border: '1px solid #D1D5DB' }}>
                      <img src={mainImage} alt="Main product preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827' }}>
                        ✓ Photo Loaded Successfully
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#4B5563', margin: '2px 0 0' }}>
                        Optimized for customer browsing on all screens.
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => mainFileInputRef.current?.click()}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          <RefreshCw size={12} />
                          <span>Change Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMainImage('')}
                          style={{
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => mainFileInputRef.current?.click()}
                    style={{
                      background: '#F9FAFB',
                      padding: '1.5rem 1rem',
                      borderRadius: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1px solid #E5E7EB',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#DCFCE7',
                      color: '#15803D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem'
                    }}>
                      <Upload size={20} />
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>
                      {isUploading ? 'Compressing & Uploading Photo...' : 'Tap to Upload Photo or Snap with Camera'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.2rem' }}>
                      Works with Mobile Camera, Gallery, and PC (JPG, PNG, WEBP)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  placeholder="https://example.com/shoe-photo.jpg"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1.5px solid #D1D5DB',
                    background: '#FFFFFF',
                    fontSize: '0.85rem',
                    color: '#111827',
                    outline: 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* 2. COLOR OPTIONS & COLOR-SPECIFIC PHOTOS */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
              🎨 Color Options & Color-Specific Photos
            </label>
            <p style={{ fontSize: '0.75rem', color: '#4B5563', marginBottom: '0.75rem', margin: '0 0 0.75rem' }}>
              Add colorways and optionally upload a distinct photo for each color.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {colors.map((cName) => {
                const hex = getColorHex(cName);
                const hasImg = !!colorImages[cName];
                const inputId = `color-upload-${cName.replace(/\s+/g, '-')}`;

                return (
                  <div
                    key={cName}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#F9FAFB',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: hex,
                          border: '2px solid #111827',
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827' }}>
                        {cName}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {hasImg && (
                        <div style={{ width: '34px', height: '34px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #D1D5DB' }}>
                          <img src={colorImages[cName]} alt={cName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}

                      <input
                        id={inputId}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleColorImageUpload(cName, e)}
                      />

                      <label
                        htmlFor={inputId}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', margin: 0 }}
                      >
                        <Camera size={13} />
                        <span>{hasImg ? 'Replace Photo' : 'Upload Photo'}</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveColor(cName)}
                        style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
                        title="Delete color"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add New Color */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                <input
                  type="text"
                  value={newColorInput}
                  onChange={(e) => setNewColorInput(e.target.value)}
                  placeholder="e.g. Tan Brown, Matte Black, Royal Blue"
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid #D1D5DB',
                    background: '#FFFFFF',
                    fontSize: '0.85rem',
                    color: '#111827',
                    outline: 'none'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddColor();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="btn btn-secondary"
                  style={{ padding: '0.55rem 0.95rem', fontSize: '0.8rem', fontWeight: 800 }}
                >
                  <Plus size={15} />
                  <span>Add Color</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. BASIC FOOTWEAR INFO */}
          <div className="edit-product-grid-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                Footwear Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Paragon Men's Classic PU Daily Slipper"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #D1D5DB',
                  background: '#FFFFFF',
                  fontSize: '0.875rem',
                  color: '#111827',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                Brand *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Paragon, VKC, Bata, Crocs, Adidas, Kothari"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #D1D5DB',
                  background: '#FFFFFF',
                  fontSize: '0.875rem',
                  color: '#111827',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Gender & Category */}
          <div className="edit-product-grid-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                Department *
              </label>
              <select
                value={gender}
                onChange={(e) => {
                  const newGen = e.target.value;
                  setGender(newGen);
                  setSizes(newGen === 'Women' ? [4, 5, 6, 7] : [6, 7, 8, 9, 10]);
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #D1D5DB',
                  background: '#FFFFFF',
                  fontSize: '0.875rem',
                  color: '#111827',
                  outline: 'none'
                }}
              >
                <option value="Men">Men's Footwear (IND 6–12)</option>
                <option value="Women">Women's Footwear (IND 3–9)</option>
                <option value="Unisex">Unisex / School (IND 4–11)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                Footwear Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #D1D5DB',
                  background: '#FFFFFF',
                  fontSize: '0.875rem',
                  color: '#111827',
                  outline: 'none'
                }}
              >
                {CATEGORIES_LIST.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="edit-product-grid-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                min={50}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #D1D5DB',
                  background: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#111827',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                Original MRP (₹)
              </label>
              <input
                type="number"
                min={50}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #D1D5DB',
                  background: '#FFFFFF',
                  fontSize: '0.9rem',
                  color: '#111827',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Available Sizes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#111827', marginBottom: '0.35rem' }}>
              Available Indian Sizes (IND / UK):
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {availableSizes.map(s => {
                const isSelected = sizes.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #111827' : '1px solid #D1D5DB',
                      background: isSelected ? '#111827' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#111827',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    IND {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gallery Angle Shots Upload */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ImageIcon size={16} />
                <span>Gallery Photos ({gallery.length})</span>
              </label>

              <input
                ref={galleryFileInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleGalleryFilesChange}
              />

              <button
                type="button"
                onClick={() => galleryFileInputRef.current?.click()}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 700 }}
              >
                <Plus size={14} />
                <span>Upload Photos</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {gallery.map((gImg, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    width: '70px',
                    height: '70px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #D1D5DB',
                    background: '#FFF'
                  }}
                >
                  <img src={gImg} alt={`gallery-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Technical Specs */}
          <div className="edit-product-grid-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                Sole Type
              </label>
              <input
                type="text"
                value={sole}
                onChange={(e) => setSole(e.target.value)}
                placeholder="e.g. Anti-Skid Grip Rubber Sole"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #D1D5DB',
                  background: '#FFFFFF',
                  fontSize: '0.85rem',
                  color: '#111827',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                Eco / Craft Badge
              </label>
              <input
                type="text"
                value={ecoBadge}
                onChange={(e) => setEcoBadge(e.target.value)}
                placeholder="e.g. 100% Genuine Leather / Waterproof"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #D1D5DB',
                  background: '#FFFFFF',
                  fontSize: '0.85rem',
                  color: '#111827',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
              Shoe Description & Fitting Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comfort notes, sole cushioning details, and fitting recommendations."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #D1D5DB',
                background: '#FFFFFF',
                fontSize: '0.85rem',
                color: '#111827',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* In Stock & Bestseller Toggles */}
          <div style={{ display: 'flex', gap: '1.5rem', padding: '0.75rem 0', borderTop: '1px solid #E5E7EB', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                style={{ accentColor: '#15803D', width: '18px', height: '18px' }}
              />
              <span>In Stock & Ready for Dispatch</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                style={{ accentColor: '#111827', width: '18px', height: '18px' }}
              />
              <span>Mark as Bestseller</span>
            </label>
          </div>

          {/* Sticky Actions */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #E5E7EB',
            position: 'sticky',
            bottom: 0,
            background: '#FFFFFF',
            zIndex: 5
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.75rem', justifyContent: 'center', fontWeight: 700 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2, padding: '0.75rem', justifyContent: 'center', fontWeight: 800, background: '#111827', color: '#FFF' }}
            >
              <Save size={16} />
              <span>Save & Publish Live</span>
            </button>
          </div>

        </form>

        <style>{`
          @media (max-width: 640px) {
            .edit-product-grid-row {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
