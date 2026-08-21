import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store'
import TopBar from '../components/TopBar'
import ScripturePicker from '../components/ScripturePicker'
import { IconBookmark, IconChevronLeft, IconClose, IconPlus } from '../components/icons'
import { todayISO } from '../lib/format'

export default function NoteEditor() {
  const { id } = useParams()
  const nav = useNavigate()
  const { data, saveNote } = useStore()
  const existing = id ? data.notes.find((n) => n.id === id) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [date, setDate] = useState(existing?.date ?? todayISO())
  const [preacher, setPreacher] = useState(existing?.preacher ?? '')
  const [church, setChurch] = useState(existing?.church ?? '')
  const [series, setSeries] = useState(existing?.series ?? '')
  const [scriptures, setScriptures] = useState<string[]>(existing?.scriptures ?? [])
  const [body, setBody] = useState(existing?.body ?? '')
  const [tags, setTags] = useState<string[]>(existing?.tags ?? [])
  const [tagDraft, setTagDraft] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  function addTag() {
    const t = tagDraft.trim().replace(/^#/, '').toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagDraft('')
  }

  function save() {
    const saved = saveNote({
      id: existing?.id,
      title: title.trim() || 'Sem título',
      date,
      preacher: preacher.trim(),
      church: church.trim(),
      series: series.trim(),
      scriptures,
      body,
      tags,
      favorite: existing?.favorite ?? false,
    })
    nav(`/nota/${saved.id}`, { replace: true })
  }

  return (
    <>
      <TopBar
        title={existing ? 'Editar nota' : 'Nova nota'}
        left={
          <button className="iconbtn ghost" onClick={() => nav(-1)} aria-label="Voltar">
            <IconChevronLeft />
          </button>
        }
      />
      <div className="content">
        <div className="field">
          <input
            className="title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da mensagem"
            autoFocus={!existing}
          />
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Série</label>
            <input
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              placeholder="ex: Vida com propósito"
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Pregador</label>
            <input
              value={preacher}
              onChange={(e) => setPreacher(e.target.value)}
              placeholder="Nome"
            />
          </div>
          <div className="field">
            <label>Igreja</label>
            <input
              value={church}
              onChange={(e) => setChurch(e.target.value)}
              placeholder="Local"
            />
          </div>
        </div>

        <div className="field">
          <label>Versículos</label>
          <div className="token-input">
            {scriptures.map((s) => (
              <span className="token scrip-token" key={s}>
                <IconBookmark style={{ width: 13, height: 13 }} />
                {s}
                <button
                  onClick={() => setScriptures(scriptures.filter((x) => x !== s))}
                  aria-label="Remover"
                >
                  <IconClose />
                </button>
              </span>
            ))}
            <button
              className="chip"
              style={{ padding: '6px 12px' }}
              onClick={() => setShowPicker(true)}
            >
              <IconPlus style={{ width: 14, height: 14, verticalAlign: '-2px' }} /> Referência
            </button>
          </div>
        </div>

        <div className="field">
          <label>Notas</label>
          <textarea
            className="body-input"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Pontos principais, aplicações, reflexões…"
          />
        </div>

        <div className="field">
          <label>Tags</label>
          <div className="token-input">
            {tags.map((t) => (
              <span className="token tag-token" key={t}>
                #{t}
                <button onClick={() => setTags(tags.filter((x) => x !== t))} aria-label="Remover">
                  <IconClose />
                </button>
              </span>
            ))}
            <input
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  addTag()
                }
              }}
              onBlur={addTag}
              placeholder="Adicionar tag"
            />
          </div>
        </div>

        <button className="btn primary" onClick={save}>
          {existing ? 'Salvar alterações' : 'Salvar nota'}
        </button>
      </div>

      {showPicker && (
        <ScripturePicker
          onClose={() => setShowPicker(false)}
          onPick={(ref) => {
            if (!scriptures.includes(ref)) setScriptures((s) => [...s, ref])
          }}
        />
      )}
    </>
  )
}
