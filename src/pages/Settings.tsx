import { useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useStore } from '../store'
import TopBar from '../components/TopBar'
import { IconDownload, IconShare } from '../components/icons'
import type { AppData, ThemeMode } from '../types'

interface Ctx {
  mode: ThemeMode
  setMode: (m: ThemeMode) => void
}

export default function Settings() {
  const { data, replaceAll, clearAll } = useStore()
  const { mode, setMode } = useOutletContext<Ctx>()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notas-de-sermao-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppData
        if (!parsed || typeof parsed !== 'object') throw new Error('inválido')
        replaceAll(parsed)
        flash('Backup importado com sucesso.')
      } catch {
        flash('Arquivo inválido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function flash(text: string) {
    setMsg(text)
    setTimeout(() => setMsg(''), 2500)
  }

  const themes: { key: ThemeMode; label: string }[] = [
    { key: 'light', label: 'Claro' },
    { key: 'dark', label: 'Escuro' },
    { key: 'system', label: 'Auto' },
  ]

  return (
    <>
      <TopBar title="Ajustes" />
      <div className="content">
        <div className="stat-row">
          <div className="stat">
            <div className="n">{data.notes.length}</div>
            <div className="l">Notas</div>
          </div>
          <div className="stat">
            <div className="n">{data.verses.length}</div>
            <div className="l">Versículos</div>
          </div>
          <div className="stat">
            <div className="n">{data.prayers.length}</div>
            <div className="l">Orações</div>
          </div>
        </div>

        <div className="sec-title">Aparência</div>
        <div className="settings-group">
          <div className="settings-row">
            <div>
              <div className="lbl">Tema</div>
              <div className="desc">Escolha claro, escuro ou automático</div>
            </div>
            <div className="seg">
              {themes.map((t) => (
                <button
                  key={t.key}
                  className={mode === t.key ? 'active' : ''}
                  onClick={() => setMode(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sec-title">Seus dados</div>
        <div className="settings-group">
          <div className="settings-row" onClick={exportData} style={{ cursor: 'pointer' }}>
            <div>
              <div className="lbl">Exportar backup</div>
              <div className="desc">Baixe todas as notas em um arquivo JSON</div>
            </div>
            <IconDownload style={{ width: 22, height: 22, color: 'var(--text-dim)' }} />
          </div>
          <div
            className="settings-row"
            onClick={() => fileRef.current?.click()}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <div className="lbl">Importar backup</div>
              <div className="desc">Substitui os dados atuais pelo arquivo</div>
            </div>
            <IconShare style={{ width: 22, height: 22, color: 'var(--text-dim)' }} />
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          onChange={onImport}
          style={{ display: 'none' }}
        />

        {!confirmClear ? (
          <button className="btn danger" style={{ width: '100%' }} onClick={() => setConfirmClear(true)}>
            Apagar todos os dados
          </button>
        ) : (
          <div className="settings-group">
            <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div className="lbl" style={{ marginBottom: 12 }}>
                Apagar tudo? Faça um backup antes. Não dá para desfazer.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn subtle" style={{ flex: 1 }} onClick={() => setConfirmClear(false)}>
                  Cancelar
                </button>
                <button
                  className="btn danger"
                  style={{ flex: 1 }}
                  onClick={() => {
                    clearAll()
                    setConfirmClear(false)
                    flash('Todos os dados foram apagados.')
                  }}
                >
                  Apagar tudo
                </button>
              </div>
            </div>
          </div>
        )}

        {msg && (
          <p className="center muted" style={{ marginTop: 16 }}>
            {msg}
          </p>
        )}

        <p className="center hint" style={{ marginTop: 28 }}>
          Notas de Sermão · seus dados ficam salvos apenas neste dispositivo.
        </p>
      </div>
    </>
  )
}
