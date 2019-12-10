

export function uuid() {
    return Math.random().toString(36).substring(2, 10)
}

export function findex<T>(list: T[], i: number): T {
    if (list.length <= 0) return undefined as any
    if (i >= list.length) return undefined as any
    if (i < -list.length) return undefined as any
    if (i < 0) i += list.length
    return list[i]
}

/**
 * return the index of the largest element equal or smaller than target
 */
export function binarySearch(list: (i: number) => number, length: number, target: number, force = false) {
    let l = 0
    let r = length - 1
    if (length <= 0) return -1
    if (target < list(l)) return -1
    if (list(r) <= target) return r

    if (!force && length < 10) {
        while (list(l) <= target) l++
        return l - 1
    }

    while (l < r - 1) {
        const m = Math.floor((l + r) / 2)
        const v = list(m)
        if (target < v) r = m
        else if (v < target) l = m
        else return m
    }
    return l
}

export function ratio(start: number, end: number, target: number, from: number, to: number) {
    const r = (target - start) / (end - start)
    return (to - from) * r + from
}
