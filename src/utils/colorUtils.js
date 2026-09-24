// Color mapping utility for Indian footwear colors (Skechers, Adidas, ASICS, New Balance, Paragon, VKC, Kothari Heritage, Doctor Ortho)

export const getColorHex = (colorName = '') => {
  if (!colorName) return '#D4A373';
  const c = colorName.toLowerCase().trim();

  // 1. Blacks & Charcoals & Dark Slates
  if (c.includes('jet black') || c.includes('matte black') || c.includes('classic black') || c.includes('carbon black') || c.includes('royal jet black') || c.includes('midnight black') || c.includes('onyx black') || c.includes('triple black') || c.includes('core black') || c.includes('pure black') || c === 'black') {
    return '#18181B';
  }
  if (c.includes('slate') || c.includes('charcoal') || c.includes('graphite') || c.includes('gunmetal')) {
    return '#374151';
  }

  // 2. Greys & Silvers
  if (c.includes('ash grey') || c.includes('ash gray') || c.includes('heritage grey') || c.includes('grey') || c.includes('gray') || c.includes('silver')) {
    return '#64748B';
  }

  // 3. Whites & Off-Whites & Creams & Pearls
  if (c.includes('pure cloud white') || c.includes('cloud white') || c.includes('triple white') || c.includes('pure white') || c.includes('white')) {
    return '#FFFFFF';
  }
  if (c.includes('off-white') || c.includes('cream') || c.includes('ivory') || c.includes('pearl') || c.includes('sea salt') || c.includes('sand') || c.includes('nude') || c.includes('beige') || c.includes('oatmeal')) {
    return '#F5EBE1';
  }

  // 4. Golds & Bronzes & Yellows
  if (c.includes('rose gold')) {
    return '#B76E79';
  }
  if (c.includes('antique gold') || c.includes('shimmer gold') || c.includes('gold') || c.includes('golden') || c.includes('zari') || c.includes('mustard')) {
    return '#D4AF37';
  }
  if (c.includes('bronze') || c.includes('copper')) {
    return '#A16207';
  }
  if (c.includes('volt') || c.includes('neon')) {
    return '#CCFF00';
  }
  if (c.includes('lime') || c.includes('electric lime')) {
    return '#84CC16';
  }
  if (c.includes('yellow')) {
    return '#EAB308';
  }

  // 5. Browns, Tans, Cognacs & Teaks
  if (c.includes('honey tan') || c.includes('warm tan') || c.includes('deep tan') || c.includes('natural tan') || c.includes('oat tan') || c.includes('deep earth') || c.includes('tan')) {
    return '#C27803';
  }
  if (c.includes('cognac') || c.includes('chestnut') || c.includes('rich cocoa') || c.includes('espresso') || c.includes('mahogany') || c.includes('coffee') || c.includes('chocolate') || c.includes('cocoa') || c.includes('brown') || c.includes('teak')) {
    return '#6B3A19';
  }

  // 6. Blues, Navies & Cobalts
  if (c.includes('midnight blue') || c.includes('navy') || c.includes('cobalt') || c.includes('imperial blue') || c.includes('royal blue') || c.includes('blue') || c.includes('mist') || c.includes('sky')) {
    return '#1E3A8A';
  }

  // 7. Greens, Olives, Mints & Emeralds
  if (c.includes('olive') || c.includes('cargo') || c.includes('emerald') || c.includes('forest') || c.includes('green')) {
    return '#2D5A27';
  }
  if (c.includes('mint') || c.includes('sage') || c.includes('teal')) {
    return '#4D7C0F';
  }

  // 8. Reds, Maroons, Crimsons, Wines & Burgundies
  if (c.includes('crimson') || c.includes('maroon') || c.includes('wine') || c.includes('burgundy') || c.includes('bridal') || c.includes('ruby') || c.includes('red')) {
    return '#881337';
  }

  // 9. Pinks, Lilacs, Lavenders, Roses & Purples
  if (c.includes('blush pink') || c.includes('powder pink') || c.includes('muted rose') || c.includes('blush') || c.includes('rose') || c.includes('pink') || c.includes('blossom') || c.includes('peach') || c.includes('coral') || c.includes('mauve')) {
    return '#F472B6';
  }
  if (c.includes('lavender') || c.includes('lilac') || c.includes('purple') || c.includes('violet')) {
    return '#A855F7';
  }
  if (c.includes('orange')) {
    return '#EA580C';
  }

  // Fallback natural tan
  return '#D4A373';
};
