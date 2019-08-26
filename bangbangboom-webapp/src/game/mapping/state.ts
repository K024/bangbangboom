import Vue from 'vue'
import { Howl } from 'howler'
import { Ticker, MinTicker } from '../core/Ticker';

export const PlayState = Vue.observable({
    music: null as Howl | null,
    soundid: 0,
    duration: 5,
    /** *** should not be depended in large component in any way *** */
    position: 1,
    half: false,
    playing: false,
})

export const SoundTime = Vue.observable({
    /** *** should not be depended in large component in any way *** */
    value: 0
})

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

export const MetaState = Vue.observable({
    musicSrc: "",

    backgroundImageSrc: "",
    backgroundDim: 70,

    backgroundCover: true,
    lowPerformance: false,
})

const vm = new Vue()
vm.$watch(() => MetaState.musicSrc, n => {
    if (n) {
        PlayState.music = null
        const h = new Howl({ src: n, format: "mp3" })
        h.once("load", () => {
            PlayState.music = h
            PlayState.duration = h.duration()
        })
        h.once("loaderror", (id, err) => Vue.toasted.error("Load music error"))
        h.on("play", () => PlayState.playing = true)
        h.on("seek", sid => PlayState.position = h.seek(undefined, sid) as number)
    } else {
        if (PlayState.music)
            PlayState.music.unload()
        PlayState.music = null
    }
})
vm.$watch(() => PlayState.music, n => {
    if (n) {
        PlayState.duration = n.duration()
        PlayState.position = 0
        PlayState.half = false
        PlayState.playing = false
        PlayState.soundid = n.play()
        n.pause(PlayState.soundid)
        n.on("end", () => {
            PlayState.soundid = n.play()
            n.pause(PlayState.soundid)
        })
    }
})
vm.$watch(() => PlayState.half, n => {
    if (PlayState.music)
        PlayState.music.rate(n ? 0.5 : 1, PlayState.soundid)
})

export const ticker = new Ticker()
ticker.SkipFrame = 0
ticker.Tick.add(() => {
    const s = PlayState
    const m = s.music
    if (m && s.playing) {
        s.position = m.seek(undefined, s.soundid) as number
        s.playing = m.playing(s.soundid)
    } else {
        s.playing = false
    }
})

vm.$watch(() => MetaState.lowPerformance, n => {
    if (n) ticker.SkipFrame = 1
    else ticker.SkipFrame = 0
})
export const minTicker = new MinTicker();
minTicker.Tick.add(() => {
    const s = PlayState
    const m = s.music
    if (m && s.playing) {
        SoundTime.value = m.seek(undefined, s.soundid) as number
    } else {
        s.playing = false
    }
})

export function SecondToString(s: number) {
    function padZero(n: number, len: number) {
        const str = n.toString();
        if (str.length >= len) return str;
        return ("000000" + n).slice(-len);
    }
    s = Math.abs(s);
    const minutes = Math.floor(s / 60);
    s -= minutes * 60;
    const seconds = Math.floor(s);
    s -= seconds;
    const milis = Math.floor(s * 1000);
    return `${padZero(minutes, 2)}:${padZero(seconds, 2)}.${padZero(milis, 3)}`;
}
