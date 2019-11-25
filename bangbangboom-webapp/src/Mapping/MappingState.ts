import { observable, reaction } from "mobx"
import { Howl } from "howler"
import { setMessage } from "../Global/Snackbar"

export const MetaState = observable({
  musicSrc: "",

  backgroundImageSrc: "",
  backgroundDim: 70,

  backgroundCover: true,
  lowPerformance: false,
})

export const PlayState = observable({
  music: null as Howl | null,
  soundid: 0,
  duration: 5,
  half: false,
  playing: false,

  /** will be updated each animation frame */
  position: 1,
})

export function seek(time: number) {
  if (time < 0) time = 0
  if (time > PlayState.duration) time = PlayState.duration
  if (PlayState.music) PlayState.music.seek(time, PlayState.soundid || undefined)
  PlayState.position = time
}

export function seekPercent(p: number) {
  if (p < 0) p = 0
  if (p > 1) p = 1
  const s = PlayState.duration * p
  if (PlayState.music) PlayState.music.seek(s, PlayState.soundid || undefined)
  PlayState.position = s
}

export const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
  e.stopPropagation()
  const dt = e.deltaY / 100
  let target = PlayState.position - dt
  if (target < 0) target = 0
  if (target > PlayState.duration) target = PlayState.duration
  seekPercent(target / PlayState.duration)
}

export function togglePlay() {
  const m = PlayState.music
  if (m) {
    if (PlayState.playing) m.pause()
    else m.play(PlayState.soundid)
    PlayState.playing = !PlayState.playing
  } else PlayState.playing = false
}

reaction(() => MetaState.musicSrc, src => {
  if (src) {
    PlayState.music = null
    const h = new Howl({ src, format: "mp3" })
    h.once("load", () => {
      PlayState.music = h
    })
    h.once("loaderror", () => setMessage("err.loaderr", "error"))
  } else {
    if (PlayState.music) PlayState.music.unload()
    PlayState.music = null
    PlayState.duration = 5
    PlayState.position = 1
    PlayState.playing = false
  }
})

reaction(() => PlayState.music, m => {
  if (!m) return
  PlayState.duration = m.duration()
  PlayState.half = false
  PlayState.playing = false
  PlayState.position = 0
  PlayState.soundid = m.play()
  m.pause(PlayState.soundid)
  m.seek(0, PlayState.soundid)
  m.on("end", () => {
    PlayState.soundid = m.play()
    m.pause(PlayState.soundid)
    m.seek(0, PlayState.soundid)
    PlayState.playing = false
  })
})

reaction(() => PlayState.half, n => {
  if (PlayState.music)
    PlayState.music.rate(n ? 0.5 : 1, PlayState.soundid)
})

export function StartMapping() {
  let skip = false
  let lastTime = performance.now()
  let lastPos = 0
  let ended = false
  function AnimLoop() {
    if (ended) return
    requestAnimationFrame(AnimLoop)

    if (skip && MetaState.lowPerformance) {
      skip = false
      return
    }
    skip = true

    if (PlayState.music && PlayState.playing) {
      const pos = PlayState.music.seek(PlayState.soundid) as number
      if (pos === lastPos) {
        PlayState.position = pos + (performance.now() - lastTime) * (PlayState.music.rate(PlayState.soundid) as number) / 1000
      } else {
        if (pos < PlayState.position && pos + 0.1 > PlayState.position) console.warn("Position wrong")
        PlayState.position = pos
        lastTime = performance.now()
      }
    }
  }
  requestAnimationFrame(AnimLoop)
  return function () {
    ended = true
  }
}

