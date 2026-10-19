import { estimateMinutes, speechSupported, type AudioState } from '../lib/speech'
import { useStore } from '../store'

interface Props {
  paragraphs: string[]
  state: AudioState
  onPlay: () => void
  onPause: () => void
  onStop: () => void
}

/** "Ouvir oração" card: play/pause, stop and the soft background toggle. */
export default function AudioPlayer({ paragraphs, state, onPlay, onPause, onStop }: Props) {
  const { data, updateSettings } = useStore()
  if (!speechSupported) return null
  const music = data.settings.audioMusic

  return (
    <div className="player">
      <button
        className="player-main"
        onClick={state === 'playing' ? onPause : onPlay}
        aria-label={state === 'playing' ? 'Pausar' : 'Ouvir oração'}
      >
        {state === 'playing' ? '❚❚' : '▶'}
      </button>
      <div className="player-info">
        <b>{state === 'idle' ? 'Ouvir oração' : state === 'playing' ? 'Orando com você…' : 'Pausado'}</b>
        <span>Cerca de {estimateMinutes(paragraphs)} min · voz do seu celular</span>
      </div>
      {state !== 'idle' ? (
        <button className="player-chip" onClick={onStop}>
          Parar
        </button>
      ) : (
        <button
          className={'player-chip' + (music ? ' on' : '')}
          onClick={() => updateSettings({ audioMusic: !music })}
          aria-pressed={music}
        >
          ♪ Fundo {music ? 'ligado' : 'desligado'}
        </button>
      )}
    </div>
  )
}
