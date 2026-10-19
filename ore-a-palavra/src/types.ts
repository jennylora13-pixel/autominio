export interface ThemeVerse {
  /** Reference, e.g. "Filipenses 4:6-7" */
  ref: string
  text: string
  /** First-person declaration, completes "Por isso eu declaro: …" */
  declaration: string
}

export interface Theme {
  id: string
  name: string
  emoji: string
  /** Accent-free stems; a trailing "=" requires the whole word */
  keywords: string[]
  /** Completes "Pai, eu venho diante de Ti …" */
  opening: string
  closing: string
  verses: ThemeVerse[]
}

export type PrayerSource = 'biblioteca' | 'ia'

/** A prayer ready to be read, saved or shared. */
export interface GuidedPrayer {
  situation: string
  themeIds: string[]
  verses: ThemeVerse[]
  /** Paragraphs */
  paragraphs: string[]
  source: PrayerSource
}

export interface SavedPrayer extends GuidedPrayer {
  id: string
  title: string
  createdAt: number
  answeredAt: number | null
}

export interface Settings {
  aiEnabled: boolean
  /** URL of the prayer server (see server/server.mjs) */
  aiEndpoint: string
}

export interface AppData {
  prayers: SavedPrayer[]
  /** ISO dates (YYYY-MM-DD) on which the daily declaration was made */
  declaredDays: string[]
  settings: Settings
}

export type ThemeMode = 'light' | 'dark' | 'system'
