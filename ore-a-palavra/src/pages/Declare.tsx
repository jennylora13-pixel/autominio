import { useMemo, useState } from 'react'
import { streak, useStore } from '../store'
import TopBar from '../components/TopBar'
import { IconCheck, IconShare } from '../components/icons'
import { THEMES } from '../data/themes'
import { capitalize, declarationOfDay } from '../lib/prayer'
import { todayISO } from '../lib/format'
import { share } from '../lib/share'
import { genderize } from '../lib/gender'

export default function Declare() {
  const { data, toggleDeclaredToday } = useStore()
  const g = (s: string) => genderize(s, data.profile?.gender ?? 'n')
  const [themeId, setThemeId] = useState(THEMES[0].id)
  const [shareMsg, setShareMsg] = useState('')

  const today = declarationOfDay(todayISO())
  const declared = data.declaredDays.includes(todayISO())
  const days = useMemo(() => streak(data.declaredDays), [data.declaredDays])
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0]

  async function onShare() {
    setShareMsg(
      await share(
        'Declaração de hoje',
        `${g(capitalize(today.declaration))}\n\n"${today.text}" (${today.ref})\n\n— Ore a Palavra`,
      ),
    )
  }

  return (
    <>
      <TopBar
        title="Declarar"
        subtitle="Fale a Palavra sobre a sua vida"
        right={
          <button className="iconbtn" onClick={onShare} aria-label="Compartilhar declaração">
            <IconShare width={20} />
          </button>
        }
      />
      <div className="content">
        <div className="today-card">
          <div className="kicker">Declaração de hoje</div>
          <div className="big">{g(capitalize(today.declaration))}</div>
          <div className="verse">
            “{today.text}”<b>{today.ref}</b>
          </div>
          <button className={'btn' + (declared ? ' done' : '')} onClick={toggleDeclaredToday}>
            {declared ? (
              <>
                <IconCheck width={18} /> Declarei hoje
              </>
            ) : (
              'Eu declaro isso hoje'
            )}
          </button>
          {days > 0 && (
            <div className="streak">
              🔥 {days} {days === 1 ? 'dia seguido' : 'dias seguidos'} declarando a Palavra
            </div>
          )}
        </div>
        {shareMsg && <div className="notice info">{shareMsg}</div>}

        <div className="sec-title">Declarações por tema</div>
        <div className="chips">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={'chip' + (t.id === themeId ? ' active' : '')}
              onClick={() => setThemeId(t.id)}
            >
              {t.emoji} {t.name}
            </button>
          ))}
        </div>
        {theme.verses.map((v) => (
          <div className="verse-card" key={v.ref}>
            <div className="vtext">{g(capitalize(v.declaration))}</div>
            <div className="vnote">
              {v.ref} · “{v.text}”
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
