import { useState } from 'react'
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
import { buildPrayer, prayerToText } from '../lib/prayer'
import { personalizeWithAi } from '../lib/ai'
import { share } from '../lib/share'
import type { GuidedPrayer, Theme } from '../types'

export default function Pray() {
  const { data, savePrayer } = useStore()
  const { aiEnabled, aiEndpoint } = data.settings
  const [text, setText] = useState('')
  const [result, setResult] = useState<GuidedPrayer | null>(null)
  const [noMatch, setNoMatch] = useState(false)
  const [crisis, setCrisis] = useState(false)
  const [saved, setSaved] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [shareMsg, setShareMsg] = useState('')

  function show(prayer: GuidedPrayer | null) {
    setResult(prayer)
    setSaved(false)
    setAiError('')
    setShareMsg('')
    setCrisis(looksLikeCrisis(text))
  }

  function search() {
    const themes = findThemes(text)
    setNoMatch(themes.length === 0)
    show(themes.length ? buildPrayer(text, themes) : null)
  }

  function pickTheme(theme: Theme) {
    setNoMatch(false)
    show(buildPrayer(text, [theme]))
  }

  async function withAi() {
    const themeNames = (result?.themeIds ?? [])
      .map((id) => THEMES.find((t) => t.id === id)?.name)
      .filter((n): n is string => !!n)
    setAiLoading(true)
    setAiError('')
    try {
      const prayer = await personalizeWithAi(aiEndpoint, text.trim(), themeNames)
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
          {crisis && <CareNotice />}

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
          <div className="prayer-text">
            {result.source === 'ia' && (
              <span className="source-tag">
                <IconSparkle /> Personalizada com IA
              </span>
            )}
            {result.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {result.source === 'ia' && (
            <p className="hint" style={{ marginTop: -6, marginBottom: 14 }}>
              Texto gerado por IA. Confira os versículos na sua Bíblia.
            </p>
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
          <label htmlFor="situacao">Pelo que você quer orar?</label>
          <textarea
            id="situacao"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setNoMatch(false)
            }}
            placeholder="Ex.: estou ansiosa com uma entrevista de emprego amanhã"
          />
          <button className="btn primary" onClick={search} disabled={!text.trim()}>
            Encontrar versículos e orar
          </button>
        </div>

        {crisis && noMatch && <CareNotice />}

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

function CareNotice() {
  return (
    <div className="notice care">
      <b>Você não está sozinho(a).</b> Se você está pensando em tirar a própria vida ou se
      machucar, fale com alguém agora: <b>CVV 188</b> (Brasil, 24h, gratuito) ou{' '}
      <b>SNS 24 808 24 24</b> (Portugal). Em perigo imediato, ligue <b>192</b> / <b>112</b>.
      Deus se importa com você, e há pessoas prontas para ajudar.
    </div>
  )
}
