import { GameEvent } from "../utils/event";
import { hitTypeEvent, hitType } from "../components/mainlayer/hitType";

export let score = 0
export let combo = 0
export let maxCombo = 0

export let perfectCombo = 0
export let greatCombo = 0
export let badCombo = 0
export let missCombo = 0

export let isFullCombo = true
export const hitScoreEvent = new GameEvent<[number]>();

export function clearCombo() {
    score = 0
    combo = 0
    maxCombo = 0
    perfectCombo = 0
    greatCombo = 0
    badCombo = 0
    missCombo = 0
    isFullCombo = true
}

hitTypeEvent.add((n) => {
    if (n === hitType.miss || n === hitType.bad) {
        combo = 0
        isFullCombo = false
        hitScoreEvent.emit(combo)
    }
    else {
        combo++
        if (maxCombo < combo)
            maxCombo = combo
        hitScoreEvent.emit(combo);

        // 计分
        if (n === hitType.perfect) {
            score += 1000
        }
        if (n === hitType.great) {
            score += 700
        }
    }

    switch (n) {
        case hitType.perfect:
            perfectCombo++
            break;
        case hitType.great:
            greatCombo++;
            break;
        case hitType.bad:
            badCombo++;
            break;
        case hitType.miss:
            missCombo++
            break;
    }
})