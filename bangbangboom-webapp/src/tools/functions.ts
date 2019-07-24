
export function debounce(ms: number, func: (...params: any[]) => void, _this: any = null) {
    let handle = 0
    return function (...args: any[]) {
        clearTimeout(handle)
        handle = setTimeout(() => {
            func.apply(_this, args)
        }, ms)
    }
}

export function throttle(ms: number, func: (...params: any[]) => void, _this: any = null) {
    let lasttime = 0
    let handle = 0
    const thr = function (...args: any[]) {
        const interval = new Date().getTime() - lasttime
        const timeout = interval >= ms ? 0 : ms - interval
        clearTimeout(handle)
        handle = setTimeout(() => {
            lasttime = new Date().getTime()
            func.apply(_this, args)
        }, timeout)
    }
    return thr
}

export function delay(ms: number) {
    const prom = new Promise((res, rej) => {
        setTimeout(() => res(), ms)
    })
    return prom
}
