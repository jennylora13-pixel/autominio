import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import NoteCard from '../components/NoteCard'
import TopBar from '../components/TopBar'
import { IconNotes, IconPlus, IconSearch } from '../components/icons'

export default function Home() {
  const { data, toggleFavorite } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<string>('all')

  const allTags = useMemo(() => {
    const set = new Set<string>()
    data.notes.forEach((n) => n.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [data.notes])

  const notes = useMemo(() => {
    const term = q.trim().toLowerCase()
    return data.notes
      .filter((n) => {
        if (filter === 'fav' && !n.favorite) return false
        if (filter.startsWith('tag:') && !n.tags.includes(filter.slice(4))) return false
        if (!term) return true
        return (
          n.title.toLowerCase().includes(term) ||
          n.body.toLowerCase().includes(term) ||
          n.preacher.toLowerCase().includes(term) ||
          n.church.toLowerCase().includes(term) ||
          n.series.toLowerCase().includes(term) ||
          n.scriptures.some((s) => s.toLowerCase().includes(term)) ||
          n.tags.some((t) => t.toLowerCase().includes(term))
        )
      })
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.updatedAt - a.updatedAt))
  }, [data.notes, q, filter])

  return (
    <>
      <TopBar
        title="Notas de Sermão"
        subtitle={`${data.notes.length} ${data.notes.length === 1 ? 'nota' : 'notas'}`}
      />
      <div className="content">
        <div className="searchbar">
          <IconSearch />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, versículo, pregador…"
          />
        </div>

        <div className="chips">
          <button
            className={'chip' + (filter === 'all' ? ' active' : '')}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button
            className={'chip' + (filter === 'fav' ? ' active' : '')}
            onClick={() => setFilter('fav')}
          >
            ★ Favoritas
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              className={'chip' + (filter === 'tag:' + t ? ' active' : '')}
              onClick={() => setFilter('tag:' + t)}
            >
              #{t}
            </button>
          ))}
        </div>

        {notes.length === 0 ? (
          <div className="empty">
            <div className="ico">
              <IconNotes />
            </div>
            {data.notes.length === 0 ? (
              <>
                <h2>Comece sua primeira nota</h2>
                <p>Anote a mensagem, o pregador e os versículos. Toque em + para começar.</p>
              </>
            ) : (
              <>
                <h2>Nada encontrado</h2>
                <p>Ajuste a busca ou os filtros.</p>
              </>
            )}
          </div>
        ) : (
          notes.map((n) => <NoteCard key={n.id} note={n} onToggleFav={toggleFavorite} />)
        )}
      </div>

      <button className="fab" aria-label="Nova nota" onClick={() => nav('/nota/nova')}>
        <IconPlus />
      </button>
    </>
  )
}
