
/* eslint-disable no-unused-expressions */

export function MergeListDistinct<T>(list1: T[], list2: T[], comparator: (a: T, b: T) => number) {
  const ret: T[] = []
  let p1 = 0, p2 = 0
  while (p1 < list1.length && p2 < list2.length) {
    const d = comparator(list1[p1], list2[p2])
    if (d < 0) {
      ret.push(list1[p1])
      p1++
    } else if (d > 0) {
      ret.push(list2[p2])
      p2++
    } else {
      ret.push(list1[p1])
      p1++
      p2++
    }
  }
  while (p1 < list1.length) {
    ret.push(list1[p1])
    p1++
  }
  while (p2 < list2.length) {
    ret.push(list2[p2])
    p2++
  }
  return ret
}

export function ThrottleFunc<TArgs extends any[], TThis>(func: (this: TThis, ...args: TArgs) => void, minms = 1000) {
  let lastTime = 0
  return function (this: TThis, ...args: TArgs) {
    const now = performance.now()
    if (now - lastTime >= minms) {
      lastTime = now
      func.call(this, ...args)
    }
  }
}

export function DebounceFunc<TArgs extends any[], TThis>(func: (this: TThis, ...args: TArgs) => void, minms = 1000) {
  let id = null as any
  return function (this: TThis, ...args: TArgs) {
    if (id !== null) {
      clearTimeout(id)
    }
    id = setTimeout(() => {
      id = null
      func.call(this, ...args)
    }, minms)
  }
}
