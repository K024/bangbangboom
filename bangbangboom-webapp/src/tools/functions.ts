
/**
 * 清除抖动
 * Promise可能不会被resolve
 * @param ms 毫秒
 * @param func 函数（可能不会被调用）
 */
export function debounce<Args extends any[], Ret>(ms: number, func: (...args: Args) => Ret)
    : (...a: Args) => Promise<Ret> {
    let handle = 0
    return function (this: any, ...args: Args) {
        clearTimeout(handle);
        const that = this
        return new Promise(function (res, rej) {
            handle = setTimeout(() => {
                res(func.apply(that, args));
            }, ms);
        })
    }
}

/**
 * 限制调用频率
 * @param ms 毫秒
 * @param func 函数（可能不会被调用）
 */
export function throttle<Args extends any[], Ret>(ms: number, func: (...a: Args) => Ret)
    : (...a: Args) => Promise<Ret> {
    let lasttime = 0
    let handle = 0
    return function (this: any, ...args: Args) {
        clearTimeout(handle);
        const that = this
        const interval = new Date().getTime() - lasttime;
        const timeout = ms - interval;
        if (timeout <= 0) {
            lasttime = new Date().getTime();
            return Promise.resolve(func.apply(that, args))
        }
        return new Promise((res, rej) => {
            handle = setTimeout(() => {
                lasttime = new Date().getTime();
                res(func.apply(that, args));
            }, timeout);
        })
    }
}

/**
 * 延迟
 * @param ms 毫秒数
 */
export function delay(ms: number) {
    return new Promise((res, rej) => {
        setTimeout(() => res(), ms)
    })
}

export function lazyObject<Keys extends keyof any, Values>(obj: { [K in Keys]: () => Values }): Readonly<{ [K in Keys]: Values }> {
    const o: any = {}
    for (const key in obj) {
        let value: any = null
        Object.defineProperty(o, key, {
            get() {
                if (value === null) {
                    value = obj[key]()
                }
                return value
            }
        })
    }
    return o
}

const listenermap = new Map<object, Array<(e: KeyboardEvent) => void>>()

export function addKeyDownListener(keycode: number, func: () => void, trackobj: object | null = null) {
    if (!trackobj) trackobj = func
    const listener = (e: KeyboardEvent) => {
        if (e.keyCode === keycode) func()
    }
    window.addEventListener("keydown", listener)
    const list = listenermap.get(trackobj)
    if (list) list.push(listener)
    else listenermap.set(trackobj, [listener])
}

export function addKeyDownListenerEx(keycode: (e: KeyboardEvent) => boolean, func: () => void, trackobj: object | null = null) {
    if (!trackobj) trackobj = func
    const listener = (e: KeyboardEvent) => {
        if (keycode(e)) func()
    }
    window.addEventListener("keydown", listener)
    const list = listenermap.get(trackobj)
    if (list) list.push(listener)
    else listenermap.set(trackobj, [listener])
}

export function removeKeyDownListeners(trackobj: object) {
    const list = listenermap.get(trackobj)
    if (list) {
        list.forEach(i => window.removeEventListener("keydown", i))
    }
}
