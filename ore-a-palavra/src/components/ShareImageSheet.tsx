import { useEffect, useRef, useState } from 'react'
import {
  renderDeclaration,
  type DeclarationCard,
  type ImageFormat,
  type ImageStyle,
} from '../lib/declarationImage'

const STYLES: { key: ImageStyle; label: string }[] = [
  { key: 'ceu', label: 'Céu' },
  { key: 'noite', label: 'Noite' },
  { key: 'aurora', label: 'Aurora' },
]

const FILE_NAME = 'declaracao-ore-a-palavra.png'

/** Bottom sheet with a preview of the declaration image and share / download buttons. */
export default function ShareImageSheet({ card, onClose }: { card: DeclarationCard; onClose: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'))
  const [format, setFormat] = useState<ImageFormat>('story')
  const [style, setStyle] = useState<ImageStyle>('ceu')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState('')
  const [msg, setMsg] = useState('')

  // render ahead of the tap, so sharing still counts as a direct user action on iOS
  useEffect(() => {
    let cancelled = false
    void renderDeclaration(canvas.current, card, format, style).then((b) => {
      if (cancelled || !b) return
      setBlob(b)
      setUrl(URL.createObjectURL(b))
    })
    return () => {
      cancelled = true
    }
  }, [card, format, style])

  useEffect(() => () => URL.revokeObjectURL(url), [url])

  function download() {
    const a = document.createElement('a')
    a.href = url
    a.download = FILE_NAME
    a.click()
    setMsg('Imagem salva. No Instagram, escolha-a na galeria.')
  }

  async function shareImage() {
    if (!blob) return
    const file = new File([blob], FILE_NAME, { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: card.kicker })
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) download()
      }
    } else {
      download()
    }
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grabber" />
        <h2>Compartilhar como imagem</h2>
        <div className="share-controls">
          <div className="seg">
            <button className={format === 'story' ? 'active' : ''} onClick={() => setFormat('story')}>
              Stories
            </button>
            <button className={format === 'feed' ? 'active' : ''} onClick={() => setFormat('feed')}>
              Feed
            </button>
          </div>
          <div className="chips" style={{ marginBottom: 0 }}>
            {STYLES.map((s) => (
              <button
                key={s.key}
                className={'chip' + (style === s.key ? ' active' : '')}
                onClick={() => setStyle(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className={'share-preview ' + format}>
          {url ? <img src={url} alt={`${card.declaration} — ${card.reference}`} /> : <span>Preparando…</span>}
        </div>
        {msg && <div className="notice info">{msg}</div>}
        <div className="btn-row" style={{ marginBottom: 0 }}>
          <button className="btn primary" onClick={shareImage} disabled={!blob}>
            Compartilhar imagem
          </button>
          <button className="btn subtle" onClick={download} disabled={!url}>
            Baixar
          </button>
        </div>
      </div>
    </div>
  )
}
