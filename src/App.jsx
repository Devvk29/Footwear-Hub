import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';

import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { InvoicePage } from './pages/InvoicePage';
import { OrdersPage } from './pages/OrdersPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';

import { AuthModal } from './components/common/AuthModal';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { SizeAdvisorModal } from './components/common/SizeAdvisorModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { WishlistModal } from './components/common/WishlistModal';
import { Toast } from './components/common/Toast';
import { ShopStory } from './components/story/ShopStory';
import { WhatsAppDirect } from './components/story/WhatsAppDirect';
import { CartDrawer } from './components/checkout/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { MyOrdersModal } from './components/checkout/MyOrdersModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

function ShopApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOwner } = useAuth();
  const { allOrders } = useDatabase();
  const { setIsCartOpen } = useCart();

  // Active filters and query
  const [activeGender, setActiveGender] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Panels
  const [sizeGuideState, setSizeGuideState] = useState({ isOpen: false, gender: 'Men' });
  const [isSizeAdvisorOpen, setIsSizeAdvisorOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Close all modals, drawers, and quickview on any route navigation, and scroll to top
  useEffect(() => {
    setQuickViewProduct(null);
    setIsCheckoutOpen(false);
    setIsOrdersOpen(false);
    setIsWishlistOpen(false);
    setIsStoryOpen(false);
    setSizeGuideState({ isOpen: false, gender: 'Men' });
    setIsSizeAdvisorOpen(false);
    setIsAdminOpen(false);
    setOrderSuccessData(null);
    setIsCartOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname, setIsCartOpen]);

  // Sync activeGender with current URL route
  useEffect(() => {
    if (location.pathname === '/mens-wear') {
      setActiveGender('Men');
    } else if (location.pathname === '/womens-wear') {
      setActiveGender('Women');
    } else if (location.pathname === '/kids-wear') {
      setActiveGender('Kids');
    } else if (location.pathname === '/') {
      setActiveGender('All');
    }
  }, [location.pathname]);

  // Backward compatibility: If URL has ?invoice=KF-123 or ?order=KF-123, navigate to /invoice/:id
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invoiceId = params.get('invoice') || params.get('order');
    if (invoiceId) {
      navigate(`/invoice/${invoiceId.trim().toUpperCase()}`, { replace: true });
    }
  }, [navigate]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectGender = (gender) => {
    setActiveGender(gender);
    if (gender === 'Men') {
      navigate('/mens-wear');
    } else if (gender === 'Women') {
      navigate('/womens-wear');
    } else if (gender === 'Kids') {
      navigate('/kids-wear');
    } else {
      navigate('/');
    }
  };

  const openSizeGuide = (gender = 'Men') => {
    setSizeGuideState({ isOpen: true, gender });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Responsive Sticky Navbar */}
      <Navbar
        activeGender={activeGender}
        onSelectGender={handleSelectGender}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSizeGuide={openSizeGuide}
        onOpenStory={() => navigate('/about')}
        onOpenOrders={() => navigate('/orders')}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => navigate('/admin')}
        onQuickView={(prod) => navigate(`/product/${prod.id}`)}
      />

      {/* Multi-Page Routes */}
      <main style={{ flex: 1, paddingBottom: '3.5rem' }}>
        <Routes>
          {/* Main Catalog Routes */}
          <Route
            path="/"
            element={
              <CatalogPage
                categoryGender="All"
                onOpenSizeGuide={openSizeGuide}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onOpenStory={() => navigate('/about')}
                onOpenAdmin={() => navigate('/admin')}
              />
            }
          />
          <Route
            path="/mens-wear"
            element={
              <CatalogPage
                categoryGender="Men"
                onOpenSizeGuide={openSizeGuide}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onOpenStory={() => navigate('/about')}
                onOpenAdmin={() => navigate('/admin')}
              />
            }
          />
          <Route
            path="/womens-wear"
            element={
              <CatalogPage
                categoryGender="Women"
                onOpenSizeGuide={openSizeGuide}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onOpenStory={() => navigate('/about')}
                onOpenAdmin={() => navigate('/admin')}
              />
            }
          />
          <Route
            path="/kids-wear"
            element={
              <CatalogPage
                categoryGender="Kids"
                onOpenSizeGuide={openSizeGuide}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onOpenStory={() => navigate('/about')}
                onOpenAdmin={() => navigate('/admin')}
              />
            }
          />

          {/* Dedicated Footwear Detail Page */}
          <Route
            path="/product/:productId"
            element={
              <ProductDetailPage
                onOpenSizeGuide={openSizeGuide}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
              />
            }
          />

          {/* Dedicated Tax Invoice Pages (Direct URLs, never blank) */}
          <Route path="/invoice/:orderId" element={<InvoicePage />} />
          <Route path="/invoice" element={<InvoicePage />} />

          {/* Dedicated Customer Orders & Tracking Page */}
          <Route path="/orders" element={<OrdersPage />} />

          {/* Dedicated About & Brand Heritage Story Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/story" element={<AboutPage />} />

          {/* Dedicated Owner Portal & Admin Dashboard */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer
        onOpenSizeGuide={openSizeGuide}
        onOpenStory={() => navigate('/about')}
        onSelectGender={handleSelectGender}
        onOpenAdmin={() => navigate('/admin')}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeGender={activeGender}
        onSelectGender={handleSelectGender}
        onOpenSizeGuide={openSizeGuide}
        onOpenStory={() => navigate('/about')}
        onOpenOrders={() => navigate('/orders')}
      />

      {/* Floating WhatsApp Consultation */}
      <WhatsAppDirect />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenSizeGuide={openSizeGuide}
        onOpenSampleInvoice={() => navigate('/invoice/KF-982104')}
      />

      {/* Global Modals */}
      <AuthModal
        onOpenOrders={() => navigate('/orders')}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => navigate('/admin')}
      />

      <SizeGuideModal
        isOpen={sizeGuideState.isOpen}
        onClose={() => setSizeGuideState({ isOpen: false, gender: 'Men' })}
        defaultGender={sizeGuideState.gender}
      />

      <SizeAdvisorModal
        isOpen={isSizeAdvisorOpen}
        onClose={() => setIsSizeAdvisorOpen(false)}
        defaultGender={activeGender === 'Women' ? 'Women' : 'Men'}
        onSelectSize={(size) => {
          addToast(`Size profile saved: IND ${size} applied!`, 'success');
        }}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenSizeGuide={() => setIsSizeAdvisorOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onQuickView={(prod) => navigate(`/product/${prod.id}`)}
      />

      <ShopStory
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={(order) => {
          setQuickViewProduct(null);
          setIsCheckoutOpen(false);
          addToast(`Order ${order.id} placed successfully!`, 'success');
          navigate(`/invoice/${order.id}`, { state: { from: '/orders' } });
        }}
      />

      <OrderSuccessModal
        order={orderSuccessData}
        isOpen={!!orderSuccessData}
        onClose={() => setOrderSuccessData(null)}
      />

      <MyOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        onBrowseCatalog={() => navigate('/')}
        onViewInvoice={(ord) => navigate(`/invoice/${ord.id}`)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ShopApp />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </DatabaseProvider>
  );
}
