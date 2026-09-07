const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

/**
 * Runtime configuration for deployed environments.
 *
 * Empty API base intentionally keeps requests same-origin in local development.
 * External store URLs are optional until the official apps are published.
 */
export const runtimeConfig = {
  apiBaseUrl: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL?.trim() || ''),
  appStoreUrl: import.meta.env.VITE_APP_STORE_URL?.trim() || null,
  googlePlayUrl: import.meta.env.VITE_GOOGLE_PLAY_URL?.trim() || null,
  telegramUrl: import.meta.env.VITE_TELEGRAM_URL?.trim() || 'https://t.me/siren_ua',
  youtubeUrl: import.meta.env.VITE_YOUTUBE_URL?.trim() || null,
  facebookUrl: import.meta.env.VITE_FACEBOOK_URL?.trim() || null,
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL?.trim() || null,
} as const;

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return runtimeConfig.apiBaseUrl ? `${runtimeConfig.apiBaseUrl}${normalizedPath}` : normalizedPath;
}
