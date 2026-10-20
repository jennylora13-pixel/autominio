/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHECKOUT_ANUAL?: string
  readonly VITE_CHECKOUT_MENSAL?: string
  /** Full address of the prayer server, e.g. https://api.oreapalavra.com/api/orar */
  readonly VITE_API_URL?: string
}
