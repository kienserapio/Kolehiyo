/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLIC_ANON_KEY: string
  // add other VITE_ prefixed environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
