/**
 * Builds a URL for static assets
 * @param path The path to the asset
 * @returns The full URL to the asset
 */
export function buildUrl(path: string): string {
  // For local development and production
  return `/${path}`;
}
