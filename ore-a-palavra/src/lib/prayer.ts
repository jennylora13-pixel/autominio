import { THEMES } from '../data/themes'
import type { GuidedPrayer, Theme, ThemeVerse } from '../types'

const MAX_VERSES = 4

/** Builds a prayer from the library: opening, one paragraph per verse, closing. */
export function buildPrayer(situation: string, themes: Theme[]): GuidedPrayer {
  const [main, second] = themes
  const verses: ThemeVerse[] = second
    ? [...main.verses.slice(0, 3), second.verses[0]]
    : main.verses.slice(0, MAX_VERSES)

  const s = situation.trim()
  const paragraphs = [
    `Pai querido, eu venho diante de Ti ${main.opening}.` +
      (s ? ` Eu Te apresento esta situação: ${s.replace(/[.!?]*$/, '')}.` : ''),
    ...verses.map(
      (v) => `A Tua Palavra diz: "${v.text}" (${v.ref}). Por isso eu declaro: ${v.declaration}`,
    ),
    `${main.closing} Em nome de Jesus, amém.`,
  ]

  return { situation: s, themeIds: themes.map((t) => t.id), verses, paragraphs, source: 'biblioteca' }
}

export function prayerToText(p: GuidedPrayer): string {
  return p.paragraphs.join('\n\n') + '\n\n— Ore a Palavra'
}

export interface Declaration extends ThemeVerse {
  themeId: string
}

export const ALL_DECLARATIONS: Declaration[] = THEMES.flatMap((t) =>
  t.verses.map((v) => ({ ...v, themeId: t.id })),
)

/** Same declaration for everyone on a given day, changing daily. */
export function declarationOfDay(iso: string): Declaration {
  const [y, m, d] = iso.split('-').map(Number)
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86400000)
  // multiply by a prime so consecutive days jump between themes
  return ALL_DECLARATIONS[(dayNumber * 7) % ALL_DECLARATIONS.length]
}

/** "eu lanço…" -> "Eu lanço…" for standalone display. */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
