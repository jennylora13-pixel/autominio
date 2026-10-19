import { useMemo, useState } from 'react'
import { streak, useStore } from '../store'
import TopBar from '../components/TopBar'
import { IconCheck, IconShare } from '../components/icons'
import { THEMES } from '../data/themes'
import { capitalize, declarationOfDay } from '../lib/prayer'
import { todayISO } from '../lib/format'
import { genderize } from '../lib/gender'
import ShareImageSheet from '../components/ShareImageSheet'
import type { DeclarationCard } from '../lib/declarationImage'
import type { ThemeVerse } from '../types'

export default function Declare() {
  const { data, toggleDeclaredToday } = useStore()
  const g = (s: string) => genderize(s, data.profile?.gender ?? 'n')
  const [themeId, setThemeId] = useState(THEMES[0].id)
  const [sharing, setSharing] = useState<DeclarationCard | null>(null)

  const today = declarationOfDay(todayISO())
  const declared = data.declaredDays.includes(todayISO())
  const days = useMemo(() => streak(data.declaredDays), [data.declaredDays])
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0]

  function shareAsImage(v: ThemeVerse, kicker: string) {
    setSharing({ kicker, declaration: g(capitalize(v.declaration)), verse: v.text, reference: v.ref })
  }

  return (
    <>
      <TopBar
        title="Declarar"
        subtitle="Fale a Palavra sobre a sua vida"
        right={
          <button
            className="iconbtn"
            onClick={() => shareAsImage(today, 'Declaração de hoje')}
            aria-label="Compartilhar declaração de hoje como imagem"
          >
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
            <div className="decl-row">
              <div className="vtext">{g(capitalize(v.declaration))}</div>
              <button
                className="iconbtn ghost"
                onClick={() => shareAsImage(v, `Declaração · ${theme.name}`)}
                aria-label="Compartilhar como imagem"
              >
                <IconShare width={18} />
              </button>
            </div>
            <div className="vnote">
              {v.ref} · “{v.text}”
            </div>
          </div>
        ))}
      </div>
      {sharing && <ShareImageSheet card={sharing} onClose={() => setSharing(null)} />}
    </>
  )
}
