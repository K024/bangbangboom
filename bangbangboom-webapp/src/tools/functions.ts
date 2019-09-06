
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

export function once<Args extends any[], Ret>(func: (...a: Args) => Ret) {
    let called = false
    return function (this: any, ...a: Args) {
        if (called) return
        called = true
        func.apply(this, a)
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

const listenermap = new Map<object, Set<(e: KeyboardEvent) => void>>()

export function addKeyDownListener(keycode: number, func: () => void, trackobj: object | null = null) {
    if (!trackobj) trackobj = func
    const listener = (e: KeyboardEvent) => {
        if (e.keyCode === keycode) func()
    }
    const list = listenermap.get(trackobj)
    if (list) {
        if (list.has(listener)) return
        list.add(listener)
    } else {
        listenermap.set(trackobj, new Set([listener]))
    }
    window.addEventListener("keydown", listener)
}

export function addKeyDownListenerEx(keycode: (e: KeyboardEvent) => boolean, func: () => void, trackobj: object | null = null) {
    if (!trackobj) trackobj = func
    const listener = (e: KeyboardEvent) => {
        if (keycode(e)) func()
    }
    const list = listenermap.get(trackobj)
    if (list) {
        if (list.has(listener)) return
        list.add(listener)
    } else {
        listenermap.set(trackobj, new Set([listener]))
    }
    window.addEventListener("keydown", listener)
}

export function removeKeyDownListeners(trackobj: object) {
    const list = listenermap.get(trackobj)
    if (list) {
        list.forEach(i => window.removeEventListener("keydown", i))
        list.clear()
    }
}

export function SecondToString(s: number) {
    function padZero(n: number, len: number) {
        const str = n.toString();
        if (str.length >= len) return str;
        return ("000000" + n).slice(-len);
    }
    s = Math.abs(s);
    const minutes = Math.floor(s / 60);
    s -= minutes * 60;
    const seconds = Math.floor(s);
    s -= seconds;
    const milis = Math.floor(s * 1000);
    return `${padZero(minutes, 2)}:${padZero(seconds, 2)}.${padZero(milis, 3)}`;
}

