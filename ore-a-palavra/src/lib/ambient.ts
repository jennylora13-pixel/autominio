// Soft background pad made with the Web Audio API — no audio files to download or license.

let ctx: AudioContext | null = null
let master: GainNode | null = null

// C major add9, spread over two octaves
const NOTES = [130.81, 196.0, 261.63, 293.66, 329.63, 392.0]
const VOLUME = 0.11

export function startAmbient() {
  stopAmbient()
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return
  ctx = new Ctor()
  master = ctx.createGain()
  master.gain.value = 0
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 900
  filter.connect(master)
  master.connect(ctx.destination)

  NOTES.forEach((freq, i) => {
    const osc = ctx!.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const gain = ctx!.createGain()
    gain.gain.value = 0.12
    // each voice swells slowly at its own pace
    const lfo = ctx!.createOscillator()
    lfo.frequency.value = 0.05 + i * 0.017
    const depth = ctx!.createGain()
    depth.gain.value = 0.08
    lfo.connect(depth).connect(gain.gain)
    osc.connect(gain).connect(filter)
    osc.start()
    lfo.start()
  })
  master.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 3)
}

export function pauseAmbient() {
  void ctx?.suspend()
}

export function resumeAmbient() {
  void ctx?.resume()
}

export function stopAmbient() {
  if (!ctx || !master) return
  const closing = ctx
  master.gain.cancelScheduledValues(closing.currentTime)
  master.gain.setValueAtTime(master.gain.value, closing.currentTime)
  master.gain.linearRampToValueAtTime(0, closing.currentTime + 1.2)
  window.setTimeout(() => void closing.close(), 1300)
  ctx = null
  master = null
}
