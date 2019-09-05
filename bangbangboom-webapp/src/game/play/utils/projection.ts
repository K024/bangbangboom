import { nearToInfHeight, nearlineZ, lanePos_x, notes_x_collection, lineTopY, farlineZ } from "../constants";

function getProjectionPoint(z: number, xOff: number) {
    const px = xOff / z
    const h = nearToInfHeight * nearlineZ / z
    return {
        toInfHeight: h,
        newXOff: px
    }
}

/**
 * 
 * @param trackpos 在虚拟轨道上的z位置（0-30）
 * @param laneOffset 在虚拟轨道上的x位置（在判定线处的x）
 */
export function projection(trackpos: number, laneOffset: number) {
    const z = trackpos + nearlineZ
    const p = getProjectionPoint(z, laneOffset - lanePos_x)
    return {
        x: p.newXOff + lanePos_x,
        y: p.toInfHeight + lineTopY,
        scale: 1 / z
    }
}


export function ratio(start: number, end: number, target: number, from: number, to: number) {
    const r = (target - start) / (end - start)
    return (to - from) * r + from
}
