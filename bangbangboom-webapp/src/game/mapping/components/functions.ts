
// tslint:disable: object-literal-key-quotes

export function convert(map: string) {
    if (typeof map !== "string") throw new Error()
    const lines = map.split("\n")
    if (lines.length < 3) throw new Error()
    const types = {
        "0": "music",
        "1": "normal",
        "2": "flick",
        "3": "slide_a_start",
        "4": "slide_a_among",
        "5": "slide_a_end",
        "6": "slide_b_start",
        "7": "slide_b_among",
        "8": "slide_b_end",
        "9": "long_note",
        "10": "fever_single",
        "11": "skill",
        "12": "slide_a_end_flick",
        "13": "slide_b_end_flick",
        "14": "long_note_with_flick",
        "20": "bpm_change",

        "21": "long_note_start",
        "25": "long_note_end",
        "26": "long_note_end_with_flick",
    } as any
    let offset = parseFloat(lines[0])
    let bpm = parseFloat(lines[1])
    let beattime = 60 / bpm
    let beatoffset = 0

    let slide_a_record = {} as any
    let slide_b_record = {} as any
    const long_records = {} as any

    const timepoints = [
        { offset, bpm, bpb: 4, notes: [] as any[] }
    ]

    const lasttpns = () => timepoints[timepoints.length - 1].notes

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i]
        const elements = line.split("/").map(e => e.trim()).filter(e => e)
        if (elements.length < 3) continue

        const time = Math.round((parseFloat(elements[0]) - beatoffset) * 24)
        const type = types[elements[1]]
        let lane = parseInt(elements[2]) - 1
        let endtime = 0
        switch (type) {
            case "music":
                break;
            case "normal":
            case "fever_single":
            case "skill":
                lasttpns().push({ type: "single", time, lane })
                break;
            case "flick":
                lasttpns().push({ type: "flick", time, lane })
                break;

            case "slide_a_start":
                slide_a_record = { type: "slide", flickend: false, time, lane, notes: [{ time, lane }] }
                lasttpns().push(slide_a_record)
                break;
            case "slide_a_among":
            case "slide_a_end":
                slide_a_record.notes.push({ time, lane })
                break;
            case "slide_a_end_flick":
                slide_a_record.notes.push({ time, lane })
                slide_a_record.flickend = true
                break;

            case "slide_b_start":
                slide_b_record = { type: "slide", flickend: false, time, lane, notes: [{ time, lane }] }
                lasttpns().push(slide_b_record)
                break;
            case "slide_b_among":
            case "slide_b_end":
                slide_b_record.notes.push({ time, lane })
                break;
            case "slide_b_end_flick":
                slide_b_record.notes.push({ time, lane })
                slide_b_record.flickend = true
                break;

            case "long_note":
                lane = parseInt(elements[3]) - 1
                endtime = Math.round((parseFloat(elements[2]) - beatoffset) * 24)
                lasttpns().push({ type: "slide", flickend: false, time, lane, notes: [{ time, lane }, { time: endtime, lane }] })
                break;
            case "long_note_with_flick":
                lane = parseInt(elements[3]) - 1
                endtime = Math.round((parseFloat(elements[2]) - beatoffset) * 24)
                lasttpns().push({ type: "slide", flickend: true, time, lane, notes: [{ time, lane }, { time: endtime, lane }] })
                break;

            case "long_note_start":
                const long = { type: "slide", flickend: false, time, lane, notes: [{ time, lane }] }
                lasttpns().push(long)
                long_records[lane.toString()] = long
                break;
            case "long_note_end":
                long_records[lane.toString()].notes.push({ time, lane })
                break;
            case "long_note_end_with_flick":
                long_records[lane.toString()].notes.push({ time, lane })
                long_records[lane.toString()].flickend = true
                break;

            case "bpm_change":
                offset = offset + beattime * time / 24
                bpm = parseFloat(elements[2])
                beattime = 60 / bpm
                beatoffset = time / 24
                timepoints.push({ offset, bpm, bpb: 4, notes: [] })
                break;

            default:
                throw new Error()
        }
    }

    const buffer = ["\n"]

    for (const tp of timepoints) {
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
