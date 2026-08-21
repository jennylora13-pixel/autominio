export interface Note {
  id: string
  title: string
  /** ISO date (YYYY-MM-DD) of the sermon/service */
  date: string
  preacher: string
  church: string
  series: string
  /** Scripture references, e.g. "João 3:16" */
  scriptures: string[]
  /** Main note body (plain text with line breaks) */
  body: string
  tags: string[]
  favorite: boolean
  createdAt: number
  updatedAt: number
}

export interface Verse {
  id: string
  /** Reference, e.g. "Salmos 23:1" */
  reference: string
  text: string
  note: string
  createdAt: number
}

export type PrayerStatus = 'aberto' | 'respondido'

export interface Prayer {
  id: string
  text: string
  status: PrayerStatus
  createdAt: number
  answeredAt: number | null
}

export interface AppData {
  notes: Note[]
  verses: Verse[]
  prayers: Prayer[]
}

export type ThemeMode = 'light' | 'dark' | 'system'
