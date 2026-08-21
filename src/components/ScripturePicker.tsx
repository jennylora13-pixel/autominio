import { useState } from 'react'
import { BIBLE_BOOKS, formatReference } from '../lib/bible'
import { IconChevronLeft, IconClose } from './icons'

export default function ScripturePicker({
  onClose,
  onPick,
}: {
  onClose: () => void
  onPick: (ref: string) => void
}) {
  const [book, setBook] = useState<string | null>(null)
  const [chapter, setChapter] = useState('')
  const [verse, setVerse] = useState('')

  const at = BIBLE_BOOKS.filter((b) => b.testament === 'AT')
  const nt = BIBLE_BOOKS.filter((b) => b.testament === 'NT')

  function confirm() {
    if (!book) return
    onPick(formatReference(book, chapter, verse))
    onClose()
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grabber" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {book && (
            <button className="iconbtn ghost" onClick={() => setBook(null)}>
              <IconChevronLeft />
            </button>
          )}
          <h2 style={{ flex: 1, margin: 0 }}>{book ? book : 'Escolher livro'}</h2>
          <button className="iconbtn ghost" onClick={onClose}>
            <IconClose />
          </button>
        </div>

        {!book ? (
          <>
            <div className="sec-title" style={{ marginTop: 8 }}>
              Antigo Testamento
            </div>
            <div className="book-grid">
              {at.map((b) => (
                <button key={b.name} className="chip" onClick={() => setBook(b.name)}>
                  {b.name}
                </button>
              ))}
            </div>
            <div className="sec-title">Novo Testamento</div>
            <div className="book-grid">
              {nt.map((b) => (
                <button key={b.name} className="chip" onClick={() => setBook(b.name)}>
                  {b.name}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="grid-2" style={{ marginTop: 10 }}>
              <div className="field">
                <label>Capítulo</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="ex: 3"
                  autoFocus
                />
              </div>
              <div className="field">
                <label>Versículo(s)</label>
                <input
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  placeholder="ex: 16 ou 16-18"
                />
              </div>
            </div>
            <p className="hint" style={{ marginBottom: 14 }}>
              Referência: <b>{formatReference(book, chapter, verse)}</b>
            </p>
            <button className="btn primary" onClick={confirm}>
              Adicionar referência
            </button>
          </>
        )}
      </div>
    </div>
  )
}
