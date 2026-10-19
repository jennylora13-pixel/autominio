import type { Gender } from '../types'

/**
 * Resolves "(a)" markers in library texts for how the person wants to be addressed:
 * "cansado(a)" -> "cansada" / "cansado"; "vencedor(a)" -> "vencedora" / "vencedor".
 * Neutral keeps the marker, which reads naturally in Portuguese.
 */
export function genderize(text: string, gender: Gender): string {
  if (gender === 'n') return text
  return text.replace(/(\p{L}+)\(a\)/gu, (_, word: string) => {
    if (gender === 'm') return word
    return word.endsWith('o') ? word.slice(0, -1) + 'a' : word + 'a'
  })
}

/** "Ana" / "Ana e Pedro" / "Ana, Pedro e Lia" */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  return names.slice(0, -1).join(', ') + ' e ' + names[names.length - 1]
}
