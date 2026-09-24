import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CATEGORIES_LIST } from '../../data/products';

export const CategoryPills = ({
  selectedCategory,
  onSelectCategory
}) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', margin: '1.25rem 0 1rem' }}>
      
      {/* Primary Gender Pills with smooth horizontal slide - Synchronized via Real URL Routes */}
      <div
        className="mobile-slide-strip"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--bg-tertiary)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          width: 'fit-content',
          maxWidth: '100%',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: isActive ? 'var(--accent-charcoal)' : 'transparent',
            color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            display: 'inline-block'
          })}
        >
          All Footwear
        </NavLink>

        <NavLink
          to="/mens-wear"
          style={({ isActive }) => ({
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: isActive ? 'var(--accent-charcoal)' : 'transparent',
            color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            display: 'inline-block'
          })}
        >
          Men's Wear <span style={{ fontSize: '0.7rem', opacity: path === '/mens-wear' ? 0.85 : 0.65 }}>(IND 6–12)</span>
        </NavLink>

        <NavLink
          to="/womens-wear"
          style={({ isActive }) => ({
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: isActive ? 'var(--accent-charcoal)' : 'transparent',
            color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            display: 'inline-block'
          })}
        >
          Women's Wear <span style={{ fontSize: '0.7rem', opacity: path === '/womens-wear' ? 0.85 : 0.65 }}>(IND 3–9)</span>
        </NavLink>
      </div>

      {/* Subcategory brand/style tags slideable shelf */}
      <div
        className="mobile-slide-strip"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingBottom: '4px',
          width: '100%'
        }}
      >
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: isSelected ? '1.5px solid var(--accent-sage)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'var(--accent-sage-light)' : 'var(--bg-secondary)',
                color: isSelected ? 'var(--accent-sage)' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                flexShrink: 0,
                boxShadow: isSelected ? '0 2px 6px rgba(56,89,66,0.15)' : 'none'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

    </div>
  );
};
