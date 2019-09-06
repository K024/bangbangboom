import { GameMap, Single, Flick, Slide } from "../../core/MapCore";

// tslint:disable: interface-name class-name

export interface single {
    type: "single"
    time: number,
    lane: number,
    onbeat: boolean
}
export interface flick {
    type: "flick"
    time: number,
    lane: number,
}
export interface slide {
    type: "slide",
    flickend: boolean,
    time: number,
    lane: number,
    notes: Array<{ time: number, lane: number }>
}

export type note = single | flick | slide

function comparator(a: note, b: note) {
    const t = a.time - b.time
    if (t !== 0) return t
    const l = a.lane - b.lane
    if (l === 0) console.warn("same beat note")
    return l
}

export function convert(map: GameMap) {
    const list: note[] = []

    for (const tp of map.timepoints) {
        const off = tp.time
        const dt = tp.beatTime() / 24
        for (const n of tp.notes) {
            if (n instanceof Single) {
                list.push({
                    type: "single",
                    time: off + n.time * dt,
                    lane: n.lane,
                    onbeat: n.time % 24 === 0
                })
            } else if (n instanceof Flick) {
                list.push({
                    type: "flick",
                    time: off + n.time * dt,
                    lane: n.lane
                })
            } else if (n instanceof Slide) {
                list.push({
                    type: "slide",
                    flickend: n.flickend,
                    time: off + n.notes[0].time * dt,
                    lane: n.notes[0].lane,
                    notes: n.notes.map(s => ({ time: off + s.time * dt, lane: s.lane }))
                })
            }
        }
    }
    list.sort(comparator)
    return list
}
