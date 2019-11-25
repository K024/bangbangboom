
import { GameMapState } from "../GameMapState"
import { PlayState } from "../MappingState"
import { MakeArray, TimeToString } from "../../Global/Utils"

export function getBeatlines1() {
  const tps = GameMapState.map.timepoints
  const list: Array<{ time: number; name: string }> = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = i < tps.length - 1 ? tps[i + 1].offset : PlayState.duration
    const off = tp.offset
    const bt = 60 / tp.bpm
    let beat = 1
    while (off + bt * beat < endtime) {
      const bar = Math.floor(beat / tp.bpb) + 1
      const innerbeat = (beat % tp.bpb) + 1
      list.push({
        time: off + bt * beat,
        name: `${bar} : ${innerbeat}`
      })
      beat++
    }
  }
  return list
}

export function getbBeatlines2() {
  const tps = GameMapState.map.timepoints
  const list: number[] = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = i < tps.length - 1 ? tps[i + 1].offset : PlayState.duration
    const bt = 60 / tp.bpm
    const off = tp.offset + bt / 2
    let beat = 0
    while (off + bt * beat < endtime) {
      list.push(off + bt * beat)
      beat++
    }
  }
  return list
}

export function getBeatlines3() {
  const tps = GameMapState.map.timepoints
  const list: number[] = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = i < tps.length - 1 ? tps[i + 1].offset : PlayState.duration
    const bt = (60 / tp.bpm) / 3
    const off = tp.offset
    let beat = 1
    while (off + bt * beat < endtime) {
      list.push(off + bt * beat)
      beat++
      if (beat % 3 === 0) beat++
    }
  }
  return list
}

export function getBeatlines4() {
  const tps = GameMapState.map.timepoints
  const list: number[] = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = i < tps.length - 1 ? tps[i + 1].offset : PlayState.duration
    const bt = (60 / tp.bpm) / 2
    const off = tp.offset + bt / 2
    let beat = 0
    while (off + bt * beat < endtime) {
      list.push(off + bt * beat)
      beat++
    }
  }
  return list
}

export function nearestBeatTime(time: number, division = 1) {
  const tps = GameMapState.map.timepoints
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = i < tps.length - 1 ? tps[i + 1].offset : PlayState.duration
    if (time > endtime) continue
    const bt = (60 / tp.bpm) / division
    const off = tp.offset - bt / 2
    const d = time - off
    const beat = Math.floor(d / bt)
    if (beat < 0) return null
    return {
      time: tp.offset + beat * bt,
      timepoint: tp.id,
      beatoffset: beat / division * 24
    }
  }
  return null
}


export const barTimeHeightFactor = 30

const crossline = (ctx: CanvasRenderingContext2D, y: number) => {
  ctx.beginPath()
  ctx.moveTo(0, y)
  ctx.lineTo(100, y)
  ctx.stroke()
}
const arc = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.beginPath()
  ctx.lineTo(x, y)
  ctx.arcTo(x + 5, y + 5, x + 10, y, 7)
  ctx.arcTo(x + 5, y - 5, x, y, 7)
  ctx.fill()
}

export const drawScrollBar = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const paddedDuration = PlayState.duration * 1.2
  const timelist = MakeArray(paddedDuration, 0, 2)
  const getY = (time: number) => (paddedDuration - time) * barTimeHeightFactor
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = "12px"
  ctx.lineWidth = 1

  ctx.strokeStyle = "gray"
  for (const t of getBeatlines1()) {
    crossline(ctx, getY(t.time))
  }

  ctx.fillStyle = "aquamarine"
  ctx.strokeStyle = "aquamarine"
  for (const t of GameMapState.map.timepoints) {
    const y = getY(t.offset)
    crossline(ctx, y)
    ctx.fillText(t.bpm + "", 80, y - 3)
  }

  ctx.fillStyle = "white"
  for (const t of timelist) {
    ctx.fillText(TimeToString(t).split(".")[0], 0, getY(t) - 3)
  }

  ctx.fillStyle = "rgb(173,255,47,0.2)"
  for (const t of GameMapState.map.timepoints) {
    const off = t.offset
    const dt = 60 / t.bpm / 24
    for (const s of t.notes) {
      if (s.type === "slide") {
        for (let i = 0; i < s.notes.length - 1; i++) {
          const from = s.notes[i]
          const to = s.notes[i + 1]
          const fromx = from.lane * 10 + 15
          const fromy = getY(from.time * dt + off)
          const tox = to.lane * 10 + 15
          const toy = getY(to.time * dt + off)
          ctx.beginPath()
          ctx.lineTo(fromx, fromy)
          ctx.lineTo(fromx + 10, fromy)
          ctx.lineTo(tox + 10, toy)
          ctx.lineTo(tox, toy)
          ctx.fill()
        }
      }
    }
  }

  for (const t of GameMapState.map.timepoints) {
    const off = t.offset
    const dt = 60 / t.bpm / 24
    for (const n of t.notes) {
      if (n.type === "single") {
        ctx.fillStyle = "rgba(21,224,225)"
        const x = n.lane * 10 + 15
        const y = getY(n.time * dt + off)
        arc(ctx, x, y)
      } else if (n.type === "flick") {
        ctx.fillStyle = "rgba(255,59,114)"
        const x = n.lane * 10 + 15
        const y = getY(n.time * dt + off)
        ctx.beginPath()
        ctx.lineTo(x, y)
        ctx.lineTo(x + 5, y + 3)
        ctx.lineTo(x + 10, y)
        ctx.lineTo(x + 5, y - 3)
        ctx.fill()
      } else {
        ctx.fillStyle = "rgba(1,219,1)"
        ctx.strokeStyle = "rgba(1,219,1)"
        ctx.lineWidth = 2
        let i = 0
        let x = n.notes[i].lane * 10 + 15
        let y = getY(n.notes[i].time * dt + off)
        ctx.beginPath()
        arc(ctx, x, y)
        i++
        while (i < n.notes.length - 1) {
          x = n.notes[i].lane * 10 + 15
          y = getY(n.notes[i].time * dt + off)
          ctx.beginPath()
          ctx.lineTo(x, y)
          ctx.lineTo(x + 10, y)
          ctx.stroke()
          i++
        }
        if (n.flickend) ctx.fillStyle = "rgba(255,59,114)"
        x = n.notes[i].lane * 10 + 15
        y = getY(n.notes[i].time * dt + off)
        arc(ctx, x, y)
      }
    }
  }
}