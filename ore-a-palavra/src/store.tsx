import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppData, GuidedPrayer, Profile, SavedPrayer, Settings } from './types'
import { THEME_BY_ID } from './data/themes'
import { isoDate, todayISO } from './lib/format'

const STORAGE_KEY = 'ore-a-palavra/v1'

const DEFAULT_SETTINGS: Settings = { aiEnabled: false, aiEndpoint: '/api/orar' }

const EMPTY: AppData = { profile: null, prayers: [], declaredDays: [], settings: DEFAULT_SETTINGS }

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function sanitize(parsed: Partial<AppData>): AppData {
  return {
    profile: parsed.profile ?? null,
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
  replaceAll: (data: AppData) => void
  clearAll: () => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(load)

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
      updateSettings(s) {
        setData((d) => ({ ...d, settings: { ...d.settings, ...s } }))
      },
      replaceAll(next) {
        setData(sanitize(next))
      },
      clearAll() {
        setData((d) => ({ ...EMPTY, profile: d.profile, settings: d.settings }))
      },
    }
  }, [data])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return ctx
}
