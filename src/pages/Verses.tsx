import { useState } from 'react'
import { useStore } from '../store'
import TopBar from '../components/TopBar'
import ScripturePicker from '../components/ScripturePicker'
import { IconBook, IconPlus, IconTrash } from '../components/icons'

export default function Verses() {
  const { data, addVerse, deleteVerse } = useStore()
  const [adding, setAdding] = useState(false)
  const [reference, setReference] = useState('')
  const [text, setText] = useState('')
  const [note, setNote] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  function reset() {
    setReference('')
    setText('')
    setNote('')
    setAdding(false)
  }

  function submit() {
    if (!reference.trim() && !text.trim()) return
    addVerse({ reference: reference.trim(), text: text.trim(), note: note.trim() })
    reset()
  }

  return (
    <>
      <TopBar
        title="Versículos"
        subtitle={`${data.verses.length} guardado${data.verses.length === 1 ? '' : 's'}`}
        right={
          <button className="iconbtn" onClick={() => setAdding(true)} aria-label="Adicionar">
            <IconPlus />
          </button>
        }
      />
      <div className="content">
        {data.verses.length === 0 ? (
          <div className="empty">
            <div className="ico">
              <IconBook />
            </div>
            <h2>Guarde versículos</h2>
            <p>Salve as passagens que tocaram você para revisitá-las quando quiser.</p>
          </div>
        ) : (
          data.verses.map((v) => (
            <div className="verse-card" key={v.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  {v.reference && <div className="ref">{v.reference}</div>}
                  {v.text && <div className="vtext">“{v.text}”</div>}
                  {v.note && <div className="vnote">{v.note}</div>}
                </div>
                <button
                  className="iconbtn ghost"
                  onClick={() => deleteVerse(v.id)}
                  aria-label="Excluir"
                  style={{ color: 'var(--text-faint)', width: 34, height: 34 }}
                >
                  <IconTrash style={{ width: 18, height: 18 }} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {adding && (
        <div className="sheet-backdrop" onClick={reset}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="grabber" />
            <h2>Novo versículo</h2>
            <div className="field">
              <label>Referência</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="ex: Salmos 23:1"
                  style={{
                    flex: 1,
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-elev)',
                    color: 'var(--text)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    outline: 'none',
                  }}
                />
                <button className="btn subtle" onClick={() => setShowPicker(true)}>
                  Escolher
                </button>
              </div>
            </div>
            <div className="field">
              <label>Texto</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Cole ou escreva a passagem…"
                style={{ minHeight: 90 }}
              />
            </div>
            <div className="field">
              <label>Anotação (opcional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Por que este versículo importa para você"
              />
            </div>
            <button className="btn primary" onClick={submit}>
              Guardar versículo
            </button>
          </div>
        </div>
      )}

      {showPicker && (
        <ScripturePicker onClose={() => setShowPicker(false)} onPick={(ref) => setReference(ref)} />
      )}
    </>
  )
}
