import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import TopBar from '../components/TopBar'
import {
  IconBookmark,
  IconCheck,
  IconChevronLeft,
  IconShare,
  IconSparkle,
} from '../components/icons'
import { THEMES } from '../data/themes'
import { findThemes, looksLikeCrisis } from '../lib/search'
import { buildPrayer, forYou, prayerToText } from '../lib/prayer'
import { personalizeWithAi } from '../lib/ai'
import { share } from '../lib/share'
import type { GuidedPrayer, Theme } from '../types'
import CareNotice from '../components/CareNotice'
import AudioPlayer from '../components/AudioPlayer'
import { usePrayerAudio } from '../lib/speech'
import { genderize } from '../lib/gender'

export default function Pray() {
  const { data, savePrayer, tryPremium, openPaywall } = useStore()
  const { aiEnabled, aiEndpoint } = data.settings
  const profile = data.profile
  const cards = useMemo(() => (profile ? forYou(profile) : []), [profile])
  const [text, setText] = useState('')
  const [result, setResult] = useState<GuidedPrayer | null>(null)
  const [noMatch, setNoMatch] = useState(false)
  const [crisis, setCrisis] = useState(false)
  const [saved, setSaved] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [shareMsg, setShareMsg] = useState('')
  // the free "Para você" prayer, thanked and explained on the result screen
  const [gift, setGift] = useState(false)
  const paragraphs = useMemo(() => result?.paragraphs ?? [], [result])
  const audio = usePrayerAudio(paragraphs, data.settings.audioMusic)
  const prayerRef = useRef<HTMLDivElement>(null)

  // keep the paragraph being read in view
  useEffect(() => {
    if (audio.current < 0) return
    prayerRef.current?.children[audio.current]?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
  }, [audio.current])

  function show(prayer: GuidedPrayer | null) {
    setGift(false)
    setResult(prayer)
    setSaved(false)
    setAiError('')
    setShareMsg('')
    setCrisis(looksLikeCrisis(text))
  }

  function search() {
    const themes = findThemes(text)
    setNoMatch(themes.length === 0)
    show(themes.length ? buildPrayer(text, themes, profile) : null)
  }

  function pickTheme(theme: Theme) {
    setNoMatch(false)
    show(buildPrayer(text, [theme], profile))
  }

  async function withAi() {
    if (!tryPremium('ia')) return
    const themeNames = (result?.themeIds ?? [])
      .map((id) => THEMES.find((t) => t.id === id)?.name)
      .filter((n): n is string => !!n)
    setAiLoading(true)
    setAiError('')
    try {
      const prayer = await personalizeWithAi(aiEndpoint, text.trim(), themeNames, profile)
      setNoMatch(false)
      show({ ...prayer, themeIds: result?.themeIds ?? [] })
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Não foi possível falar com a IA.')
    } finally {
      setAiLoading(false)
    }
  }

  function reset() {
    setText('')
    setResult(null)
    setNoMatch(false)
    setCrisis(false)
  }

  async function onShare() {
    if (!result) return
    setShareMsg(await share('Oração', prayerToText(result)))
  }

  if (result) {
    return (
      <>
        <TopBar
          title="Ore assim"
          left={
            <button className="iconbtn ghost" onClick={reset} aria-label="Nova oração">
              <IconChevronLeft />
            </button>
          }
        />
        <div className="content">
          {crisis && <CareNotice gender={profile?.gender} />}

          <AudioPlayer
            paragraphs={paragraphs}
            state={audio.state}
            onPlay={audio.play}
            onPause={audio.pause}
            onStop={audio.stop}
          />

          <div className="sec-title" style={{ marginTop: 4 }}>
            Versículos para você
          </div>
          {result.verses.map((v) => (
            <div className="verse-card" key={v.ref}>
              <div className="ref">{v.ref}</div>
              <div className="vtext">{v.text}</div>
              <div className="declaration">Eu declaro: {v.declaration}</div>
            </div>
          ))}

          <div className="sec-title">Sua oração</div>
          {result.source === 'ia' && (
            <span className="source-tag">
              <IconSparkle /> Personalizada com IA
            </span>
          )}
          <div className="prayer-text" ref={prayerRef}>
            {result.paragraphs.map((p, i) => (
              <p key={i} className={i === audio.current ? 'reading' : ''}>
                {p}
              </p>
            ))}
          </div>
          {result.source === 'ia' && (
            <p className="hint" style={{ marginTop: -6, marginBottom: 14 }}>
              Texto gerado por IA. Confira os versículos na sua Bíblia.
            </p>
          )}

          {gift && (
            <div className="gift">
              <b>Esta oração foi um presente para você 💛</b>
              <span>Com o Premium você recebe orações assim, com o nome de quem você ama, todos os dias.</span>
              <button className="btn subtle" onClick={() => openPaywall('paraVoce')}>
                Conhecer o Premium
              </button>
            </div>
          )}
          {aiError && <div className="notice error">{aiError}</div>}
          {shareMsg && <div className="notice info">{shareMsg}</div>}

          <div className="btn-row">
            <button
              className="btn primary"
              disabled={saved}
              onClick={() => {
                savePrayer(result)
                setSaved(true)
              }}
            >
              {saved ? <IconCheck width={18} /> : <IconBookmark width={18} />}
              {saved ? 'Salva no diário' : 'Salvar no diário'}
            </button>
            <button className="btn subtle" onClick={onShare}>
              <IconShare width={18} /> Compartilhar
            </button>
          </div>
          {aiEnabled && result.source === 'biblioteca' && text.trim() && (
            <button className="btn accent" style={{ width: '100%' }} onClick={withAi} disabled={aiLoading}>
              <IconSparkle width={18} />
              {aiLoading ? 'Escrevendo sua oração…' : 'Personalizar com IA'}
            </button>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar title="Ore a Palavra" subtitle="Ore com a Bíblia sobre o que você está vivendo" />
      <div className="content">
        <div className="ask">
          <label htmlFor="situacao">
            {profile ? `${profile.name.split(' ')[0]}, pelo que você quer orar hoje?` : 'Pelo que você quer orar?'}
          </label>
          <textarea
            id="situacao"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setNoMatch(false)
            }}
            placeholder={genderize('Ex.: estou ansioso(a) com uma entrevista de emprego amanhã', profile?.gender ?? 'n')}
          />
          <button className="btn primary" onClick={search} disabled={!text.trim()}>
            Encontrar versículos e orar
          </button>
        </div>

        {crisis && noMatch && <CareNotice gender={profile?.gender} />}

        {noMatch && (
          <div className="notice info">
            Não encontrei um tema exato para o que você escreveu. Escolha um tema abaixo
            {aiEnabled ? ' ou peça uma oração personalizada à IA.' : '.'}
          </div>
        )}
        {noMatch && aiEnabled && (
          <>
            {aiError && <div className="notice error">{aiError}</div>}
            <button className="btn accent" style={{ width: '100%', marginBottom: 8 }} onClick={withAi} disabled={aiLoading}>
              <IconSparkle width={18} />
              {aiLoading ? 'Escrevendo sua oração…' : 'Orar com IA'}
            </button>
          </>
        )}

        {cards.length > 0 && (
          <>
            <div className="sec-title">Para você</div>
            <div className="foryou">
              {cards.map((c) => (
                <button
                  key={c.key}
                  className="fy-card"
                  onClick={() => {
                    if (!tryPremium('paraVoce')) return
                    setNoMatch(false)
                    show(c.build())
                    setGift(!data.premium.active)
                  }}
                >
                  <span className="emo">{c.emoji}</span>
                  <span className="fy-title">{c.title}</span>
                  <span className="fy-sub">{c.subtitle}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="sec-title">Ou escolha um tema</div>
        <div className="theme-grid">
          {THEMES.map((t) => (
            <button key={t.id} className="theme-btn" onClick={() => pickTheme(t)}>
              <span className="emo">{t.emoji}</span>
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
