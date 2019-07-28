
// tslint:disable: ban-types

/**
 * 清除抖动
 * Promise可能不会被resolve
 * @param ms 毫秒
 * @param func 函数（可能不会被调用）
 * @param _this 绑定this
 */
export function debounce<Args extends any[], Ret>(ms: number, func: (...args: Args) => Ret, _this: any = null)
    : (...a: Args) => Promise<Ret> {
    let handle = 0
    return function (...args: Args) {
        clearTimeout(handle);
        return new Promise(function (res, rej) {
            handle = setTimeout(() => {
                res(func.apply(_this, args));
            }, ms);
        })
    }
}

/**
 * 限制调用频率
 * @param ms 毫秒
 * @param func 函数（可能不会被调用）
 * @param _this 绑定this
 */
export function throttle<Args extends any[], Ret>(ms: number, func: (...a: Args) => Ret, _this: any = null)
    : (...a: Args) => Promise<Ret> {
    let lasttime = 0
    let handle = 0
    return function (...args: Args) {
        clearTimeout(handle);
        const interval = new Date().getTime() - lasttime;
        const timeout = ms - interval;
        if (timeout <= 0) {
            lasttime = new Date().getTime();
            return Promise.resolve(func.apply(_this, args))
        }
        return new Promise((res, rej) => {
            handle = setTimeout(() => {
                lasttime = new Date().getTime();
                res(func.apply(_this, args));
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
