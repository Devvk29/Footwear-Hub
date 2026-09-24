import React, { useState, useMemo, useEffect } from 'react';
import { HeroBanner } from '../components/shop/HeroBanner';
import { CategoryPills } from '../components/shop/CategoryPills';
import { FilterSidebar } from '../components/shop/FilterSidebar';
import { ProductGrid } from '../components/shop/ProductGrid';
import { EcoFeatures } from '../components/shop/EcoFeatures';
import { StoryBottomSection } from '../components/story/StoryBottomSection';
import { useDatabase } from '../context/DatabaseContext';

export const CatalogPage = ({
  categoryGender = 'All',
  onOpenSizeGuide,
  onOpenCheckout,
  onQuickView,
  onOpenStory,
  onOpenAdmin
}) => {
  const { products } = useDatabase();

  const [activeGender, setActiveGender] = useState(categoryGender);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState(3000);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setActiveGender(categoryGender);
    setSelectedCategory('all');
    setSelectedSizes([]);
    setPriceRange(3000);
    setSelectedOccasions([]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('popular');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryGender]);

  const handleToggleSize = (sizeNum) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeNum) ? prev.filter((s) => s !== sizeNum) : [...prev, sizeNum]
    );
  };

  const handleToggleOccasion = (occ) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const handleResetFilters = () => {
    setSelectedSizes([]);
    setSelectedCategory('all');
    setPriceRange(3000);
    setSelectedOccasions([]);
    setMinRating(0);
    setInStockOnly(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Gender Filter
      if (activeGender !== 'All') {
        const itemGender = item.gender || 'Men';
        if (activeGender === 'Men' && itemGender !== 'Men') return false;
        if (activeGender === 'Women' && itemGender !== 'Women') return false;
        if (activeGender === 'Kids' && itemGender !== 'Kids') return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        const matchCategory =
          (item.category && item.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
          (item.subCategory && item.subCategory.toLowerCase().includes(selectedCategory.toLowerCase()));
        if (!matchCategory) return false;
      }

      // 3. Price Filter
      if (item.price > priceRange) return false;

      // 4. Rating Filter
      if (minRating > 0 && (item.rating || 0) < minRating) return false;

      // 5. In-Stock Filter
      if (inStockOnly && !item.inStock) return false;

      // 6. Occasion Filter
      if (selectedOccasions.length > 0) {
        if (!selectedOccasions.includes(item.occasion)) return false;
      }

      // 7. Size Filter
      if (selectedSizes.length > 0) {
        const hasAnySize = selectedSizes.some((sz) => {
          if (item.stockPerSize && item.stockPerSize[sz] !== undefined) {
            return item.stockPerSize[sz] > 0;
          }
          return item.sizes && item.sizes.includes(sz);
        });
        if (!hasAnySize) return false;
      }

      return true;
    });
  }, [
    products,
    activeGender,
    selectedCategory,
    priceRange,
    minRating,
    inStockOnly,
    selectedOccasions,
    selectedSizes
  ]);

  const activeFilterCount =
    (selectedSizes.length > 0 ? 1 : 0) +
    (priceRange < 3000 ? 1 : 0) +
    (selectedOccasions.length > 0 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const getPageTitle = () => {
    if (activeGender === 'Men') return "Men's Handcrafted Footwear Collection";
    if (activeGender === 'Women') return "Women's Artisan Footwear & Chappals";
    if (activeGender === 'Kids') return "Kids' Durable Footwear & Sandals";
    return "All Handcrafted Footwear • Kothari Footwear";
  };

  const getPageSubtitle = () => {
    if (activeGender === 'Men') return "Formal Oxford, Derby, Daily Chappals & Mules in Indian Sizes 6 to 12";
    if (activeGender === 'Women') return "Comfort Daily Chappals, Ethnic Juttis & Wedges in Indian Sizes 4 to 9";
    if (activeGender === 'Kids') return "Durable School Shoes, Velcro Sandals & Lightweight Chappals";
    return "Handcrafted by Shri Manak Kothari in Idar, Gujarat since 1998";
  };

  return (
    <div>
      {/* Hero Showcase (Show full hero on home, or tailored category hero on category pages) */}
      {categoryGender === 'All' ? (
        <HeroBanner
          onSelectGender={setActiveGender}
          onOpenSizeGuide={onOpenSizeGuide}
          onOpenStory={onOpenStory}
          onOpenAdmin={onOpenAdmin}
        />
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
          color: '#FFFFFF',
          padding: '2.5rem 1rem',
          borderBottom: '2px solid #D4A373',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          <div className="container-custom">
            <span style={{
              display: 'inline-block',
              background: 'rgba(212, 163, 115, 0.15)',
              border: '1px solid #D4A373',
              color: '#D4A373',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 12px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.6rem'
            }}>
              Kothari Footwear • Estd. 1998
            </span>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 900, margin: '0 0 0.5rem', color: '#FFFFFF' }}>
              {getPageTitle()}
            </h1>
            <p style={{ color: '#D4D4D4', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
              {getPageSubtitle()}
            </p>
          </div>
        </div>
      )}

      {/* Main Shop Catalog */}
      <main id="products-catalog-section" className="container-custom" style={{ paddingBottom: '3rem' }}>
        
        {/* Category Pills */}
        <CategoryPills
          activeGender={activeGender}
          onSelectGender={setActiveGender}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Mobile Filter Trigger Button */}
        <div className="mobile-filter-trigger" style={{ display: 'none', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="btn btn-secondary"
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border-medium)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span>🎛️ Filter Footwear</span>
            {activeFilterCount > 0 ? (
              <span style={{
                background: 'var(--accent-sage)',
                color: '#FFF',
                fontSize: '0.7rem',
                padding: '1px 7px',
                borderRadius: 'var(--radius-full)'
              }}>
                {activeFilterCount} Active
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                (Sizes, Budget & Occasions)
              </span>
            )}
          </button>
        </div>

        {/* 2-Column Catalog Layout */}
        <div className="shop-main-layout">
          
          {/* Left Sticky Filter Sidebar (Desktop Only) */}
          <aside style={{ position: 'sticky', top: '90px' }} className="catalog-sidebar catalog-sidebar-desktop">
            <FilterSidebar
              activeGender={activeGender}
              selectedSizes={selectedSizes}
              onToggleSize={handleToggleSize}
              priceRange={priceRange}
              onChangePriceRange={setPriceRange}
              selectedOccasions={selectedOccasions}
              onToggleOccasion={handleToggleOccasion}
              minRating={minRating}
              onChangeMinRating={setMinRating}
              inStockOnly={inStockOnly}
              onToggleInStockOnly={setInStockOnly}
              onResetFilters={handleResetFilters}
              onOpenSizeGuide={onOpenSizeGuide}
            />
          </aside>

          {/* Right Product Grid */}
          <section style={{ flex: 1 }}>
            <ProductGrid
              products={filteredProducts}
              sortBy={sortBy}
              onChangeSortBy={setSortBy}
              onQuickView={onQuickView}
              onOpenCheckout={onOpenCheckout}
              onResetFilters={handleResetFilters}
              onOpenSizeGuide={onOpenSizeGuide}
              onOpenStory={onOpenStory}
            />
          </section>

        </div>

        {/* Mobile Filter Slide-out Modal */}
        {isMobileFilterOpen && (
          <div className="modal-overlay" onClick={() => setIsMobileFilterOpen(false)} style={{ padding: '0.75rem', alignItems: 'flex-end' }}>
            <div
              className="modal-card"
              style={{
                width: '100%',
                maxWidth: '480px',
                padding: '1.25rem',
                maxHeight: '85vh',
                overflowY: 'auto',
                borderRadius: '16px 16px 0 0',
                margin: '0 auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Filter & Refine Footwear
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>

              <FilterSidebar
                activeGender={activeGender}
                selectedSizes={selectedSizes}
                onToggleSize={handleToggleSize}
                priceRange={priceRange}
                onChangePriceRange={setPriceRange}
                selectedOccasions={selectedOccasions}
                onToggleOccasion={handleToggleOccasion}
                minRating={minRating}
                onChangeMinRating={setMinRating}
                inStockOnly={inStockOnly}
                onToggleInStockOnly={setInStockOnly}
                onResetFilters={handleResetFilters}
                onOpenSizeGuide={onOpenSizeGuide}
              />
            </div>
          </div>
        )}

      </main>

      {/* Trust & Eco-Friendly Credentials */}
      <EcoFeatures />

      {/* Brand Legacy Section */}
      <StoryBottomSection onOpenStory={onOpenStory} />
    </div>
  );
};
