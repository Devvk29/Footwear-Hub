import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useDatabase } from '../../context/DatabaseContext';
import { STORE_INFO } from '../../data/storeInfo';
import { getAssetUrl } from '../../utils/assetUrl';
import { MobileSideDrawer } from './MobileSideDrawer';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Ruler,
  Compass,
  LogOut,
  Package,
  ChevronDown,
  X,
  FileText,
  Sparkles,
  ArrowRight,
  Menu
} from 'lucide-react';

export const Navbar = ({
  activeGender,
  onSelectGender,
  searchQuery,
  onSearchChange,
  onOpenSizeGuide,
  onOpenStory,
  onOpenOrders,
  onOpenWishlist,
  onOpenAdmin,
  onQuickView
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, isOwner, openAuthModal, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { products } = useDatabase();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close search & user dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
        if (window.innerWidth < 768) {
          setIsMobileSearchExpanded(false);
        }
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Categorized Letter-by-Letter Live Matching Search Engine
  const searchResultsGrouped = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const matched = products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const brandMatch = p.brand?.toLowerCase().includes(q);
      const catMatch = p.category?.toLowerCase().includes(q);
      const subCatMatch = p.subCategory?.toLowerCase().includes(q);
      const occasionMatch = p.occasion?.toLowerCase().includes(q);
      const genderMatch = p.gender?.toLowerCase().includes(q);
      return nameMatch || brandMatch || catMatch || subCatMatch || occasionMatch || genderMatch;
    });

    const groups = {
      "Slippers & Daily Chappals": [],
      "Clogs & Crocs Style": [],
      "Formal Shoes & Loafers": [],
      "Ethnic Mojaris & Kolhapuris": [],
      "Sneakers & Walking": []
    };

    matched.forEach((item) => {
      const cat = item.category || '';
      if (cat.includes('Slipper') || cat.includes('Chappal')) {
        groups["Slippers & Daily Chappals"].push(item);
      } else if (cat.includes('Clogs') || cat.includes('Slides')) {
        groups["Clogs & Crocs Style"].push(item);
      } else if (cat.includes('Formal') || cat.includes('Loafer')) {
        groups["Formal Shoes & Loafers"].push(item);
      } else if (cat.includes('Ethnic') || cat.includes('Mojari')) {
        groups["Ethnic Mojaris & Kolhapuris"].push(item);
      } else {
        groups["Sneakers & Walking"].push(item);
      }
    });

    const activeGroups = Object.entries(groups).filter(([_, items]) => items.length > 0);
    return {
      totalCount: matched.length,
      activeGroups
    };
  }, [searchQuery, products]);

  const handleSelectSearchResult = (prod) => {
    setIsSearchOpen(false);
    setIsMobileSearchExpanded(false);
    if (onQuickView) onQuickView(prod);
  };

  return (
    <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container-custom navbar-main-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '66px', padding: '0.4rem 0.75rem', gap: '0.5rem' }}>

        {/* Left Side: KF Brand Logo & Drawer Menu Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>

          {/* Mobile Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setIsSideDrawerOpen(true)}
            className="mobile-menu-trigger-btn"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              flexShrink: 0
            }}
            title="Open Brand Navigation Menu"
          >
            <Menu size={18} />
          </button>

          {/* Professional KF Brand Logo */}
          <div
            onClick={() => {
              navigate('/');
              if (onSelectGender) onSelectGender('All');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', flexShrink: 0 }}
          >
            {/* Custom Styled KF Monogram Emblem */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1C1917 0%, #2E2926 100%)',
              border: '1.5px solid #D4A373',
              boxShadow: '0 3px 12px rgba(212, 163, 115, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <div style={{
                position: 'absolute',
                inset: '2px',
                border: '1px dashed rgba(212, 163, 115, 0.4)',
                borderRadius: '7px',
                pointerEvents: 'none'
              }} />
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                background: 'linear-gradient(135deg, #F6E6D3 0%, #D4A373 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1
              }}>
                KF
              </span>
            </div>

            <div className="navbar-brand-text">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.04em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  KOTHARI
                </span>
                <span style={{ fontSize: '0.55rem', background: 'var(--accent-sage-light)', color: 'var(--accent-sage)', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>
                  EST. 1998
                </span>
              </div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.03em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>
                Footwear
              </p>
            </div>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }} className="desktop-nav">
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              background: isActive ? 'var(--accent-charcoal)' : 'transparent',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.18s ease',
              boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.18)' : 'none'
            })}
          >
            All Footwear
          </NavLink>

          <NavLink
            to="/mens-wear"
            style={({ isActive }) => ({
              background: isActive ? 'var(--accent-charcoal)' : 'transparent',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.18s ease',
              boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.18)' : 'none'
            })}
          >
            Men's Wear <span style={{ fontSize: '0.7rem', opacity: 0.7, marginLeft: '4px' }}>(IND 6-12)</span>
          </NavLink>

          <NavLink
            to="/womens-wear"
            style={({ isActive }) => ({
              background: isActive ? 'var(--accent-charcoal)' : 'transparent',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.18s ease',
              boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.18)' : 'none'
            })}
          >
            Women's Wear <span style={{ fontSize: '0.7rem', opacity: 0.7, marginLeft: '4px' }}>(IND 3-9)</span>
          </NavLink>
        </nav>

        {/* Right Search, Actions & Slideable Action Strip */}
        <div className="navbar-actions-strip" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>

          {/* Live Search Bar with Intelligent Letter Matching */}
          <div ref={searchContainerRef} style={{ position: 'relative', zIndex: 30 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-primary)',
              border: isSearchOpen ? '1.5px solid var(--accent-sage)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 0.65rem',
              transition: 'all 0.25s ease',
              boxShadow: isSearchOpen ? 'var(--shadow-md)' : 'none'
            }}
              className="navbar-search-box"
            >
              <Search size={14} style={{ color: isSearchOpen ? 'var(--accent-sage)' : 'var(--text-muted)', marginRight: '0.35rem', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.78rem',
                  fontFamily: 'inherit',
                  width: '100%',
                  color: 'var(--text-primary)'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setIsSearchOpen(false);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Instant Live Grouped Search Results Dropdown */}
            {isSearchOpen && searchResultsGrouped && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                maxWidth: '90vw',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                maxHeight: '420px',
                overflowY: 'auto',
                padding: '0.75rem',
                zIndex: 1000,
                animation: 'slideUp 0.2s ease-out'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Found {searchResultsGrouped.totalCount} Matching Items
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-sage)', fontWeight: 600 }}>
                    Matching "{searchQuery}"
                  </span>
                </div>

                {searchResultsGrouped.activeGroups.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                    No footwear matching "{searchQuery}". Try "Paragon", "VKC", "Crocs", "Slipper", or "Oxford".
                  </div>
                ) : (
                  searchResultsGrouped.activeGroups.map(([groupTitle, items]) => (
                    <div key={groupTitle} style={{ marginBottom: '0.85rem' }}>
                      <div style={{
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        color: 'var(--accent-tan)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '0.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <span>•</span>
                        <span>{groupTitle}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({items.length})</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleSelectSearchResult(item)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.45rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease',
                              background: 'var(--bg-primary)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <img
                                src={getAssetUrl(item.image)}
                                alt={item.name}
                                style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }}
                              />
                              <div>
                                <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                  {item.name}
                                </p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  {item.brand} • {item.gender}
                                </p>
                              </div>
                            </div>

                            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--accent-sage)', flexShrink: 0 }}>
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Wishlist Button - Fully Clickable & Sized */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenWishlist();
            }}
            style={{
              position: 'relative',
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              flexShrink: 0,
              zIndex: 20
            }}
            title="Saved Wishlist"
          >
            <Heart size={17} style={{ color: (isLoggedIn && wishlistCount > 0) ? '#E11D48' : 'var(--text-primary)' }} fill={(isLoggedIn && wishlistCount > 0) ? '#E11D48' : 'none'} />
            {isLoggedIn && wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#E11D48',
                color: '#FFF',
                fontSize: '0.62rem',
                fontWeight: 700,
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              background: 'var(--accent-charcoal)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8125rem',
              flexShrink: 0,
              height: '38px'
            }}
          >
            <ShoppingBag size={16} />
            <span style={{ display: 'none' }} className="cart-text">Cart</span>
            {totalCount > 0 && (
              <span style={{
                background: 'var(--accent-sage)',
                color: '#FFF',
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                padding: '1px 5px'
              }}>
                {totalCount}
              </span>
            )}
          </button>

          {/* Auth / Profile Trigger (No Crown) */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {isLoggedIn ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => openAuthModal('profile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-subtle)',
                    padding: '0.35rem 0.6rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    height: '38px'
                  }}
                  title="Your Account Profile"
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isOwner ? '#1C1917' : 'var(--accent-sage)',
                    color: isOwner ? '#D4A373' : '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {isOwner ? 'KF' : (user?.name?.[0]?.toUpperCase() || 'U')}
                  </div>
                  <span className="navbar-user-name" style={{ maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="btn btn-primary navbar-signin-btn"
                style={{
                  padding: '0.4rem 0.7rem',
                  fontSize: '0.76rem',
                  background: 'linear-gradient(135deg, #1C1917 0%, #3D352E 100%)',
                  border: '1px solid #D4A373',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  whiteSpace: 'nowrap',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title="Sign In or Register with Mobile"
              >
                <User size={14} style={{ color: '#D4A373' }} />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Slideout Mobile Navigation Drawer */}
      <MobileSideDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        activeGender={activeGender}
        onSelectGender={(g) => {
          setIsSideDrawerOpen(false);
          onSelectGender(g);
        }}
        onOpenSizeGuide={() => {
          setIsSideDrawerOpen(false);
          onOpenSizeGuide();
        }}
        onOpenStory={() => {
          setIsSideDrawerOpen(false);
          onOpenStory();
        }}
        onOpenOrders={() => {
          setIsSideDrawerOpen(false);
          onOpenOrders();
        }}
        onOpenWishlist={() => {
          setIsSideDrawerOpen(false);
          onOpenWishlist();
        }}
        onOpenAdmin={() => {
          setIsSideDrawerOpen(false);
          onOpenAdmin();
        }}
      />

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-trigger-btn { display: none !important; }
          .cart-text { display: inline !important; }
          .navbar-search-box { width: 170px !important; }
        }
        @media (max-width: 899px) {
          .navbar-search-box { width: 95px !important; }
          .navbar-brand-text p { display: none !important; }
        }
        @media (max-width: 420px) {
          .navbar-search-box { width: 80px !important; padding: 0.3rem 0.45rem !important; }
          .navbar-main-container { padding: 0.35rem 0.4rem !important; gap: 0.25rem !important; }
          .navbar-actions-strip { gap: 0.25rem !important; }
        }
      `}</style>
    </header>
  );
};
