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
  /** Soft background sound while a prayer is read aloud */
  audioMusic: boolean
  /** Daily reminder with the declaration, at the prayer time (store apps only) */
  reminders: boolean
}

/** Woman or man; 'n' only until the person answers in the questionnaire. */
export type Gender = 'f' | 'm' | 'n'

export type Walk = 'firme' | 'buscando' | 'distante' | 'recomecando'

export type Relationship = 'solteiro' | 'namorando' | 'casado' | 'complicado'

export interface Person {
  name: string
  /** Why the person prays for them */
  note: string
}

/** Answers from the welcome questionnaire. Stays on the device. */
export interface Profile {
  name: string
  gender: Gender
  walk: Walk | null
  themeIds: string[]
  why: string
  obstacle: string
  past: string
  bigAsk: string
  relationship: Relationship | null
  partner: string
  partnerNote: string
  children: string[]
  people: Person[]
  work: string
  prayerTime: string
  completedAt: number
}

export interface Premium {
  active: boolean
  plan: string | null
  /** Unlocked from Ajustes for testing, not by a real purchase */
  test: boolean
}

export interface AppData {
  profile: Profile | null
  premium: Premium
  /** How many times each paid feature was used for free */
  freeUses: Record<string, number>
  prayers: SavedPrayer[]
  /** ISO dates (YYYY-MM-DD) on which the daily declaration was made */
  declaredDays: string[]
  settings: Settings
}

export type ThemeMode = 'light' | 'dark' | 'system'
