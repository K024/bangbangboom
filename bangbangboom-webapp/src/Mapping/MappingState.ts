import { observable, reaction } from "mobx"
import { Howl } from "howler"
import { setMessage } from "../Global/Snackbar";

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
  position: 0,
})

export function seek(time: number) {
  if (time < 0) time = 0;
  if (time > PlayState.duration) time = PlayState.duration
  if (PlayState.music) PlayState.music.seek(time, PlayState.soundid || undefined)
  else PlayState.position = time
}

export function seekPercent(p: number) {
  if (p < 0) p = 0;
  if (p > 1) p = 1
  const s = PlayState.duration * p
  if (PlayState.music) PlayState.music.seek(s, PlayState.soundid || undefined)
  else PlayState.position = s
}

export function togglePlay() {
  const m = PlayState.music;
  if (m) {
    if (PlayState.playing) m.pause();
    else m.play(PlayState.soundid);
  }
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
  }
})

reaction(() => PlayState.music, m => {
  if (!m) return
  PlayState.duration = m.duration()
  PlayState.position = 0
  PlayState.half = false
  PlayState.playing = false
  PlayState.soundid = m.play()
  m.pause(PlayState.soundid)
  m.on("play", () => PlayState.playing = true)
  m.on("pause", () => PlayState.playing = false)
  m.on("end", () => {
    PlayState.soundid = m.play()
    m.pause(PlayState.soundid)
  })
})

reaction(() => PlayState.half, n => {
  if (PlayState.music)
    PlayState.music.rate(n ? 0.5 : 1, PlayState.soundid)
})

let skip = false
let lastTime = performance.now()
let lastPos = 0
function AnimLoop() {
  requestAnimationFrame(AnimLoop)

  if (skip && MetaState.lowPerformance) {
    skip = false
    return
  }
  skip = true

  if (PlayState.music && PlayState.playing) {
    const pos = PlayState.music.seek(PlayState.soundid) as number
    if (pos === lastPos) {
      PlayState.position = pos + (performance.now() - lastTime) * (PlayState.music.rate(PlayState.soundid) as number)
    } else {
      PlayState.position = pos
      lastTime = performance.now()
    }
  }
}
requestAnimationFrame(AnimLoop)

