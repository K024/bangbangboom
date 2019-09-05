import { GameMap, Single, Flick, Slide } from "../../core/MapCore";


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
    notes: { time: number, lane: number }[]
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
        for (const note of tp.notes) {
            if (note instanceof Single) {
                list.push({
                    type: "single",
                    time: off + note.time * dt,
                    lane: note.lane,
                    onbeat: note.time % 24 === 0
                })
            } else if (note instanceof Flick) {
                list.push({
                    type: "flick",
                    time: off + note.time * dt,
                    lane: note.lane
                })
            } else if (note instanceof Slide) {
                list.push({
                    type: "slide",
                    flickend: note.flickend,
                    time: off + note.notes[0].time * dt,
                    lane: note.notes[0].lane,
                    notes: note.notes.map(s => ({ time: off + s.time * dt, lane: s.lane }))
                })
            }
        }
    }
    list.sort(comparator)
    return list
}
