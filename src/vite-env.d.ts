/// <reference types="vite/client" />

// Optional: explicitly type the env variables we use
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_API_URL?: string
  readonly VITE_APP_URL?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_APP_ENVIRONMENT?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENABLE_DEBUG?: string
  readonly VITE_ENABLE_STRIPE?: string
  readonly DEV: boolean
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
