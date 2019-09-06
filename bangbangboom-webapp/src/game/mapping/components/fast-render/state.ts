import Vue from "vue"
import { GameMapState } from '../../gamemapstate';
import { PlayState, seekPercent } from '../../state';
import { Single, Flick, Slide } from '@/game/core/MapCore';

export const SelectPosition = Vue.observable({
    p: 0,
    follow: false
})

export function timelist(interval: number, max: number): number[] {
    const list: number[] = [];
    let t = 0;
    while (t <= max) {
        list.push(t);
        t += interval;
    }
    return list;
}

export function beatline1() {
    const tps = GameMapState.s.timepoints;
    const list: Array<{ time: number; name: string }> = [];
    let endtime = 0;
    for (let i = 0; i < tps.length; i++) {
        const tp = tps[i];
        endtime =
            i < tps.length - 1 ? tps[i + 1].time : PlayState.duration;
        const off = tp.time;
        const bt = tp.beatTime();
        let beat = 1;
        while (off + bt * beat < endtime) {
            const bar = Math.floor(beat / tp.bpb) + 1;
            const innerbeat = (beat % tp.bpb) + 1;
            list.push({
                time: off + bt * beat,
                name: `${bar} : ${innerbeat}`
            });
            beat++;
        }
    }
    return list;
}

export function beatline2() {
    const tps = GameMapState.s.timepoints;
    const list: number[] = [];
    let endtime = 0;
    for (let i = 0; i < tps.length; i++) {
        const tp = tps[i];
        endtime =
            i < tps.length - 1 ? tps[i + 1].time : PlayState.duration;
        const bt = tp.beatTime();
        const off = tp.time + bt / 2;
        let beat = 0;
        while (off + bt * beat < endtime) {
            list.push(off + bt * beat);
            beat++;
        }
    }
    return list;
}

export function beatline3() {
    const tps = GameMapState.s.timepoints;
    const list: number[] = [];
    let endtime = 0;
    for (let i = 0; i < tps.length; i++) {
        const tp = tps[i];
        endtime =
            i < tps.length - 1 ? tps[i + 1].time : PlayState.duration;
        const bt = tp.beatTime() / 3;
        const off = tp.time;
        let beat = 1;
        while (off + bt * beat < endtime) {
            list.push(off + bt * beat);
            beat++;
            if (beat % 3 === 0) beat++;
        }
    }
    return list;
}

export function beatline4() {
    const tps = GameMapState.s.timepoints;
    const list: number[] = [];
    let endtime = 0;
    for (let i = 0; i < tps.length; i++) {
        const tp = tps[i];
        endtime =
            i < tps.length - 1 ? tps[i + 1].time : PlayState.duration;
        const bt = tp.beatTime() / 2;
        const off = tp.time + bt / 2;
        let beat = 0;
        while (off + bt * beat < endtime) {
            list.push(off + bt * beat);
            beat++;
        }
    }
    return list;
}

export function nearestBeatTime(time: number, division = 1) {
    const tps = GameMapState.s.timepoints;
    let endtime = 0;
    for (let i = 0; i < tps.length; i++) {
        const tp = tps[i];
        endtime = i < tps.length - 1 ? tps[i + 1].time : PlayState.duration;
        if (time > endtime) continue
        const bt = tp.beatTime() / division
        const off = tp.time - bt / 2
        const d = time - off
        const beat = Math.floor(d / bt)
        if (beat < 0) return null
        return {
            time: tp.time + beat * bt,
            timepoint: tp.track,
            beatoffset: beat / division * 24
        }
    }
    return null
}

export const soundList = Vue.observable({
    l: [] as Array<{ type: string, time: number }>
})

const vm = new Vue()
vm.$watch(() => {
    const list: Array<{ type: string, time: number }> = []
    for (const tp of GameMapState.s.timepoints) {
        const off = tp.time
        const dt = tp.beatTime() / 24
        for (const n of tp.notes) {
            if (n instanceof Single) {
                list.push({ type: "perfect", time: off + n.time * dt })
            } else if (n instanceof Flick) {
                list.push({ type: "flick", time: off + n.time * dt })
            } else if (n instanceof Slide) {
                list.push({ type: "longstart", time: off + n.notes[0].time * dt })
                n.notes.forEach(s => list.push({ type: "perfect", time: off + s.time * dt }))
                if (n.flickend) list[list.length - 1].type = "flick"
                list.push({ type: "longend", time: off + n.notes[n.notes.length - 1].time * dt })
            }
        }
    }
    list.sort((a, b) => a.time - b.time)
    return list
}, n => soundList.l = n, { immediate: true })

vm.$watch(() => PlayState.position, n => { if (SelectPosition.follow) SelectPosition.p = n })
vm.$watch(() => SelectPosition.p, n => {
    if (SelectPosition.follow && Math.abs(SelectPosition.p - PlayState.position) > 0.1)
        seekPercent(SelectPosition.p / PlayState.duration)
})
