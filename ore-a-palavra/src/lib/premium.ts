// Plans and paid features. Prices are provisional: change them here.

export type PremiumFeature = 'paraVoce' | 'audio' | 'ia'
export type PlanId = 'anual' | 'mensal'

export interface Plan {
  id: PlanId
  name: string
  price: string
  detail: string
  badge?: string
  /** Checkout link (Stripe Payment Link, Hotmart, Kiwify…), set at build time */
  checkoutUrl: string | undefined
}

export const TRIAL_DAYS = 7

export const PLANS: Plan[] = [
  {
    id: 'anual',
    name: 'Anual',
    price: 'R$ 179,90 por ano',
    detail: 'R$ 14,99 por mês',
    badge: 'Mais escolhido · economize 40%',
    checkoutUrl: import.meta.env.VITE_CHECKOUT_ANUAL,
  },
  {
    id: 'mensal',
    name: 'Mensal',
    price: 'R$ 24,90 por mês',
    detail: 'Sem fidelidade',
    checkoutUrl: import.meta.env.VITE_CHECKOUT_MENSAL,
  },
]

/** Each paid feature can be used this many times before the paywall appears. */
export const FREE_USES = 1

export const BENEFITS = [
  'Orações “Para você”, com o nome de quem você ama',
  'Oração em áudio, com fundo suave',
  'Orações escritas com IA para a sua situação',
  'Apoie um app feito para levar a Palavra a mais pessoas',
]
