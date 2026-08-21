import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store'
import TopBar from '../components/TopBar'
import {
  IconChevronLeft,
  IconPencil,
  IconShare,
  IconStar,
  IconTrash,
} from '../components/icons'
import { formatDate } from '../lib/format'

export default function NoteDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { data, deleteNote, toggleFavorite } = useStore()
  const note = data.notes.find((n) => n.id === id)
  const [confirming, setConfirming] = useState(false)

  if (!note) {
    return (
      <>
        <TopBar
          title="Nota"
          left={
            <button className="iconbtn ghost" onClick={() => nav('/')}>
              <IconChevronLeft />
            </button>
          }
        />
        <div className="content">
          <div className="empty">
            <h2>Nota não encontrada</h2>
            <p>Ela pode ter sido excluída.</p>
          </div>
        </div>
      </>
    )
  }

  function share() {
    const n = note!
    const text =
      `${n.title}\n${formatDate(n.date)}` +
      (n.preacher ? ` — ${n.preacher}` : '') +
      (n.church ? ` (${n.church})` : '') +
      (n.scriptures.length ? `\n\nVersículos: ${n.scriptures.join(', ')}` : '') +
      (n.body ? `\n\n${n.body}` : '') +
      (n.tags.length ? `\n\n${n.tags.map((t) => '#' + t).join(' ')}` : '')
    if (navigator.share) {
      navigator.share({ title: n.title, text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text)
      alert('Nota copiada para a área de transferência.')
    }
  }

  return (
    <>
      <TopBar
        title=""
        left={
          <button className="iconbtn ghost" onClick={() => nav('/')} aria-label="Voltar">
            <IconChevronLeft />
          </button>
        }
        right={
          <>
            <button
              className={'iconbtn ghost' + (note.favorite ? ' star on' : '')}
              onClick={() => toggleFavorite(note.id)}
              aria-label="Favoritar"
              style={{ color: note.favorite ? 'var(--accent)' : undefined }}
            >
              <IconStar fill={note.favorite ? 'currentColor' : 'none'} />
            </button>
            <button className="iconbtn ghost" onClick={share} aria-label="Compartilhar">
              <IconShare />
            </button>
            <button
              className="iconbtn"
              onClick={() => nav(`/nota/${note.id}/editar`)}
              aria-label="Editar"
            >
              <IconPencil />
            </button>
          </>
        }
      />
      <div className="content detail">
        {note.series && (
          <div className="scrip" style={{ display: 'inline-flex' }}>
            {note.series}
          </div>
        )}
        <h1>{note.title}</h1>
        <div className="metaline">
          <b>{formatDate(note.date)}</b>
        </div>
        {(note.preacher || note.church) && (
          <div className="metaline">
            {note.preacher && <b>{note.preacher}</b>}
            {note.preacher && note.church && ' · '}
            {note.church}
          </div>
        )}

        {note.scriptures.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {note.scriptures.map((s) => (
              <span className="pill-verse" key={s}>
                {s}
              </span>
            ))}
          </div>
        )}

        <hr />

        {note.body ? (
          <div className="body">{note.body}</div>
        ) : (
          <p className="muted">Sem anotações.</p>
        )}

        {note.tags.length > 0 && (
          <div className="tag-row" style={{ marginTop: 24 }}>
            {note.tags.map((t) => (
              <span className="tag" key={t}>
                #{t}
              </span>
            ))}
          </div>
        )}

        <hr />
        {!confirming ? (
          <button className="btn link" onClick={() => setConfirming(true)}>
            <IconTrash style={{ width: 18, height: 18 }} /> Excluir nota
          </button>
        ) : (
          <div className="settings-group" style={{ marginTop: 8 }}>
            <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div className="lbl" style={{ marginBottom: 12 }}>
                Excluir esta nota? Não dá para desfazer.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn subtle"
                  style={{ flex: 1 }}
                  onClick={() => setConfirming(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn danger"
                  style={{ flex: 1 }}
                  onClick={() => {
                    deleteNote(note.id)
                    nav('/')
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
