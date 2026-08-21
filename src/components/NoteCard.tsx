import { useNavigate } from 'react-router-dom'
import type { Note } from '../types'
import { formatDate } from '../lib/format'
import { IconBookmark, IconStar } from './icons'

export default function NoteCard({
  note,
  onToggleFav,
}: {
  note: Note
  onToggleFav: (id: string) => void
}) {
  const nav = useNavigate()
  return (
    <article className="note-card" onClick={() => nav(`/nota/${note.id}`)}>
      <div className="row">
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3>{note.title || 'Sem título'}</h3>
          <div className="meta">
            <span>{formatDate(note.date)}</span>
            {note.preacher && (
              <span>
                • <b>{note.preacher}</b>
              </span>
            )}
            {note.church && <span>• {note.church}</span>}
          </div>
        </div>
        <button
          className={'star' + (note.favorite ? ' on' : '')}
          aria-label="Favoritar"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFav(note.id)
          }}
        >
          <IconStar fill={note.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {note.body && <p className="excerpt">{note.body}</p>}

      {(note.scriptures.length > 0 || note.tags.length > 0) && (
        <div className="tag-row">
          {note.scriptures.map((s) => (
            <span className="scrip" key={s}>
              <IconBookmark style={{ width: 12, height: 12 }} />
              {s}
            </span>
          ))}
          {note.tags.map((t) => (
            <span className="tag" key={t}>
              #{t}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
