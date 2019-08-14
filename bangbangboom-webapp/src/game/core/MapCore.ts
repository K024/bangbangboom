
function trackString() {
    return Math.random().toString(36).substring(2, 15)
}

export abstract class Note {
    track = trackString()
}

/**
 * 单点
 */
export class Single extends Note {
    /**
     * 左侧第一条为0
     */
    lane = 0
    /** 
     * 从计时点开始 1/24 个4分音符数
     */
    time = 0
}

/**
 * 滑键
 */
export class Flick extends Note {
    /**
     * 左侧第一条为0
     */
    lane = 0
    /** 
     * 从计时点开始 1/24 个4分音符数
     */
    time = 0
}

/**
 * 长键
 */
export class Slide extends Note {
    /**
     * 滑键结束
     */
    flickend = false
    /**
     * 过程点
     */
    notes: Single[] = []
}

/**
 * 计时点
 */
export class TimePoint {
    /**
     * 计时点开始时间，秒
     */
    time = 0
    /**
     * 每分钟4分音符节拍数
     */
    bpm = 90
    /**
     * 每小节4分音符数量
     */
    bpb = 4
    notes: Note[] = []

    beatTime() {
        return 60 / this.bpm
    }

    getBeat(t: number) {
        if (t < this.time) return null
        const bt = this.beatTime()
        const bar = bt * this.bpb
        let off = t - this.time
        const barCount = Math.floor(off / bar)
        off -= barCount * bar
        const beatCount = Math.floor(off / bt)
        off -= beatCount * bt
        return {
            bar: barCount + 1,
            beat: beatCount + 1,
            offset: off
        }
    }

    track = trackString()
}

export class GameMap {
    timepoints: TimePoint[] = []

    getNextTimePoint(t: number) {
        this.timepoints.sort((a, b) => a.time - b.time)
        for (const tp of this.timepoints) {
            if (tp.time > t)
                return tp
        }
        return null
    }

    getCurrentTimePoint(t: number) {
        this.timepoints.sort((a, b) => a.time - b.time)
        let prev: TimePoint | null = null
        for (const tp of this.timepoints) {
            if (tp.time > t)
                break
            prev = tp
        }
        return prev
    }

    toMapString() {
        const buffer = ["\n"]

        for (const tp of this.timepoints) {
            buffer.push("\n+|", tp.time.toString(), "|", tp.bpm.toString(), "|", tp.bpb.toFixed(), "\n\n")

            for (const note of tp.notes) {
                if (note instanceof Single) {
                    buffer.push("s|", note.time.toFixed(), ":", note.lane.toFixed(), "\n")
                } else if (note instanceof Flick) {
                    buffer.push("f|", note.time.toFixed(), ":", note.lane.toFixed(), "\n")
                } else if (note instanceof Slide) {
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

    static fromMapString(map: string) {
        const lines = map.split(/\r?\n/)
        const gamemap = new GameMap()

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

        function addTp(items: string[]) {
            const tp = new TimePoint()
            tp.time = pf(items[1])
            tp.bpm = pf(items[2])
            tp.bpb = pi(items[3])
            gamemap.timepoints.push(tp)
        }
        function addSingle(items: string[]) {
            const s = new Single()
            const tl = items[1].split(":")
            s.time = pi(tl[0])
            s.lane = pi(tl[1])
            gamemap.timepoints[gamemap.timepoints.length - 1].notes.push(s)
        }
        function addFlick(items: string[]) {
            const f = new Flick()
            const tl = items[1].split(":")
            f.time = pi(tl[0])
            f.lane = pi(tl[1])
            gamemap.timepoints[gamemap.timepoints.length - 1].notes.push(f)
        }
        function addSlide(items: string[]) {
            const l = new Slide()
            l.flickend = items[1] === "1"
            for (let i = 2; i < items.length; i++) {
                const tl = items[i].split(":")
                const s = new Single()
                s.time = pi(tl[0])
                s.lane = pi(tl[1])
                l.notes.push(s)
            }
            if (l.notes.length < 2) throw new Error("Not a slide")
            gamemap.timepoints[gamemap.timepoints.length - 1].notes.push(l)
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const items = line.split("|").filter(it => it.length > 0)
            if (items.length < 1) continue
            try {
                switch (items[0]) {
                    case "+": addTp(items); break
                    case "s": addSingle(items); break
                    case "f": addFlick(items); break
                    case "l": addSlide(items); break
                }
            } catch (error) {
                console.error(`[GameMap]error parsing line ${i}: ${error}`)
            }
        }

        return gamemap
    }
}

