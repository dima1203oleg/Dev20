const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

// Vite provides `import.meta.env` in the browser bundle, while the contract
// runner imports this module directly in Node. Keep runtime configuration
// safe in both environments instead of assuming the Vite transform exists.
const viteEnv: Record<string, string | undefined> = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env ?? {};

/**
 * Runtime configuration for deployed environments.
 *
 * Empty API base intentionally keeps requests same-origin in local development.
 * External store URLs are optional until the official apps are published.
 */
export const runtimeConfig = {
  apiBaseUrl: trimTrailingSlash(viteEnv.VITE_API_BASE_URL?.trim() || ''),
  appStoreUrl: viteEnv.VITE_APP_STORE_URL?.trim() || null,
  googlePlayUrl: viteEnv.VITE_GOOGLE_PLAY_URL?.trim() || null,
  telegramUrl: viteEnv.VITE_TELEGRAM_URL?.trim() || 'https://t.me/siren_ua',
  youtubeUrl: viteEnv.VITE_YOUTUBE_URL?.trim() || null,
  facebookUrl: viteEnv.VITE_FACEBOOK_URL?.trim() || null,
  instagramUrl: viteEnv.VITE_INSTAGRAM_URL?.trim() || null,
} as const;

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return runtimeConfig.apiBaseUrl ? `${runtimeConfig.apiBaseUrl}${normalizedPath}` : normalizedPath;
}
