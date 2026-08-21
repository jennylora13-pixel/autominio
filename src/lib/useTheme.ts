import { useEffect, useState } from 'react'
import type { ThemeMode } from '../types'

const KEY = 'notas-de-sermao/theme'

function read(): ThemeMode {
  const v = (typeof localStorage !== 'undefined' && localStorage.getItem(KEY)) as ThemeMode | null
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
}

function apply(mode: ThemeMode) {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = mode === 'dark' || (mode === 'system' && prefersDark)
  root.dataset.theme = dark ? 'dark' : 'light'
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? '#15131f' : '#4f46e5')
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(read)

  useEffect(() => {
    apply(mode)
    localStorage.setItem(KEY, mode)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => mode === 'system' && apply(mode)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [mode])

  return { mode, setMode }
}
