import { getSupabase } from './supabase';

export function getBackendUrl() {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
}

async function attachAuth(headers: Headers, devUserId?: string) {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const uid = data.session?.user?.id;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Always include X-User-Id fallback with Supabase user id during transition
    if (uid) {
      headers.set('X-User-Id', uid);
      return;
    }
  }
  // Pure dev fallback header when not signed in via Supabase
  if (devUserId) headers.set('X-User-Id', devUserId);
}

export async function api(path: string, opts: RequestInit = {}, devUserId?: string) {
  // In dev, use same-origin requests and let Vite dev proxy forward to backend
  const url = import.meta.env.DEV ? path : `${getBackendUrl()}${path}`;

  const headers = new Headers(opts.headers);
  // Only set Content-Type when sending a JSON body
  if (opts.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  await attachAuth(headers, devUserId);

  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

