import { uuid, findex } from "./Utils"

export type IdItem = {
    /** random uuid string for tracking */
    id: string
}

export type Point = {
    /** the first on the left is 0 */
    lane: number
    /** number of 1/24 beats from timepoint offset */
    time: number
}

export type Single = {
    type: "single"
} & IdItem & Point

export type Flick = {
    type: "flick"
} & IdItem & Point

export type Slide = {
    type: "slide"
    flickend: boolean
    notes: Array<Point & IdItem>
} & IdItem

export type Note = Single | Flick | Slide

export type TimePoint = {
    offset: number
    bpm: number
    bpb: number // beats per bar
    notes: Note[]
} & IdItem

export type GameMap = {
    timepoints: TimePoint[]
}

export function GameMapToString(map: GameMap) {
    const buffer = [""]

    for (const tp of map.timepoints) {
        buffer.push("\n+|", tp.offset.toString(), "|", tp.bpm.toString(), "|", tp.bpb.toFixed(), "\n\n")

        for (const note of tp.notes) {
            if (note.type === "single") {
                buffer.push("s|", note.time.toFixed(), ":", note.lane.toFixed(), "\n")
            } else if (note.type === "flick") {
                buffer.push("f|", note.time.toFixed(), ":", note.lane.toFixed(), "\n")
            } else if (note.type === "slide") {
                buffer.push("l|", note.flickend ? "1" : "0")
                for (const n of note.notes) {
                    buffer.push("|", n.time.toFixed(), ":", n.lane.toFixed())
                }
                buffer.push("\n")
            }
        }
    }

    return buffer.join("")
}

function pi(s: string) {
    const value = parseInt(s)
    if (isNaN(value)) throw new Error("Not a number")
    return value
}
function pf(s: string) {
    const value = parseFloat(s)
    if (isNaN(value)) throw new Error("Not a number")
    return value
}

export function GameMapFromString(mapstring: string) {

    const lines = mapstring.split(/\r?\n/)
    const gamemap: GameMap = {
        timepoints: []
    }

    function addTp(items: string[]) {
        gamemap.timepoints.push({
            id: uuid(),
            offset: pf(items[1]),
            bpm: pf(items[2]),
            bpb: pi(items[3]),
            notes: [],
        })
    }
    function addSingle(items: string[]) {
        const tl = items[1].split(":").map(it => it.trim())
        findex(gamemap.timepoints, -1).notes.push({
            id: uuid(),
            type: "single",
            time: pi(tl[0]),
            lane: pi(tl[1]),
        })
    }
    function addFlick(items: string[]) {
        const tl = items[1].split(":").map(it => it.trim())
        findex(gamemap.timepoints, -1).notes.push({
            id: uuid(),
            type: "flick",
            time: pi(tl[0]),
            lane: pi(tl[1]),
        })
    }
    function addSlide(items: string[]) {
        const notes: Array<Point & IdItem> = []
        for (let i = 2; i < items.length; i++) {
            const tl = items[i].split(":").map(it => it.trim())
            notes.push({
                id: uuid(),
                time: pi(tl[0]),
                lane: pi(tl[1]),
            })
        }
        if (notes.length < 2) throw new Error("Not a slide")
        findex(gamemap.timepoints, -1).notes.push({
            id: uuid(),
            type: "slide",
            flickend: items[1] === "1",
            notes
        })
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const items = line.split("|").map(it => it.trim()).filter(it => it.length > 0)
        if (items.length < 1) continue
        try {
            switch (items[0]) {
                case "+": addTp(items); break
                case "s": addSingle(items); break
                case "f": addFlick(items); break
                case "l": addSlide(items); break
            }
        } catch (error) {
            console.error(`[GameMap] error parsing line ${i}: ${error}`)
        }
    }

    return gamemap
}

