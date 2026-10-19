import { useMemo, useState } from 'react'
import { useStore } from '../store'
import TopBar from '../components/TopBar'
import { IconCheck, IconNotes, IconShare, IconTrash } from '../components/icons'
import { relativeDate } from '../lib/format'
import { prayerToText } from '../lib/prayer'
import { share } from '../lib/share'
import type { SavedPrayer } from '../types'
import AudioPlayer from '../components/AudioPlayer'
import { usePrayerAudio } from '../lib/speech'

export default function Journal() {
  const { data } = useStore()
  const open = useMemo(() => data.prayers.filter((p) => !p.answeredAt), [data.prayers])
  const answered = useMemo(() => data.prayers.filter((p) => p.answeredAt), [data.prayers])

  return (
    <>
      <TopBar
        title="Diário de oração"
        subtitle={`${open.length} em oração · ${answered.length} respondida${
          answered.length === 1 ? '' : 's'
        }`}
      />
      <div className="content">
        {data.prayers.length === 0 && (
          <div className="empty">
            <div className="ico">
              <IconNotes />
            </div>
            <h2>Seu diário está vazio</h2>
            <p>Salve as orações que você fizer na aba Orar e marque quando forem respondidas.</p>
          </div>
        )}

        {open.map((p) => (
          <JournalCard key={p.id} prayer={p} />
        ))}

        {answered.length > 0 && (
          <>
            <div className="sec-title">Respondidas 🙏</div>
            {answered.map((p) => (
              <JournalCard key={p.id} prayer={p} />
            ))}
          </>
        )}
      </div>
    </>
  )
}

const NO_PARAGRAPHS: string[] = []

function JournalCard({ prayer }: { prayer: SavedPrayer }) {
  const { data, toggleAnswered, deletePrayer } = useStore()
  const [expanded, setExpanded] = useState(false)
  const [shareMsg, setShareMsg] = useState('')
  const done = !!prayer.answeredAt
  const audio = usePrayerAudio(expanded ? prayer.paragraphs : NO_PARAGRAPHS, data.settings.audioMusic)

  return (
    <div className="journal-card">
      <div className="head">
        <button
          className={'check' + (done ? ' done' : '')}
          onClick={() => toggleAnswered(prayer.id)}
          aria-label={done ? 'Reabrir' : 'Marcar como respondida'}
        >
          {done && <IconCheck />}
        </button>
        <button className="title" onClick={() => setExpanded((x) => !x)}>
          {prayer.title}
          <div className="when">
            {done && prayer.answeredAt
              ? `respondida ${relativeDate(prayer.answeredAt)}`
              : relativeDate(prayer.createdAt)}
            {' · '}
            {prayer.verses.map((v) => v.ref).join(', ')}
          </div>
        </button>
      </div>
      {expanded && (
        <div className="body">
          <AudioPlayer
            paragraphs={prayer.paragraphs}
            state={audio.state}
            onPlay={audio.play}
            onPause={audio.pause}
            onStop={audio.stop}
          />
          {prayer.paragraphs.map((p, i) => (
            <p key={i} className={i === audio.current ? 'reading' : ''}>
              {p}
            </p>
          ))}
          {shareMsg && <div className="notice info">{shareMsg}</div>}
          <div className="btn-row" style={{ marginBottom: 0 }}>
            <button
              className="btn subtle"
              onClick={async () => setShareMsg(await share('Oração', prayerToText(prayer)))}
            >
              <IconShare width={18} /> Compartilhar
            </button>
            <button
              className="btn danger"
              onClick={() => confirm('Excluir esta oração do diário?') && deletePrayer(prayer.id)}
            >
              <IconTrash width={18} /> Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
