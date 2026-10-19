import type { GuidedPrayer, Profile } from '../types'

interface AiResponse {
  verses: { reference: string; text: string; declaration: string }[]
  prayer: string[]
}

/** Asks the prayer server (server/server.mjs) for a personalized prayer. */
export async function personalizeWithAi(
  endpoint: string,
  situation: string,
  themeNames: string[],
  profile: Profile | null,
): Promise<GuidedPrayer> {
  // only what helps the prayer read right: how to address the person and family names
  const perfil = profile && {
    tratamento: { f: 'feminino', m: 'masculino', n: 'neutro' }[profile.gender],
    conjuge: profile.partner,
    filhos: profile.children,
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ situacao: situation, temas: themeNames, perfil }),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { erro?: string } | null
    throw new Error(body?.erro ?? `O servidor respondeu ${res.status}.`)
  }
  const data = (await res.json()) as AiResponse
  return {
    situation,
    themeIds: [],
    verses: data.verses.map((v) => ({ ref: v.reference, text: v.text, declaration: v.declaration })),
    paragraphs: data.prayer,
    source: 'ia',
  }
}
