const MONTHS = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

/** "2026-08-21" -> "21 de ago de 2026" */
export function formatDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${d} de ${MONTHS[m - 1]} de ${y}`
}

export function relativeDate(ts: number): string {
  const diff = Date.now() - ts
  const day = 86400000
  if (diff < 60000) return 'agora'
  if (diff < 3600000) return `há ${Math.floor(diff / 60000)} min`
  if (diff < day) return `há ${Math.floor(diff / 3600000)} h`
  if (diff < day * 7) return `há ${Math.floor(diff / day)} d`
  return new Date(ts).toLocaleDateString('pt-BR')
}

/** Local date as YYYY-MM-DD (toISOString would use UTC and flip days at night). */
export function isoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayISO(): string {
  return isoDate(new Date())
}
