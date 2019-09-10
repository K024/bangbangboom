
// magic numbers

export const layerWidth = 1280;
export const layerHeight = 720;

export const lanePos_x = layerWidth / 2;
export const lanePos_y = layerHeight * 0.85;

export const linePos_x_collection: number[] = []

// common中的7条轨道 x位置
// 下方的有7条轨道所以又八个点，因为中途有反转所以八个点的坐标都要设置
for (let i = 0; i < 8; i++) {
    linePos_x_collection[i] = ((i * 0.12 + 0.08) * layerWidth);
}

export const notes_x_collection: number[] = []

// note 在七个轨道的位置
for (let i = 0; i < 7; i++) {
    notes_x_collection.push((i * 0.12 + 0.14) * layerWidth);
}

export const halfNoteWidth = 0.05 * layerWidth

export const lineTopY = (154 * (lanePos_y - 500) - 29.5 * lanePos_y) / 124.5;

export const nearlineZ = 1
export const nearToInfHeight = lanePos_y - lineTopY

export const farlineZ = 20 + nearlineZ

// 按键评分延迟时间, s
export const perfectLatency = 50 * 0.001;
export const greatLatency = 100 * 0.001;
export const badLatency = 150 * 0.001;
export const missLatency = 200 * 0.001;


export let zspeed = 20
export let noteInitScale = 0.8;

export let visualOffset = -30
export let judgeOffset = 0
export let barOpacity = 1;
export let backgroundDim = 0.7

// 在 gameOption 里应该添加能更改 zspeed 和judgeoffset 的数字

export class Config {
    speed = 10
    visualOffset = 0
    judgeOffset = 0
    barOpacity = 1
    noteScale = 1
    backgroundDim = 0.7

}


export function apply(c: Config) {
    if (c.speed > 15) c.speed = 15
    else if (c.speed < 1) c.speed = 1
    if (c.noteScale > 2) c.noteScale = 2
    else if (c.noteScale < 0.1) c.noteScale = 0.1
    if (c.visualOffset > 300) c.visualOffset = 300
    else if (c.visualOffset < -300) c.visualOffset = -300
    if (c.judgeOffset > 300) c.judgeOffset = 300
    else if (c.judgeOffset < -300) c.judgeOffset = -300
    if (c.barOpacity > 1) c.barOpacity = 1
    else if (c.barOpacity < 0) c.barOpacity = 0
    if (c.backgroundDim > 1) c.backgroundDim = 1
    else if (c.backgroundDim < 0) c.backgroundDim = 0

    zspeed = c.speed * 2
    noteInitScale = c.noteScale * 0.76
    visualOffset = c.visualOffset - 40
    judgeOffset = c.judgeOffset
    barOpacity = c.barOpacity
    backgroundDim = c.backgroundDim
}


