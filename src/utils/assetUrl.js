/**
 * Asset URL helper to ensure images, icons, and assets correctly resolve
 * across localhost development, Vercel, and GitHub Pages subpaths.
 */

/**
 * Prefixes a path with import.meta.env.BASE_URL if it is a local asset path.
 * - Leaves external URLs (http/https/data/blob) untouched.
 * - Prevents double prefixing if already prefixed.
 * - Ensures leading slash formatting is normalized with the configured base.
 */
export function getAssetUrl(path) {
  if (!path || typeof path !== 'string') return path;

  // External, data URI, or blob URLs are left unchanged
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const rawBase = import.meta.env.BASE_URL || '/';
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

  // If already prefixed with base, return as-is
  if (base !== '/' && path.startsWith(base)) {
    return path;
  }

  // Strip leading slashes and prepend base URL
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}${cleanPath}`;
}

/**
 * Normalizes a product object ensuring its image, gallery array,
 * and colorImages mapping all have proper asset URLs.
 */
export function normalizeProduct(product) {
  if (!product || typeof product !== 'object') return product;

  const image = getAssetUrl(product.image);

  let gallery = product.gallery;
  if (Array.isArray(gallery)) {
    gallery = gallery.map(getAssetUrl);
  } else if (image) {
    gallery = [image];
  } else {
    gallery = [];
  }

  let colorImages = product.colorImages;
  if (colorImages && typeof colorImages === 'object') {
    colorImages = Object.entries(colorImages).reduce((acc, [color, imgPath]) => {
      acc[color] = getAssetUrl(imgPath);
      return acc;
    }, {});
  }

  return {
    ...product,
    image,
    gallery,
    colorImages
  };
}

/**
 * Normalizes an array of products.
 */
export function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map(normalizeProduct);
}
