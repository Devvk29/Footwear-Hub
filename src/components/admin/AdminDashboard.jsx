import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { STORE_INFO } from '../../data/storeInfo';
import { getProductStockForSize, getTotalProductStock } from '../../data/products';
import { EditProductModal } from './EditProductModal';
import { OrderSuccessModal } from '../checkout/OrderSuccessModal';
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Download,
  RotateCcw,
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Layers,
  ArrowUpRight,
  AlertTriangle,
  Calendar,
  Sparkles,
  FileText,
  Smartphone,
  Monitor,
  Key,
  Eye,
  Activity,
  MessageCircle
} from 'lucide-react';

export const AdminDashboard = ({ isOpen, onClose }) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    updateStockPerSize,
    batchAdvanceRestock,
    scheduleAdvanceRestock,
    resetToDefaultCatalog,
    customers,
    updateCustomerInfo,
    deleteCustomer,
    allOrders,
    updateOrderStatus,
    exportDatabase,
    ownerSignedIn,
    signInOwner,
    signOutOwner
  } = useDatabase();

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const statsStripRef = useRef(null);

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'stock', 'orders', 'customers'
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderCustomerFilter, setOrderCustomerFilter] = useState('');
  const [advanceBatchInputs, setAdvanceBatchInputs] = useState({});

  const [isStatsDragging, setIsStatsDragging] = useState(false);
  const [statsStartX, setStatsStartX] = useState(0);
  const [statsScrollLeft, setStatsScrollLeft] = useState(0);

  const onStatsMouseDown = (e) => {
    setIsStatsDragging(true);
    setStatsStartX(e.pageX - (statsStripRef.current?.offsetLeft || 0));
    setStatsScrollLeft(statsStripRef.current?.scrollLeft || 0);
  };
  const onStatsMouseLeave = () => setIsStatsDragging(false);
  const onStatsMouseUp = () => setIsStatsDragging(false);
  const onStatsMouseMove = (e) => {
    if (!isStatsDragging || !statsStripRef.current) return;
    e.preventDefault();
    const x = e.pageX - statsStripRef.current.offsetLeft;
    const walk = (x - statsStartX) * 1.5;
    statsStripRef.current.scrollLeft = statsScrollLeft - walk;
  };

  const handleTabClick = (tabKey, e) => {
    setActiveTab(tabKey);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  if (!isOpen) return null;

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (updateCustomerInfo) {
      await updateCustomerInfo(editingCustomer.id || editingCustomer.phone, editingCustomer);
    }
    setIsEditCustomerModalOpen(false);
    setEditingCustomer(null);
  };

  // Analytics stats
  const totalRevenue = allOrders.reduce((sum, ord) => sum + (ord.pricing?.finalTotal || 0), 0);
  const totalPairsSold = allOrders.reduce((sum, ord) => sum + (ord.items?.reduce((s, i) => s + i.quantity, 0) || 0), 0);
  const inStockCount = products.filter(p => p.inStock).length;
  const totalLoginsCount = customers.reduce((sum, c) => sum + (c.loginCount || 0), 0);
  const activeLoginsCount = customers.filter(c => c.lastLogin && !c.lastLogin.includes('Never')).length;

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (p.gender || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = (prodData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, prodData);
    } else {
      addProduct(prodData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200, padding: '0.5rem' }}>
      <div
        className="modal-card admin-dashboard-card"
        style={{
          width: '100%',
          maxWidth: '1100px',
          height: '94vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '16px',
          background: '#FFFFFF'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Owner Header */}
        <div style={{
          background: '#1C1917',
          color: '#FFFFFF',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '2px solid #D4A373'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '42px',
              height: '42px',
              minWidth: '42px',
              borderRadius: '10px',
              background: '#292524',
              border: '1.5px solid #D4A373',
              color: '#D4A373',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 900,
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.04em',
              flexShrink: 0
            }}>
              KF
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)',
                  fontWeight: 800,
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'visible'
                }}>
                  Owner Studio • Shri Manak Kothari
                </h3>
                <span style={{ background: '#253B2C', color: '#A7F3D0', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  LIVE STORE ADMIN
                </span>
              </div>
              <p style={{ color: '#D4D4D4', fontSize: '0.75rem', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {STORE_INFO.name} • Idar, Gujarat (+91 94276 44222)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {ownerSignedIn ? (
              <button
                type="button"
                onClick={signOutOwner}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', background: '#2E2B27', borderColor: '#45403B', color: '#A7F3D0' }}
                title="Signed in to cloud database. Click to sign out."
              >
                <ShieldCheck size={14} />
                <span>Cloud Connected</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={signInOwner}
                className="btn btn-sage"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', background: '#15803D', color: '#FFF' }}
              >
                <ShieldCheck size={14} />
                <span>Sign In with Google</span>
              </button>
            )}

            <button
              type="button"
              onClick={exportDatabase}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', background: '#2E2B27', borderColor: '#45403B', color: '#FFF' }}
              title="Download backup"
            >
              <Download size={14} />
              <span>Backup</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: '#2E2B27',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Interactive & Moveable Analytics Summary Strip (Click any card to switch & update) */}
        <div
          ref={statsStripRef}
          className="admin-stats-strip"
          onMouseDown={onStatsMouseDown}
          onMouseLeave={onStatsMouseLeave}
          onMouseUp={onStatsMouseUp}
          onMouseMove={onStatsMouseMove}
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            background: '#F9FAFB',
            borderBottom: '1px solid #E5E7EB',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            cursor: isStatsDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
        >
          {/* 1. Catalog Items -> Switches to Product Catalog to edit & update */}
          <div
            onClick={(e) => handleTabClick('inventory', e)}
            style={{
              flex: '0 0 auto',
              minWidth: '125px',
              background: activeTab === 'inventory' ? '#111827' : '#FFFFFF',
              color: activeTab === 'inventory' ? '#FFFFFF' : '#111827',
              padding: '0.55rem 0.75rem',
              borderRadius: '10px',
              border: activeTab === 'inventory' ? '2px solid #D4A373' : '1.5px solid #E5E7EB',
              boxShadow: activeTab === 'inventory' ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            title="Click to view and edit all catalog footwear products"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: activeTab === 'inventory' ? '#D4A373' : '#4B5563', textTransform: 'uppercase', fontWeight: 800 }}>
                Catalog Items
              </span>
              <ShoppingBag size={13} style={{ color: activeTab === 'inventory' ? '#D4A373' : '#6B7280' }} />
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: activeTab === 'inventory' ? '#FFFFFF' : '#111827', margin: '3px 0 0' }}>
              {products.length} Pairs
            </p>
            <span style={{ fontSize: '0.62rem', color: activeTab === 'inventory' ? '#A7F3D0' : '#15803D', fontWeight: 700, marginTop: '2px' }}>
              {inStockCount} In Stock
            </span>
          </div>

          {/* 2. Stock Matrix -> Switches to Advance Stock Manager */}
          <div
            onClick={(e) => handleTabClick('stock', e)}
            style={{
              flex: '0 0 auto',
              minWidth: '125px',
              background: activeTab === 'stock' ? '#111827' : '#FFFFFF',
              color: activeTab === 'stock' ? '#FFFFFF' : '#111827',
              padding: '0.55rem 0.75rem',
              borderRadius: '10px',
              border: activeTab === 'stock' ? '2px solid #D4A373' : '1.5px solid #E5E7EB',
              boxShadow: activeTab === 'stock' ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            title="Click to manage size-wise stock & batch restock"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: activeTab === 'stock' ? '#D4A373' : '#4B5563', textTransform: 'uppercase', fontWeight: 800 }}>
                Advance Stock
              </span>
              <Layers size={13} style={{ color: activeTab === 'stock' ? '#D4A373' : '#6B7280' }} />
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: activeTab === 'stock' ? '#FCD34D' : '#D97706', margin: '3px 0 0' }}>
              {products.reduce((acc, p) => acc + getTotalProductStock(p), 0)} Pairs
            </p>
            <span style={{ fontSize: '0.62rem', color: activeTab === 'stock' ? '#D1D5DB' : '#6B7280', fontWeight: 700, marginTop: '2px' }}>
              ⚡ Restock Hub
            </span>
          </div>

          {/* 3. Total Orders -> Switches to Customer Orders */}
          <div
            onClick={(e) => handleTabClick('orders', e)}
            style={{
              flex: '0 0 auto',
              minWidth: '125px',
              background: activeTab === 'orders' ? '#111827' : '#FFFFFF',
              color: activeTab === 'orders' ? '#FFFFFF' : '#111827',
              padding: '0.55rem 0.75rem',
              borderRadius: '10px',
              border: activeTab === 'orders' ? '2px solid #D4A373' : '1.5px solid #E5E7EB',
              boxShadow: activeTab === 'orders' ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            title="Click to view live customer orders & dispatch status"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: activeTab === 'orders' ? '#D4A373' : '#4B5563', textTransform: 'uppercase', fontWeight: 800 }}>
                Total Orders
              </span>
              <Package size={13} style={{ color: activeTab === 'orders' ? '#D4A373' : '#6B7280' }} />
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: activeTab === 'orders' ? '#FFFFFF' : '#111827', margin: '3px 0 0' }}>
              {allOrders.length} Orders
            </p>
            <span style={{ fontSize: '0.62rem', color: activeTab === 'orders' ? '#A7F3D0' : '#15803D', fontWeight: 700, marginTop: '2px' }}>
              {totalPairsSold} Pairs Sold
            </span>
          </div>

          {/* 4. Total Revenue -> Switches to Customer Orders & Invoices */}
          <div
            onClick={(e) => handleTabClick('orders', e)}
            style={{
              flex: '0 0 auto',
              minWidth: '125px',
              background: activeTab === 'orders' ? '#111827' : '#FFFFFF',
              color: activeTab === 'orders' ? '#FFFFFF' : '#111827',
              padding: '0.55rem 0.75rem',
              borderRadius: '10px',
              border: '1.5px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            title="Click to view store sales and invoices"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#4B5563', textTransform: 'uppercase', fontWeight: 800 }}>
                Total Revenue
              </span>
              <TrendingUp size={13} style={{ color: '#15803D' }} />
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#15803D', margin: '3px 0 0' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <span style={{ fontSize: '0.62rem', color: '#4B5563', fontWeight: 700, marginTop: '2px' }}>
              Verified Invoices
            </span>
          </div>

          {/* 5. Registered Users -> Switches to Customers database */}
          <div
            onClick={(e) => handleTabClick('customers', e)}
            style={{
              flex: '0 0 auto',
              minWidth: '135px',
              background: activeTab === 'customers' ? '#111827' : '#FFFFFF',
              color: activeTab === 'customers' ? '#FFFFFF' : '#111827',
              padding: '0.55rem 0.75rem',
              borderRadius: '10px',
              border: activeTab === 'customers' ? '2px solid #D4A373' : '1.5px solid #E5E7EB',
              boxShadow: activeTab === 'customers' ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            title="Click to view customer accounts and details"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: activeTab === 'customers' ? '#D4A373' : '#4B5563', textTransform: 'uppercase', fontWeight: 800 }}>
                Registered Users
              </span>
              <Users size={13} style={{ color: activeTab === 'customers' ? '#D4A373' : '#6B7280' }} />
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: activeTab === 'customers' ? '#FCD34D' : '#D97706', margin: '3px 0 0' }}>
              {customers.length} Users
            </p>
            <span style={{ fontSize: '0.62rem', color: activeTab === 'customers' ? '#D1D5DB' : '#6B7280', fontWeight: 700, marginTop: '2px' }}>
              {totalLoginsCount} Logins • {activeLoginsCount} Active
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className="admin-tab-bar"
          style={{
          display: 'flex',
          gap: '0.4rem',
          padding: '0.65rem 1.25rem',
          background: '#F3F4F6',
          borderBottom: '1px solid #E5E7EB',
          overflowX: 'auto'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'inventory' ? '#111827' : '#FFFFFF',
              color: activeTab === 'inventory' ? '#FFFFFF' : '#374151',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <ShoppingBag size={15} />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'stock' ? '#111827' : '#FFFFFF',
              color: activeTab === 'stock' ? '#FFFFFF' : '#374151',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Layers size={15} />
            <span>Advance Stock Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'orders' ? '#111827' : '#FFFFFF',
              color: activeTab === 'orders' ? '#FFFFFF' : '#374151',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Package size={15} />
            <span>Customer Orders ({allOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'customers' ? '#111827' : '#FFFFFF',
              color: activeTab === 'customers' ? '#FFFFFF' : '#374151',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Users size={15} />
            <span>Customers ({customers.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="admin-tab-body" style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', background: '#FAFAFA' }}>

          {/* TAB 1: PRODUCT CATALOG (EDIT CARDS RESPONSIVE ON MOBILE) */}
          {activeTab === 'inventory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6B7280' }} />
                  <input
                    type="text"
                    placeholder="Search footwear by name or brand..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                      borderRadius: '8px',
                      border: '1.5px solid #D1D5DB',
                      background: '#FFFFFF',
                      fontSize: '0.85rem',
                      color: '#111827',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="btn btn-sage"
                    style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', fontWeight: 800, background: '#15803D', color: '#FFF' }}
                  >
                    <Plus size={16} />
                    <span>+ Add New Footwear Pair</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Reload default catalog? This will refresh all standard products.")) {
                        resetToDefaultCatalog();
                      }
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '0.6rem 0.85rem', fontSize: '0.78rem', background: '#FFFFFF', color: '#374151' }}
                    title="Reload default catalog"
                  >
                    <RotateCcw size={14} />
                    <span>Reset Catalog</span>
                  </button>
                </div>
              </div>

              {/* Products Cards List (Optimized for Mobile & Desktop) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredProducts.map((p) => {
                  const stockTotal = getTotalProductStock(p);
                  return (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        background: '#FFFFFF',
                        flexWrap: 'wrap',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                      className="admin-product-row"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '220px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', background: '#F3F4F6', flexShrink: 0, border: '1px solid #E5E7EB' }}>
                          <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#4B5563', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, color: '#111827' }}>{p.brand}</span>
                            <span>• {p.gender}</span>
                            <span>• {p.category}</span>
                          </div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: '2px 0 4px', lineHeight: 1.25 }}>
                            {p.name}
                          </h4>
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                            {(p.sizes || []).map(s => {
                              const sQty = getProductStockForSize(p, s);
                              return (
                                <span key={s} style={{ fontSize: '0.68rem', background: sQty <= 2 ? '#FEE2E2' : '#F3F4F6', color: sQty <= 2 ? '#DC2626' : '#111827', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                  IND {s} ({sQty})
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Stock Status & Price */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: stockTotal <= 5 ? '#DC2626' : '#15803D',
                            background: stockTotal <= 5 ? '#FEF2F2' : '#ECFDF5',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            border: `1px solid ${stockTotal <= 5 ? '#FECACA' : '#A7F3D0'}`
                          }}>
                            📦 {stockTotal} pairs
                          </span>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '1.15rem', fontWeight: 900, color: '#111827', margin: 0 }}>
                            ₹{p.price.toLocaleString('en-IN')}
                          </p>
                          {p.originalPrice && (
                            <p style={{ fontSize: '0.72rem', color: '#6B7280', textDecoration: 'line-through', margin: 0 }}>
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions (Edit Card, Stock Toggle, Delete) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => toggleProductStock(p.id)}
                          style={{
                            padding: '0.45rem 0.8rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            border: 'none',
                            background: p.inStock ? '#DCFCE7' : '#FEE2E2',
                            color: p.inStock ? '#15803D' : '#DC2626',
                            cursor: 'pointer'
                          }}
                        >
                          {p.inStock ? '● In Stock' : '✕ Out of Stock'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          className="btn btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            background: '#111827',
                            color: '#FFFFFF',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Edit2 size={13} />
                          <span>Edit Card</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete ${p.name} from catalog?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          style={{
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            padding: '0.45rem',
                            color: '#DC2626',
                            cursor: 'pointer'
                          }}
                          title="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ADVANCE STOCK MATRIX */}
          {activeTab === 'stock' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: '#1C1917',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1.5px solid #D4A373',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Layers size={18} style={{ color: '#D4A373' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                      Size-Wise Stock Manager & Advance Restock
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#D1D5DB', marginTop: '4px', margin: 0 }}>
                    Add footwear pairs with 1-click batch restock (+5, +10, +25, +50) per size.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#D1D5DB', display: 'block' }}>Total Store Inventory</span>
                  <strong style={{ fontSize: '1.15rem', color: '#FCD34D' }}>
                    {products.reduce((acc, p) => acc + getTotalProductStock(p), 0)} pairs
                  </strong>
                </div>
              </div>

              {/* Stock Matrix Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredProducts.map((p) => {
                  const sizes = p.sizes || (p.gender === 'Women' ? [4, 5, 6, 7, 8] : [6, 7, 8, 9, 10]);
                  const totalStock = getTotalProductStock(p);
                  const isLowStock = totalStock <= 10;
                  const prodBatchInput = advanceBatchInputs[p.id] || { qty: 20, date: '' };

                  return (
                    <div
                      key={p.id}
                      className="admin-stock-card"
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        border: isLowStock ? '1.5px solid #F59E0B' : '1px solid #E5E7EB',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{ width: '54px', height: '54px', borderRadius: '8px', overflow: 'hidden', background: '#F3F4F6', flexShrink: 0 }}>
                            <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#4B5563' }}>
                              <span style={{ fontWeight: 800, color: '#111827' }}>{p.brand}</span>
                              <span>• {p.gender}</span>
                              <span>• ₹{p.price}</span>
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '2px 0 0' }}>
                              {p.name}
                            </h4>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {[5, 10, 25, 50].map((qty) => (
                            <button
                              key={qty}
                              type="button"
                              onClick={() => batchAdvanceRestock(p.id, qty, null, `Batch restock of +${qty} pairs per size`)}
                              style={{
                                background: qty === 50 ? '#111827' : '#F3F4F6',
                                color: qty === 50 ? '#FFFFFF' : '#111827',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                padding: '0.4rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                            >
                              +{qty} All Sizes
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Size Matrix Controls */}
                      <div className="admin-stock-size-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '0.5rem' }}>
                        {sizes.map((sz) => {
                          const sizeQty = getProductStockForSize(p, sz);
                          return (
                            <div
                              key={sz}
                              style={{
                                background: sizeQty === 0 ? '#FEF2F2' : (sizeQty <= 3 ? '#FFFBEB' : '#F9FAFB'),
                                border: `1.5px solid ${sizeQty === 0 ? '#FECACA' : (sizeQty <= 3 ? '#FDE68A' : '#E5E7EB')}`,
                                borderRadius: '8px',
                                padding: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#111827' }}>
                                IND {sz}
                              </span>
                              <span style={{ fontSize: '0.95rem', fontWeight: 900, color: sizeQty === 0 ? '#DC2626' : (sizeQty <= 3 ? '#D97706' : '#15803D') }}>
                                {sizeQty} pairs
                              </span>

                              <div style={{ display: 'flex', gap: '3px', width: '100%', marginTop: '2px' }}>
                                <button
                                  type="button"
                                  onClick={() => updateStockPerSize(p.id, sz, -1)}
                                  disabled={sizeQty === 0}
                                  style={{
                                    flex: 1,
                                    padding: '0.3rem',
                                    background: '#FFFFFF',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    cursor: sizeQty === 0 ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  -1
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateStockPerSize(p.id, sz, +1)}
                                  style={{
                                    flex: 1,
                                    padding: '0.3rem',
                                    background: '#DCFCE7',
                                    color: '#15803D',
                                    border: '1px solid #86EFAC',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  +1
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateStockPerSize(p.id, sz, +5)}
                                  style={{
                                    flex: 1,
                                    padding: '0.3rem',
                                    background: '#111827',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  +5
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS */}
          {activeTab === 'orders' && (() => {
            const displayAdminOrders = orderCustomerFilter
              ? allOrders.filter((o) => {
                  const filterClean = String(orderCustomerFilter).replace(/\D/g, '');
                  const filterPhone = filterClean.length >= 10 ? filterClean.slice(-10) : filterClean;
                  const filterText = String(orderCustomerFilter).toLowerCase().trim();

                  const oPhoneRaw = (o.customer?.phone || o.customerPhone || o.shippingAddress?.phone || '').replace(/\D/g, '');
                  const oPhone = oPhoneRaw.length >= 10 ? oPhoneRaw.slice(-10) : oPhoneRaw;
                  const oName = (o.customer?.name || o.shippingAddress?.fullName || '').toLowerCase().trim();
                  const oId = String(o.id || '').toLowerCase().trim();

                  if (filterPhone && oPhone && oPhone === filterPhone) return true;
                  if (filterText && oName && (oName.includes(filterText) || filterText.includes(oName))) return true;
                  if (filterText && oId && oId.includes(filterText)) return true;
                  return false;
                })
              : allOrders;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orderCustomerFilter && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 1rem',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    color: '#1E40AF',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <span>
                      Showing Invoices for Customer: <strong>{orderCustomerFilter}</strong> ({displayAdminOrders.length} order{displayAdminOrders.length !== 1 ? 's' : ''})
                    </span>
                    <button
                      type="button"
                      onClick={() => setOrderCustomerFilter('')}
                      style={{
                        background: '#DBEAFE',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#1E3A8A'
                      }}
                    >
                      Show All Store Orders
                    </button>
                  </div>
                )}

                {displayAdminOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6B7280' }}>
                    {orderCustomerFilter ? `No orders found for customer "${orderCustomerFilter}".` : 'No customer orders received yet.'}
                  </div>
                ) : (
                  displayAdminOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="admin-order-card"
                      style={{
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        background: '#FFFFFF',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>{ord.id}</span>
                          <span style={{ fontSize: '0.75rem', color: '#4B5563', marginLeft: '0.5rem' }}>• {ord.date}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151' }}>Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              border: '1.5px solid #D1D5DB',
                              background: '#FFFFFF',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: '#111827',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Order Placed - Handcrafted & Packing">Order Placed - Packing</option>
                            <option value="Dispatched via Bluedart (Express Courier)">Dispatched via Bluedart</option>
                            <option value="Out for Delivery in City">Out for Delivery</option>
                            <option value="Delivered Successfully">Delivered Successfully</option>
                          </select>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '0.75rem',
                        background: '#F9FAFB',
                        padding: '0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.8125rem'
                      }}>
                        <div>
                          <p style={{ fontWeight: 800, color: '#111827', margin: 0 }}>
                            {ord.shippingAddress?.fullName || ord.customer?.name || 'Customer'}
                          </p>
                          <p style={{ color: '#374151', margin: '2px 0' }}>
                            📞 +91 {ord.shippingAddress?.phone || ord.customer?.phone || ord.customerPhone || '—'}
                          </p>
                          <p style={{ color: '#4B5563', margin: 0 }}>Payment: <strong style={{ color: '#111827' }}>{ord.paymentMethod}</strong></p>
                        </div>

                        <div>
                          <p style={{ color: '#374151', margin: 0 }}>
                            📍 {ord.shippingAddress?.street || 'Delivery Address'}, {ord.shippingAddress?.city || 'City'}, {ord.shippingAddress?.state || 'State'} - {ord.shippingAddress?.pincode || ''}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {(ord.items || []).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#111827' }}>
                            <span>
                              <strong>{item.name}</strong> (IND {item.size} • Qty {item.quantity})
                            </span>
                            <span style={{ fontWeight: 800 }}>
                              ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div style={{
                        borderTop: '1px solid #E5E7EB',
                        paddingTop: '0.65rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        <div style={{ fontWeight: 800 }}>
                          <span style={{ color: '#374151' }}>Total Amount: </span>
                          <span style={{ color: '#15803D', fontSize: '1.1rem' }}>
                            ₹{(ord.pricing?.finalTotal || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          {/* Send WhatsApp directly to Customer Phone with PDF link & message */}
                          <button
                            type="button"
                            onClick={() => {
                              const rawPhone = (ord.customer?.phone || ord.shippingAddress?.phone || '').replace(/\D/g, '');
                              const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '';
                              const targetPhone = cleanPhone ? `91${cleanPhone}` : `91${STORE_INFO.contact.whatsapp}`;
                              const onlineInvoiceUrl = `${window.location.origin}/invoice/${ord.id}`;
                              const itemsText = (ord.items || []).map((it, idx) =>
                                `${idx + 1}. ${it.name} (IND ${it.size}) x${it.quantity} - ₹${((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}`
                              ).join('\n');
                              const msg =
                                `✨ *OFFICIAL TAX INVOICE & ORDER CONFIRMATION* ✨\n` +
                                `*KOTHARI FOOTWEAR (Est. 1998, Idar)*\n\n` +
                                `Dear ${ord.customer?.name || ord.shippingAddress?.fullName || 'Customer'},\n` +
                                `Here are the details of your retail tax invoice #${ord.id}:\n\n` +
                                `🧾 *INVOICE SUMMARY*\n` +
                                `━━━━━━━━━━━━━━━━━━━━━\n` +
                                `*Invoice No:* #${ord.id}\n` +
                                `*Total Amount:* ₹${(ord.pricing?.finalTotal || ord.pricing?.subtotal || 0).toLocaleString('en-IN')}\n` +
                                `*Payment Mode:* ${ord.paymentMethod || 'Verified UPI / COD'}\n` +
                                `*Delivery To:* ${ord.shippingAddress?.city || 'Idar Hub'} (${ord.shippingAddress?.pincode || ''})\n` +
                                `━━━━━━━━━━━━━━━━━━━━━\n` +
                                `*Purchased Items:*\n${itemsText}\n\n` +
                                `📄 *Download Official Tax Invoice PDF:*\n${onlineInvoiceUrl}\n\n` +
                                `Helpline: +91 94276 44222 (Shri Manak Kothari)\n` +
                                `Thank you for shopping with Kothari Footwear!`;
                              
                              window.open(`https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            className="btn btn-secondary"
                            style={{
                              padding: '0.45rem 0.8rem',
                              fontSize: '0.78rem',
                              background: '#F0FDF4',
                              color: '#15803D',
                              borderColor: '#BBF7D0',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              cursor: 'pointer'
                            }}
                            title="Send invoice & details directly to customer's WhatsApp"
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp Invoice</span>
                          </button>

                          {/* Email Invoice directly to Customer if Email Available */}
                          {(ord.customer?.email || ord.shippingAddress?.email) && (
                            <button
                              type="button"
                              onClick={() => {
                                const custEmail = ord.customer?.email || ord.shippingAddress?.email;
                                const onlineInvoiceUrl = `${window.location.origin}/invoice/${ord.id}`;
                                const subject = `Retail Tax Invoice #${ord.id} - Kothari Footwear (Est. 1998)`;
                                const body =
                                  `Dear ${ord.customer?.name || ord.shippingAddress?.fullName || 'Valued Customer'},\n\n` +
                                  `Thank you for shopping with Kothari Footwear.\n\n` +
                                  `Your Retail Tax Invoice #${ord.id} is confirmed.\n` +
                                  `Total Amount: ₹${(ord.pricing?.finalTotal || ord.pricing?.subtotal || 0).toLocaleString('en-IN')}\n` +
                                  `Payment: ${ord.paymentMethod || 'UPI / COD'}\n\n` +
                                  `Download & View Tax Invoice PDF:\n${onlineInvoiceUrl}\n\n` +
                                  `Warm regards,\nKothari Footwear, Idar (+91 94276 44222)`;
                                window.open(`mailto:${custEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                              }}
                              className="btn btn-secondary"
                              style={{
                                padding: '0.45rem 0.8rem',
                                fontSize: '0.78rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                cursor: 'pointer'
                              }}
                              title="Send invoice to customer via Email"
                            >
                              <Mail size={14} />
                              <span>Email</span>
                            </button>
                          )}

                          {/* View & Print in Same Site with Back to Admin */}
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              navigate(`/invoice/${ord.id}`, { state: { from: '/admin' } });
                            }}
                            className="btn btn-sage"
                            style={{
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.78rem',
                              background: '#15803D',
                              color: '#FFF',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              cursor: 'pointer'
                            }}
                            title="Open official Tax Invoice in this website"
                          >
                            <FileText size={14} />
                            <span>View & Print Tax Invoice</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            );
          })()}

          {/* TAB 4: CUSTOMERS & USER SIGN-IN ACTIVITY */}
          {activeTab === 'customers' && (() => {
            const filteredCusts = customers.filter(c => {
              const q = customerSearch.toLowerCase().trim();
              if (!q) return true;
              return (
                (c.name || '').toLowerCase().includes(q) ||
                (c.phone || '').includes(q) ||
                (c.email || '').toLowerCase().includes(q) ||
                (c.city || '').toLowerCase().includes(q) ||
                (c.securityPin || '').includes(q)
              );
            });

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Search and Summary Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  background: '#F9FAFB',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 0 240px' }}>
                    <Search size={16} style={{ color: '#9CA3AF' }} />
                    <input
                      type="text"
                      placeholder="Search customer by name, mobile, email, or PIN..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.8125rem',
                        outline: 'none'
                      }}
                    />
                    {customerSearch && (
                      <button
                        type="button"
                        onClick={() => setCustomerSearch('')}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', fontWeight: 700 }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#F3F4F6', color: '#111827', border: '1px solid #E5E7EB' }}>
                      👥 {customers.length} Registered
                    </span>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0' }}>
                      🔑 {totalLoginsCount} Total Logins
                    </span>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}>
                      ⚡ {activeLoginsCount} Active Sign-ins
                    </span>
                  </div>
                </div>

                {/* Mobile Horizontal Slide Hint */}
                <div className="mobile-only-slide-hint" style={{
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  color: '#6B7280',
                  padding: '0.35rem 0.65rem',
                  background: '#F3F4F6',
                  borderRadius: '6px',
                  fontWeight: 700
                }}>
                  <span>↔️ Slide table horizontally to view customer PINs, sign-ins & invoice history</span>
                </div>

                {/* Customers Table (Desktop & Tablets > 768px) */}
                <div className="table-responsive desktop-customer-table" style={{ overflowX: 'auto', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', minWidth: '760px' }}>
                    <thead>
                      <tr style={{ background: '#F3F4F6', textAlign: 'left', color: '#111827' }}>
                        <th style={{ padding: '0.75rem', borderBottom: '1.5px solid #D1D5DB', fontWeight: 800 }}>Customer</th>
                        <th style={{ padding: '0.75rem', borderBottom: '1.5px solid #D1D5DB', fontWeight: 800 }}>Mobile Number</th>
                        <th style={{ padding: '0.75rem', borderBottom: '1.5px solid #D1D5DB', fontWeight: 800 }}>Security PIN</th>
                        <th style={{ padding: '0.75rem', borderBottom: '1.5px solid #D1D5DB', fontWeight: 800 }}>Sign-in Activity & Device</th>
                        <th style={{ padding: '0.75rem', borderBottom: '1.5px solid #D1D5DB', fontWeight: 800 }}>Orders / Invoices</th>
                        <th style={{ padding: '0.75rem', borderBottom: '1.5px solid #D1D5DB', fontWeight: 800 }}>Registered</th>
                        <th style={{ padding: '0.75rem', borderBottom: '1.5px solid #D1D5DB', fontWeight: 800 }}>Role</th>
                        <th style={{ padding: '0.75rem', borderBottom: '1.5px solid #D1D5DB', fontWeight: 800, textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCusts.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
                            No registered accounts match your search.
                          </td>
                        </tr>
                      ) : (
                        filteredCusts.map((c) => {
                          const custOrders = allOrders.filter(
                            o => (c.phone && (o.customer?.phone === c.phone || o.customerPhone === c.phone)) ||
                                 (c.name && o.customer?.name?.toLowerCase() === c.name.toLowerCase())
                          );
                          const isMobileDevice = (c.lastDevice || '').includes('Mobile');

                          return (
                            <tr key={c.id || c.phone} style={{ borderBottom: '1px solid #E5E7EB' }}>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    minWidth: '32px',
                                    borderRadius: '50%',
                                    background: '#111827',
                                    color: '#D4A373',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.75rem'
                                  }}>
                                    {(c.name || 'U')[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p style={{ fontWeight: 800, color: '#111827', margin: 0 }}>{c.name}</p>
                                    <span style={{ fontSize: '0.68rem', color: '#6B7280' }}>{c.email || '—'}</span>
                                  </div>
                                </div>
                              </td>

                              <td style={{ padding: '0.75rem', color: '#111827', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                +91 {c.phone}
                              </td>

                              <td style={{ padding: '0.75rem' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  background: '#FEF3C7',
                                  color: '#92400E',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #FDE68A',
                                  letterSpacing: '0.05em'
                                }}>
                                  <Key size={11} /> {c.securityPin || '••••'}
                                </span>
                              </td>

                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{
                                      width: '7px',
                                      height: '7px',
                                      borderRadius: '50%',
                                      background: c.lastLogin && !c.lastLogin.includes('Never') ? '#10B981' : '#9CA3AF'
                                    }} />
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#111827' }}>
                                      {c.lastLogin || 'Never (Newly Registered)'}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#6B7280' }}>
                                    <span>
                                      {isMobileDevice ? '📱 Mobile' : '💻 Desktop'}
                                    </span>
                                    <span>•</span>
                                    <strong style={{ color: '#111827' }}>{c.loginCount || 0} logins</strong>
                                  </div>
                                </div>
                              </td>

                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    background: custOrders.length > 0 ? '#E0E7FF' : '#F3F4F6',
                                    color: custOrders.length > 0 ? '#3730A3' : '#4B5563'
                                  }}>
                                    {custOrders.length} Order{custOrders.length !== 1 ? 's' : ''}
                                  </span>
                                  {custOrders.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOrderCustomerFilter(c.phone || c.name);
                                        setActiveTab('orders');
                                      }}
                                      style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#2563EB',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        textDecoration: 'underline',
                                        padding: 0
                                      }}
                                    >
                                      View
                                    </button>
                                  )}
                                </div>
                              </td>

                              <td style={{ padding: '0.75rem', color: '#4B5563', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                {c.signupDate || '1998'}
                              </td>

                              <td style={{ padding: '0.75rem' }}>
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  background: (c.role || '').includes('Owner') ? '#DCFCE7' : '#F3F4F6',
                                  color: (c.role || '').includes('Owner') ? '#15803D' : '#111827',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {c.role || 'Customer'}
                                </span>
                              </td>

                              <td style={{ padding: '0.75rem', whiteSpace: 'nowrap', textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCustomer({ ...c });
                                      setIsEditCustomerModalOpen(true);
                                    }}
                                    style={{
                                      background: '#F3F4F6',
                                      border: '1px solid #D1D5DB',
                                      borderRadius: '6px',
                                      padding: '4px 8px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      color: '#111827',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                    title="Edit customer info"
                                  >
                                    <Edit2 size={12} />
                                    <span>Edit</span>
                                  </button>

                                  {!(c.role || '').includes('Owner') && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete customer "${c.name}" (+91 ${c.phone})? This will permanently remove their registered account and login credentials.`)) {
                                          if (deleteCustomer) {
                                            deleteCustomer(c.id || c.phone);
                                          }
                                        }
                                      }}
                                      style={{
                                        background: '#FEF2F2',
                                        border: '1px solid #FECACA',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        color: '#DC2626',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '3px'
                                      }}
                                      title="Delete customer"
                                    >
                                      <Trash2 size={12} />
                                      <span>Delete</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Dedicated Mobile Card View (Mobile screens <= 768px) */}
                <div className="mobile-customer-cards">
                  {filteredCusts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', color: '#6B7280' }}>
                      No registered accounts match your search.
                    </div>
                  ) : (
                    filteredCusts.map((c) => {
                      const custOrders = allOrders.filter(
                        o => (c.phone && (o.customer?.phone === c.phone || o.customerPhone === c.phone)) ||
                             (c.name && o.customer?.name?.toLowerCase() === c.name.toLowerCase())
                      );
                      const isMobileDevice = (c.lastDevice || '').includes('Mobile');
                      const isOwnerRole = (c.role || '').includes('Owner');

                      return (
                        <div
                          key={`mob-${c.id || c.phone}`}
                          style={{
                            background: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1.5px solid #E5E7EB',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
                          }}
                        >
                          {/* Card Header: Avatar, Name, Email & Role */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <div style={{
                                width: '38px',
                                height: '38px',
                                minWidth: '38px',
                                borderRadius: '50%',
                                background: '#111827',
                                color: '#D4A373',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 900,
                                fontSize: '0.85rem'
                              }}>
                                {(c.name || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <p style={{ fontWeight: 800, color: '#111827', margin: 0, fontSize: '0.95rem' }}>
                                  {c.name}
                                </p>
                                <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                                  {c.email || 'No email linked'}
                                </span>
                              </div>
                            </div>
                            <span style={{
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '20px',
                              background: isOwnerRole ? '#DCFCE7' : '#F3F4F6',
                              color: isOwnerRole ? '#15803D' : '#111827',
                              border: isOwnerRole ? '1px solid #BBF7D0' : '1px solid #E5E7EB'
                            }}>
                              {c.role || 'Customer'}
                            </span>
                          </div>

                          {/* Quick Info Grid: Phone + PIN + City */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '0.5rem',
                            background: '#F9FAFB',
                            padding: '0.65rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.75rem'
                          }}>
                            <div>
                              <span style={{ color: '#6B7280', fontSize: '0.68rem', display: 'block', fontWeight: 600 }}>Mobile Number</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                                <strong style={{ color: '#111827' }}>+91 {c.phone}</strong>
                              </div>
                            </div>
                            <div>
                              <span style={{ color: '#6B7280', fontSize: '0.68rem', display: 'block', fontWeight: 600 }}>Security PIN</span>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '2px',
                                fontWeight: 800,
                                background: '#FEF3C7',
                                color: '#92400E',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                border: '1px solid #FDE68A',
                                marginTop: '2px'
                              }}>
                                <Key size={10} /> {c.securityPin || '••••'}
                              </span>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                              <span style={{ color: '#6B7280', fontSize: '0.68rem', display: 'block', fontWeight: 600 }}>City / Region</span>
                              <span style={{ color: '#374151', fontWeight: 600 }}>📍 {c.city || 'Gujarat, India'}</span>
                            </div>
                          </div>

                          {/* Sign-in Activity & Orders Status */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.72rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: c.lastLogin && !c.lastLogin.includes('Never') ? '#10B981' : '#9CA3AF'
                              }} />
                              <span style={{ color: '#4B5563' }}>
                                {isMobileDevice ? '📱 Mobile' : '💻 Desktop'} • <strong>{c.loginCount || 0} logins</strong>
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '2px 7px',
                                borderRadius: '4px',
                                background: custOrders.length > 0 ? '#E0E7FF' : '#F3F4F6',
                                color: custOrders.length > 0 ? '#3730A3' : '#4B5563'
                              }}>
                                {custOrders.length} Order{custOrders.length !== 1 ? 's' : ''}
                              </span>
                              {custOrders.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOrderCustomerFilter(c.phone || c.name);
                                    setActiveTab('orders');
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#2563EB',
                                    cursor: 'pointer',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    textDecoration: 'underline',
                                    padding: 0
                                  }}
                                >
                                  View Invoices
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Direct Communication & Admin Action Buttons */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6', paddingTop: '0.65rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              {c.phone && (
                                <>
                                  <a
                                    href={`tel:+91${c.phone}`}
                                    style={{
                                      background: '#F3F4F6',
                                      color: '#111827',
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      textDecoration: 'none',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    <Phone size={12} style={{ color: '#15803D' }} />
                                    <span>Call</span>
                                  </a>
                                  <a
                                    href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(`Namaste ${c.name} ji! Greetings from Shri Manak Kothari (Kothari Footwear, Idar).`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      background: '#DCFCE7',
                                      color: '#15803D',
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      textDecoration: 'none',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    <MessageCircle size={12} />
                                    <span>WhatsApp</span>
                                  </a>
                                </>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCustomer({ ...c });
                                  setIsEditCustomerModalOpen(true);
                                }}
                                style={{
                                  background: '#F3F4F6',
                                  color: '#374151',
                                  border: '1px solid #D1D5DB',
                                  borderRadius: '6px',
                                  padding: '4px 9px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                              >
                                <Edit2 size={11} />
                                <span>Edit</span>
                              </button>
                              {!isOwnerRole && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete customer "${c.name}" (+91 ${c.phone})? This will permanently remove their registered account and login credentials.`)) {
                                      if (deleteCustomer) {
                                        deleteCustomer(c.id || c.phone);
                                      }
                                    }
                                  }}
                                  style={{
                                    background: '#FEE2E2',
                                    color: '#DC2626',
                                    border: '1px solid #FECACA',
                                    borderRadius: '6px',
                                    padding: '4px 9px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <Trash2 size={11} />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })()}

        </div>

        <EditProductModal
          isOpen={isEditModalOpen}
          product={editingProduct}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProduct}
        />

        {/* Invoice Inspection Modal from Admin Dashboard */}
        <OrderSuccessModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />

        {/* EDIT CUSTOMER MODAL */}
        {isEditCustomerModalOpen && editingCustomer && (
          <div className="modal-overlay" style={{ zIndex: 1300, padding: '0.75rem' }} onClick={() => setIsEditCustomerModalOpen(false)}>
            <div
              className="modal-card"
              style={{ width: '100%', maxWidth: '480px', padding: '1.25rem', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Edit2 size={16} style={{ color: 'var(--accent-sage)' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                    Edit Customer Profile
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditCustomerModalOpen(false)}
                  style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSaveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.25rem' }}>
                    Customer Full Name
                  </label>
                  <input
                    type="text"
                    value={editingCustomer.name || ''}
                    onChange={(e) => setEditingCustomer(prev => ({ ...prev, name: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1.5px solid #D1D5DB', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.25rem' }}>
                    Mobile Number (10 Digits)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                    required
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1.5px solid #D1D5DB', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.25rem' }}>
                    Security PIN (4 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={editingCustomer.securityPin || ''}
                    onChange={(e) => setEditingCustomer(prev => ({ ...prev, securityPin: e.target.value }))}
                    placeholder="e.g. 1234"
                    required
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1.5px solid #D1D5DB', fontSize: '0.85rem', outline: 'none', fontWeight: 700, letterSpacing: '0.05em' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.25rem' }}>
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. customer@example.in"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1.5px solid #D1D5DB', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.25rem' }}>
                    City / Region
                  </label>
                  <input
                    type="text"
                    value={editingCustomer.city || ''}
                    onChange={(e) => setEditingCustomer(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g. Ahmedabad, Gujarat"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1.5px solid #D1D5DB', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid #E5E7EB', paddingTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditCustomerModalOpen(false)}
                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #D1D5DB', background: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.15rem', fontSize: '0.8125rem', fontWeight: 700 }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};