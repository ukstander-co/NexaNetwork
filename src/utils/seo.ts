/**
 * SEO Utilities for UKStander Curation Platform
 */

/**
 * Convert a dynamic product title into a clean, search-engine-friendly URL slug.
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except space and hyphens
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with a single hyphen
    .replace(/-+/g, "-") // Remove duplicate hyphens
    .replace(/^-+/, "") // Trim leading hyphens
    .replace(/-+$/, ""); // Trim trailing hyphens
}

/**
 * Generate a complete SEO-optimized URL for any product curation listing.
 */
export function getProductSeoUrl(id: string | number, title: string): string {
  const cleanId = id.toString().replace("db-", "");
  const slug = slugify(title);
  return `/product/${cleanId}${slug ? `-${slug}` : ""}`;
}
