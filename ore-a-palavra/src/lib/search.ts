import { THEMES } from '../data/themes'
import type { Theme } from '../types'

/** Lowercase, accent-free, punctuation turned into spaces. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function matches(text: string, keyword: string): boolean {
  const whole = keyword.endsWith('=')
  const kw = whole ? keyword.slice(0, -1) : keyword
  const pattern = new RegExp(`(^| )${kw}${whole ? '( |$)' : ''}`)
  return pattern.test(text)
}

/** Themes that fit the situation, best first. Empty when nothing matched. */
export function findThemes(situation: string, limit = 2): Theme[] {
  const text = normalize(situation)
  if (!text) return []
  return THEMES.map((theme) => ({
    theme,
    score:
      theme.keywords.filter((k) => matches(text, k)).length +
      (matches(text, normalize(theme.name)) ? 2 : 0),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.theme)
}

const CRISIS = [
  'suicid',
  'me matar',
  'tirar minha vida',
  'tirar a minha vida',
  'nao quero mais viver',
  'quero morrer',
  'acabar com tudo',
  'me machucar',
  'automutil',
  'me cortar',
]

/** True when the text suggests risk of self-harm — the UI then shows support contacts. */
export function looksLikeCrisis(situation: string): boolean {
  const text = normalize(situation)
  return CRISIS.some((c) => text.includes(c))
}
