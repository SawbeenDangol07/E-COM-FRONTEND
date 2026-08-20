export const STORAGE_OPTIONS = [
  { value: "128 GB", label: "128 GB" },
  { value: "256 GB", label: "256 GB" },
  { value: "512 GB", label: "512 GB" },
  { value: "1 TB", label: "1 TB" },
];

export const RAM_OPTIONS = [
  { value: "6 GB", label: "6 GB" },
  { value: "8 GB", label: "8 GB" },
  { value: "12 GB", label: "12 GB" },
  { value: "16 GB", label: "16 GB+" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest Listings" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated Sellers" },
];

export const BRAND_LIST = [
  "Apple",
  "Samsung",
  "Google",
  "OnePlus",
  "Xiaomi",
  "Nothing",
  "Asus",
  "Sony",
  "Motorola",
];

export const CATEGORY_LIST = [
  { value: "flagship", label: "Flagship Phones" },
  { value: "foldable", label: "Foldables & Flip" },
  { value: "budget", label: "Budget & Mid-Range" },
  { value: "gaming", label: "Gaming Mobiles" },
  { value: "refurbished", label: "Certified Refurbished" },
  { value: "apple", label: "Apple Ecosystem" },
  { value: "android", label: "Android Flagships" },
];

/**
 * Universal Image URL resolver that safely extracts image URLs from:
 * - String URLs (http/https/data/blob or relative backend upload paths)
 * - Object representations ({ secure_url, url, path, thumbUrl, filename })
 * - Arrays of images or nested structures
 */
export const resolveImageUrl = (image, fallback = null) => {
  if (!image) return fallback;

  // Handle Array of images
  if (Array.isArray(image)) {
    if (image.length === 0) return fallback;
    return resolveImageUrl(image[0], fallback);
  }

  // Handle String image path / URL
  if (typeof image === "string") {
    const trimmed = image.trim();
    if (!trimmed) return fallback;
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:") ||
      trimmed.startsWith("blob:")
    ) {
      return trimmed;
    }
    // Relative upload path from backend API
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:9005/api/v1";
    const serverBase = apiBase.replace(/\/api(\/v\d+)?\/?$/, "");
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${serverBase}${cleanPath}`;
  }

  // Handle Object with various potential URL properties
  if (typeof image === "object") {
    if (image.secure_url) return resolveImageUrl(image.secure_url, fallback);
    if (image.url) return resolveImageUrl(image.url, fallback);
    if (image.thumbUrl) return resolveImageUrl(image.thumbUrl, fallback);
    if (image.path) return resolveImageUrl(image.path, fallback);
    if (image.filename) return resolveImageUrl(image.filename, fallback);
    if (image.image) return resolveImageUrl(image.image, fallback);
    if (image.images && Array.isArray(image.images)) return resolveImageUrl(image.images, fallback);
    if (image.file) return resolveImageUrl(image.file, fallback);
  }

  return fallback;
};
