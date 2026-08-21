import { useMemo, useState } from 'react'
import { useStore } from '../store'
import TopBar from '../components/TopBar'
import { IconCheck, IconPlus, IconPray, IconTrash } from '../components/icons'
import { relativeDate } from '../lib/format'

export default function Prayers() {
  const { data, addPrayer, togglePrayer, deletePrayer } = useStore()
  const [text, setText] = useState('')

  const open = useMemo(() => data.prayers.filter((p) => p.status === 'aberto'), [data.prayers])
  const answered = useMemo(
    () => data.prayers.filter((p) => p.status === 'respondido'),
    [data.prayers],
  )

  function submit() {
    const t = text.trim()
    if (!t) return
    addPrayer(t)
    setText('')
  }

  return (
    <>
      <TopBar
        title="Orações"
        subtitle={`${open.length} em aberto · ${answered.length} respondida${
          answered.length === 1 ? '' : 's'
        }`}
      />
      <div className="content">
        <div className="searchbar" style={{ marginBottom: 18 }}>
          <IconPlus style={{ color: 'var(--primary)' }} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Adicionar pedido de oração…"
          />
          {text.trim() && (
            <button
              className="chip active"
              style={{ padding: '6px 14px' }}
              onClick={submit}
            >
              Add
            </button>
          )}
        </div>

        {data.prayers.length === 0 && (
          <div className="empty">
            <div className="ico">
              <IconPray />
            </div>
            <h2>Lista de orações</h2>
            <p>Escreva seus pedidos e marque quando forem respondidos.</p>
          </div>
        )}

        {open.map((p) => (
          <div className="prayer-card" key={p.id}>
            <button
              className="check"
              onClick={() => togglePrayer(p.id)}
              aria-label="Marcar como respondida"
            />
            <div className="ptext">
              {p.text}
              <div className="when">{relativeDate(p.createdAt)}</div>
            </div>
            <button
              className="iconbtn ghost"
              onClick={() => deletePrayer(p.id)}
              aria-label="Excluir"
              style={{ color: 'var(--text-faint)', width: 30, height: 30 }}
            >
              <IconTrash style={{ width: 16, height: 16 }} />
            </button>
          </div>
        ))}

        {answered.length > 0 && (
          <>
            <div className="sec-title">Respondidas 🙏</div>
            {answered.map((p) => (
              <div className="prayer-card done" key={p.id}>
                <button
                  className="check done"
                  onClick={() => togglePrayer(p.id)}
                  aria-label="Reabrir"
                >
                  <IconCheck />
                </button>
                <div className="ptext">
                  {p.text}
                  {p.answeredAt && (
                    <div className="when">respondida {relativeDate(p.answeredAt)}</div>
                  )}
                </div>
                <button
                  className="iconbtn ghost"
                  onClick={() => deletePrayer(p.id)}
                  aria-label="Excluir"
                  style={{ color: 'var(--text-faint)', width: 30, height: 30 }}
                >
                  <IconTrash style={{ width: 16, height: 16 }} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}
