/** Opens the native share sheet, falling back to the clipboard. Returns a status message. */
export async function share(title: string, text: string): Promise<string> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text })
      return ''
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return ''
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'Texto copiado. É só colar onde quiser.'
  } catch {
    return 'Não foi possível compartilhar neste navegador.'
  }
}
