type SupabaseConfig =
  | { status: 'missing' | 'invalid'; message: string }
  | { status: 'ready'; url: string; key: string };

export function readSupabaseConfig(urlValue?: string, keyValue?: string): SupabaseConfig {
  const url = urlValue?.trim();
  const key = keyValue?.trim();
  if (!url || !key) {
    return { status: 'missing', message: 'Add your Supabase URL and publishable key to .env.local, then restart the development server.' };
  }
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error('Invalid URL');
  } catch {
    return { status: 'invalid', message: 'VITE_SUPABASE_URL must be a valid HTTP or HTTPS URL.' };
  }
  if (!key.startsWith('sb_publishable_')) {
    return { status: 'invalid', message: 'Use a Supabase publishable key (sb_publishable_...). Secret and legacy keys are not accepted by this starter.' };
  }
  return { status: 'ready', url, key };
}
