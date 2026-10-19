// Draws a declaration as a shareable image (Instagram Stories or Feed) on a canvas.

export type ImageFormat = 'story' | 'feed'
export type ImageStyle = 'ceu' | 'noite' | 'aurora'

export interface DeclarationCard {
  kicker: string
  declaration: string
  verse: string
  reference: string
}

const SIZES: Record<ImageFormat, [number, number]> = {
  story: [1080, 1920],
  feed: [1080, 1350],
}

const STYLES: Record<ImageStyle, { bg: [string, string]; text: string; dim: string; accent: string; glow: string }> = {
  ceu: { bg: ['#f6fafd', '#b9daf2'], text: '#1c2a38', dim: '#4c6175', accent: '#2f6fa3', glow: 'rgba(255,255,255,0.9)' },
  noite: { bg: ['#1d3a57', '#0b1621'], text: '#f2f7fb', dim: '#b6cbe0', accent: '#8cc4ee', glow: 'rgba(140,196,238,0.35)' },
  aurora: { bg: ['#fdf7ef', '#f1d6c4'], text: '#3a2a22', dim: '#76594a', accent: '#a86b12', glow: 'rgba(255,255,255,0.85)' },
}

const SERIF = 'Fraunces, Georgia, serif'
const SANS = 'Inter, system-ui, sans-serif'
const MARGIN = 96

/** Waits for the web fonts so the canvas doesn't fall back to system fonts. */
async function ensureFonts() {
  if (!document.fonts) return
  await Promise.all([
    document.fonts.load(`600 80px ${SERIF}`),
    document.fonts.load(`italic 400 40px ${SERIF}`),
    document.fonts.load(`600 30px ${SANS}`),
  ]).catch(() => undefined)
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Largest font size (down to `min`) whose wrapped text fits in `maxHeight`. */
function fit(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: (size: number) => string,
  start: number,
  min: number,
  maxWidth: number,
  maxHeight: number,
  leading: number,
) {
  let size = start
  for (; size > min; size -= 2) {
    ctx.font = font(size)
    if (wrap(ctx, text, maxWidth).length * size * leading <= maxHeight) break
  }
  ctx.font = font(size)
  return { size, lines: wrap(ctx, text, maxWidth) }
}

export async function renderDeclaration(
  canvas: HTMLCanvasElement,
  card: DeclarationCard,
  format: ImageFormat,
  style: ImageStyle,
): Promise<Blob | null> {
  await ensureFonts()
  const [W, H] = SIZES[format]
  const s = STYLES[style]
  const story = format === 'story'
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const width = W - MARGIN * 2

  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, s.bg[0])
  bg.addColorStop(1, s.bg[1])
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  const glow = ctx.createRadialGradient(W * 0.85, H * 0.12, 0, W * 0.85, H * 0.12, W * 0.7)
  glow.addColorStop(0, s.glow)
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // Instagram covers ~250px at the top and bottom of a story with its own UI
  const areaTop = story ? 250 : 110
  const areaBottom = H - (story ? 340 : 170)
  const gapAfterDecl = story ? 70 : 44
  const gapAfterRule = story ? 60 : 40

  const decl = fit(ctx, card.declaration, (n) => `600 ${n}px ${SERIF}`, story ? 88 : 76, 44, width, story ? 720 : 470, 1.22)
  const verse = fit(ctx, `“${card.verse}”`, (n) => `italic 400 ${n}px ${SERIF}`, story ? 42 : 36, 24, width, story ? 420 : 250, 1.45)
  const blockHeight =
    90 +
    decl.lines.length * decl.size * 1.22 +
    gapAfterDecl + 5 + gapAfterRule +
    verse.lines.length * verse.size * 1.45 +
    22 + 32
  let y = areaTop + Math.max(0, (areaBottom - areaTop - blockHeight) / 2)

  ctx.textBaseline = 'top'
  ctx.fillStyle = s.accent
  ctx.font = `600 30px ${SANS}`
  if ('letterSpacing' in ctx) ctx.letterSpacing = '6px'
  ctx.fillText(card.kicker.toUpperCase(), MARGIN, y)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  y += 90

  ctx.font = `600 ${decl.size}px ${SERIF}`
  ctx.fillStyle = s.text
  for (const line of decl.lines) {
    ctx.fillText(line, MARGIN, y)
    y += decl.size * 1.22
  }

  y += gapAfterDecl
  ctx.fillStyle = s.accent
  ctx.fillRect(MARGIN, y, 90, 5)
  y += 5 + gapAfterRule

  ctx.font = `italic 400 ${verse.size}px ${SERIF}`
  ctx.fillStyle = s.dim
  for (const line of verse.lines) {
    ctx.fillText(line, MARGIN, y)
    y += verse.size * 1.45
  }
  y += 22
  ctx.fillStyle = s.text
  ctx.font = `600 32px ${SANS}`
  ctx.fillText(card.reference, MARGIN, y)

  ctx.textBaseline = 'alphabetic'
  const footer = H - (story ? 280 : 110)
  ctx.fillStyle = s.text
  ctx.font = `600 40px ${SERIF}`
  ctx.fillText('Ore a Palavra', MARGIN, footer)
  ctx.fillStyle = s.dim
  ctx.font = `400 28px ${SANS}`
  ctx.fillText('ore com a Bíblia sobre a sua vida', MARGIN, footer + 46)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}
