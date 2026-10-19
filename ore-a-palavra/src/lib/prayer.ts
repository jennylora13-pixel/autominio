import { THEMES, THEME_BY_ID } from '../data/themes'
import { findThemes } from './search'
import { genderize, joinNames } from './gender'
import type { GuidedPrayer, Profile, Theme, ThemeVerse } from '../types'

const MAX_VERSES = 4

/** Personal lines for the themes being prayed, using names from the profile. */
function personalLines(themes: Theme[], profile: Profile): string[] {
  const ids = new Set(themes.map((t) => t.id))
  const lines: string[] = []
  const { partner, partnerNote, children, work } = profile

  if (ids.has('casamento') && partner) {
    const note = partnerNote.trim().replace(/[.!]*$/, '')
    lines.push(
      `Eu Te agradeço pela vida de ${partner}` +
        (note ? `, e por tudo o que admiro: ${note}.` : '.') +
        ' Guarda o nosso relacionamento e faz de nós um só coração em Ti.',
    )
  }
  if (ids.has('filhos') && children.length) {
    lines.push(
      `Eu coloco diante de Ti a vida de ${joinNames(children)}. Guarda, ensina e abençoa os meus filhos.`,
    )
  }
  if (ids.has('familia') && !ids.has('casamento') && !ids.has('filhos')) {
    const family = [partner, ...children].filter(Boolean)
    if (family.length) lines.push(`Eu apresento a Ti a minha casa: ${joinNames(family)}.`)
  }
  if (ids.has('trabalho') || ids.has('sabedoria') || ids.has('proposito')) {
    if (work === 'novo') lines.push('Tu sabes que estou pronto(a) para algo novo. Abre as portas certas e fecha as que não são Tuas.')
    if (work === 'paralelo') lines.push('Abençoa também o que estou construindo, para que seja para a Tua glória.')
  }
  return lines
}

/** Builds a prayer from the library: opening, personal lines, one paragraph per verse, closing. */
export function buildPrayer(
  situation: string,
  themes: Theme[],
  profile: Profile | null = null,
  label = 'esta situação',
): GuidedPrayer {
  const [main, second] = themes
  const verses: ThemeVerse[] = second
    ? [...main.verses.slice(0, 3), second.verses[0]]
    : main.verses.slice(0, MAX_VERSES)

  const s = situation.trim()
  // "Abrir uma clínica" reads mid-sentence after the colon; keep acronyms like "UTI"
  const inSentence = /^\p{Lu}\p{Ll}/u.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s
  const paragraphs = [
    `Pai querido, eu venho diante de Ti ${main.opening}.` +
      (s ? ` Eu Te apresento ${label}: ${inSentence.replace(/[.!?]*$/, '')}.` : ''),
    ...(profile ? personalLines(themes, profile) : []),
    ...verses.map(
      (v) => `A Tua Palavra diz: "${v.text}" (${v.ref}). Por isso eu declaro: ${v.declaration}`,
    ),
    `${main.closing} Em nome de Jesus, amém.`,
  ]

  return withGender(
    { situation: s, themeIds: themes.map((t) => t.id), verses, paragraphs, source: 'biblioteca' },
    profile,
  )
}

const INTERCESSION_VERSES: ThemeVerse[] = [
  {
    ref: 'Filipenses 1:3-4',
    text: 'Dou graças ao meu Deus todas as vezes que me lembro de vós, fazendo sempre, com gozo, oração por vós em todas as minhas súplicas.',
    declaration: 'eu dou graças por cada pessoa que Tu colocaste na minha vida e oro por elas com alegria.',
  },
  {
    ref: 'Números 6:24-26',
    text: 'O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e tenha misericórdia de ti; o Senhor sobre ti levante o seu rosto e te dê a paz.',
    declaration: 'o Senhor abençoa, guarda e dá paz a cada um que eu levo no coração.',
  },
]

/** Prayer for the people the person carries in their heart, by name. */
export function buildIntercession(profile: Profile): GuidedPrayer {
  const lines: string[] = []
  if (profile.partner) lines.push(`Eu levanto diante de Ti a vida de ${profile.partner}.`)
  if (profile.children.length) {
    lines.push(`Eu coloco nas Tuas mãos a vida de ${joinNames(profile.children)}.`)
  }
  for (const p of profile.people) {
    const note = p.note.trim().replace(/[.!]*$/, '')
    lines.push(`Eu Te apresento ${p.name}` + (note ? `: ${note}.` : '.'))
  }
  const paragraphs = [
    'Pai querido, eu venho diante de Ti trazendo as pessoas que carrego no coração.',
    ...lines,
    ...INTERCESSION_VERSES.map(
      (v) => `A Tua Palavra diz: "${v.text}" (${v.ref}). Por isso eu declaro: ${v.declaration}`,
    ),
    'Que cada pessoa aqui conheça o Teu amor de um jeito novo. Em nome de Jesus, amém.',
  ]
  return withGender(
    { situation: '', themeIds: ['familia'], verses: INTERCESSION_VERSES, paragraphs, source: 'biblioteca' },
    profile,
  )
}

function withGender(p: GuidedPrayer, profile: Profile | null): GuidedPrayer {
  const g = profile?.gender ?? 'n'
  return {
    ...p,
    paragraphs: p.paragraphs.map((x) => genderize(x, g)),
    verses: p.verses.map((v) => ({ ...v, declaration: genderize(v.declaration, g) })),
  }
}

export interface ForYouCard {
  key: string
  emoji: string
  title: string
  subtitle: string
  build: () => GuidedPrayer
}

/** Cards for the "Para você" section, built from the questionnaire answers. */
export function forYou(profile: Profile): ForYouCard[] {
  const cards: ForYouCard[] = []
  const lovedOnes = [profile.partner, ...profile.children, ...profile.people.map((p) => p.name)].filter(Boolean)
  if (lovedOnes.length) {
    cards.push({
      key: 'amados',
      emoji: '💛',
      title: 'Por quem eu amo',
      subtitle: joinNames(lovedOnes.slice(0, 3)) + (lovedOnes.length > 3 ? '…' : ''),
      build: () => buildIntercession(profile),
    })
  }
  for (const id of profile.themeIds.slice(0, 4)) {
    const theme = THEME_BY_ID[id]
    if (!theme) continue
    cards.push({
      key: id,
      emoji: theme.emoji,
      title: theme.name,
      subtitle: theme.verses[0].ref,
      build: () => buildPrayer('', [theme], profile),
    })
  }
  if (profile.bigAsk) {
    cards.push({
      key: 'pedido',
      emoji: '✨',
      title: 'Meu pedido maior',
      subtitle: profile.bigAsk,
      build: () => buildPrayer(profile.bigAsk, [THEME_BY_ID.espera], profile, 'o meu pedido maior'),
    })
  }
  if (profile.past) {
    cards.push({
      key: 'passado',
      emoji: '🕊️',
      title: 'Entregar o passado',
      subtitle: 'Só entre você e Deus',
      build: () =>
        buildPrayer(profile.past, [findThemes(profile.past)[0] ?? THEME_BY_ID.perdao], profile, 'o que ainda carrego do passado'),
    })
  }
  return cards
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
