
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

// 在 gameOption 里应该添加能更改 zspeed 和judgeoffset 的数字




