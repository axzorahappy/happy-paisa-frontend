/// <reference types="vite/client" />

// Optional: explicitly type the env variables we use
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
