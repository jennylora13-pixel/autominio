import { useCallback, useEffect, useRef, useState } from 'react'
import { pauseAmbient, resumeAmbient, startAmbient, stopAmbient } from './ambient'

const ORDINAL: Record<string, string> = { '1': 'Primeira', '2': 'Segunda', '3': 'Terceira' }

/** "(Filipenses 4:6-7)" -> ", Filipenses, capítulo 4, versículos 6 a 7," so the voice reads it naturally. */
export function speakableText(text: string): string {
  return text
    .replace(
      /(?:([123]) )?(\p{Lu}\p{Ll}+) (\d+):(\d+)(?:-(\d+))?/gu,
      (_, n: string | undefined, book: string, ch: string, v1: string, v2: string | undefined) =>
        `${n ? ORDINAL[n] + ' ' : ''}${book}, capítulo ${ch}, ` +
        (v2 ? `versículos ${v1} a ${v2}` : `versículo ${v1}`),
    )
    .replace(/[()]/g, ', ')
    .replace(/["“”]/g, '')
    .replace(/\s*,(\s*[,.:;])+/g, (m) => m.trim().slice(-1))
    .replace(/([.!?])\s*,\s*/g, '$1 ')
    .replace(/\s{2,}/g, ' ')
}

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices()
  const lang = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase()
  const br = voices.filter((v) => lang(v) === 'pt-br')
  return (
    br.find((v) => /luciana|francisca|google/i.test(v.name)) ??
    br[0] ??
    voices.find((v) => lang(v).startsWith('pt'))
  )
}

/** Rough listening time at the calm speaking rate used below. */
export function estimateMinutes(paragraphs: string[]): number {
  const words = paragraphs.join(' ').split(/\s+/).length
  return Math.max(1, Math.round(words / 140))
}

export type AudioState = 'idle' | 'playing' | 'paused'

// only one prayer is read at a time; starting another stops this one
let stopCurrentReader: (() => void) | null = null

/** Reads paragraphs aloud one by one, with a short pause between them. */
export function usePrayerAudio(paragraphs: string[], withMusic: boolean) {
  const [state, setState] = useState<AudioState>('idle')
  const [current, setCurrent] = useState(-1)
  // bumped on every stop so callbacks from a cancelled run are ignored
  const run = useRef(0)
  const timer = useRef<number>()
  // while paused, the paragraph to read on resume (set when a pause falls between paragraphs)
  const paused = useRef(false)
  const resumeAt = useRef<number | null>(null)

  const stop = useCallback(() => {
    run.current++
    window.clearTimeout(timer.current)
    paused.current = false
    resumeAt.current = null
    setState('idle')
    setCurrent(-1)
    // leave other players (and their audio) alone
    if (stopCurrentReader !== stop) return
    stopCurrentReader = null
    if (speechSupported) speechSynthesis.cancel()
    stopAmbient()
  }, [])

  const speakFrom = useCallback(
    (i: number, id: number) => {
      if (id !== run.current) return
      if (i >= paragraphs.length) {
        stop()
        return
      }
      const u = new SpeechSynthesisUtterance(speakableText(paragraphs[i]))
      u.lang = 'pt-BR'
      u.voice = pickVoice() ?? null
      u.rate = 0.92
      u.onend = () => {
        if (id !== run.current) return
        if (paused.current) resumeAt.current = i + 1
        else timer.current = window.setTimeout(() => next(i + 1, id), 700)
      }
      setCurrent(i)
      speechSynthesis.speak(u)
    },
    [paragraphs, stop],
  )

  // after the gap between paragraphs, unless a pause came in meanwhile
  const next = useCallback(
    (i: number, id: number) => {
      if (paused.current) resumeAt.current = i
      else speakFrom(i, id)
    },
    [speakFrom],
  )

  const play = useCallback(() => {
    if (!speechSupported) return
    if (state === 'paused') {
      paused.current = false
      resumeAmbient()
      setState('playing')
      // the system voice stays paused until resume(), even for newly queued text
      speechSynthesis.resume()
      const at = resumeAt.current
      resumeAt.current = null
      if (at !== null) speakFrom(at, run.current)
      return
    }
    stopCurrentReader?.()
    stopCurrentReader = stop
    run.current++
    const id = run.current
    if (withMusic) startAmbient()
    setState('playing')
    speakFrom(0, id)
  }, [state, stop, speakFrom, withMusic])

  const pause = useCallback(() => {
    paused.current = true
    speechSynthesis.pause()
    pauseAmbient()
    setState('paused')
  }, [])

  // a new prayer or leaving the screen ends the reading
  useEffect(() => stop, [paragraphs, stop])

  return { state, current, play, pause, stop }
}
