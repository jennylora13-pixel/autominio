import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppData, GuidedPrayer, Premium, Profile, SavedPrayer, Settings } from './types'
import { FREE_USES, type PremiumFeature } from './lib/premium'
import { THEME_BY_ID } from './data/themes'
import { isoDate, todayISO } from './lib/format'

const STORAGE_KEY = 'ore-a-palavra/v1'

const DEFAULT_SETTINGS: Settings = { aiEnabled: false, aiEndpoint: '/api/orar', audioMusic: true }

const NO_PREMIUM: Premium = { active: false, plan: null, test: false }

const EMPTY: AppData = {
  profile: null,
  premium: NO_PREMIUM,
  freeUses: {},
  prayers: [],
  declaredDays: [],
  settings: DEFAULT_SETTINGS,
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function sanitize(parsed: Partial<AppData>): AppData {
  return {
    profile: parsed.profile ?? null,
    premium: { ...NO_PREMIUM, ...parsed.premium },
    freeUses: parsed.freeUses ?? {},
    prayers: parsed.prayers ?? [],
    declaredDays: parsed.declaredDays ?? [],
    settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
  }
}

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitize(JSON.parse(raw) as Partial<AppData>) : EMPTY
  } catch {
    return EMPTY
  }
}

function titleFor(p: GuidedPrayer): string {
  if (p.situation) return p.situation.length > 70 ? p.situation.slice(0, 67) + '…' : p.situation
  const theme = THEME_BY_ID[p.themeIds[0]]
  return theme ? `Oração: ${theme.name}` : 'Oração'
}

/** Consecutive days declared, ending today (or yesterday, if today is still pending). */
export function streak(days: string[]): number {
  const set = new Set(days)
  const cursor = new Date(todayISO() + 'T12:00:00')
  if (!set.has(todayISO())) cursor.setDate(cursor.getDate() - 1)
  let count = 0
  while (set.has(isoDate(cursor))) {
    count++
    cursor.setDate(cursor.getDate() - 1)
  }
  return count
}

interface Store {
  data: AppData
  saveProfile: (p: Profile) => void
  resetProfile: () => void
  savePrayer: (p: GuidedPrayer) => SavedPrayer
  toggleAnswered: (id: string) => void
  deletePrayer: (id: string) => void
  toggleDeclaredToday: () => void
  updateSettings: (s: Partial<Settings>) => void
  /** Why the paywall is open, or null when closed (not persisted) */
  paywall: PremiumFeature | 'ajustes' | null
  openPaywall: (reason: PremiumFeature | 'ajustes') => void
  closePaywall: () => void
  /**
   * Call when a paid feature is about to be used: returns true and counts the use
   * if allowed (premium or still within the free uses), otherwise opens the paywall.
   */
  tryPremium: (feature: PremiumFeature) => boolean
  /** True when this use is the free gift (to thank and explain what Premium adds) */
  isGift: (feature: PremiumFeature) => boolean
  setPremium: (p: Premium) => void
  replaceAll: (data: AppData) => void
  clearAll: () => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(load)
  const [paywall, setPaywall] = useState<Store['paywall']>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* quota / private mode — ignore */
    }
  }, [data])

  const store = useMemo<Store>(() => {
    return {
      data,
      saveProfile(profile) {
        setData((d) => ({ ...d, profile }))
      },
      resetProfile() {
        setData((d) => ({ ...d, profile: null }))
      },
      savePrayer(p) {
        const saved: SavedPrayer = {
          ...p,
          id: uid(),
          title: titleFor(p),
          createdAt: Date.now(),
          answeredAt: null,
        }
        setData((d) => ({ ...d, prayers: [saved, ...d.prayers] }))
        return saved
      },
      toggleAnswered(id) {
        setData((d) => ({
          ...d,
          prayers: d.prayers.map((p) =>
            p.id === id ? { ...p, answeredAt: p.answeredAt ? null : Date.now() } : p,
          ),
        }))
      },
      deletePrayer(id) {
        setData((d) => ({ ...d, prayers: d.prayers.filter((p) => p.id !== id) }))
      },
      toggleDeclaredToday() {
        const today = todayISO()
        setData((d) => ({
          ...d,
          declaredDays: d.declaredDays.includes(today)
            ? d.declaredDays.filter((x) => x !== today)
            : [...d.declaredDays, today],
        }))
      },
      paywall,
      openPaywall: setPaywall,
      closePaywall: () => setPaywall(null),
      tryPremium(feature) {
        if (data.premium.active) return true
        const used = data.freeUses[feature] ?? 0
        if (used >= FREE_USES) {
          setPaywall(feature)
          return false
        }
        setData((d) => ({ ...d, freeUses: { ...d.freeUses, [feature]: used + 1 } }))
        return true
      },
      isGift(feature) {
        return !data.premium.active && (data.freeUses[feature] ?? 0) === FREE_USES
      },
      setPremium(premium) {
        setData((d) => ({ ...d, premium }))
      },
      updateSettings(s) {
        setData((d) => ({ ...d, settings: { ...d.settings, ...s } }))
      },
      replaceAll(next) {
        setData(sanitize(next))
      },
      clearAll() {
        setData((d) => ({
          ...EMPTY,
          profile: d.profile,
          premium: d.premium,
          freeUses: d.freeUses,
          settings: d.settings,
        }))
      },
    }
  }, [data, paywall])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return ctx
}
