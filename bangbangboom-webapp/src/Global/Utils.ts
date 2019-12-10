
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
      ret.push(list2[p1])
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

function padZero(n: number, len: number) {
  let str = n.toString()
  while (str.length < len) str = "0" + str
  return str
}

export function TimeToString(s: number) {
  s = Math.abs(s)
  const minutes = Math.floor(s / 60)
  s -= minutes * 60
  const seconds = Math.floor(s)
  s -= seconds
  const milis = Math.floor(s * 1000)
  return `${padZero(minutes, 2)}:${padZero(seconds, 2)}.${padZero(milis, 3)}`
}

export function MakeArray(end: number, start = 0, interval = 1) {
  const arr: number[] = []
  while (start < end) {
    arr.push(start)
    start += interval
  }
  return arr
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

export function selectFile(accept = "*", multiple = false) {
  return new Promise<File[]>((res, rej) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = accept
    input.multiple = multiple
    input.click()
    input.addEventListener("change", () => {
      if (input.files && input.files.length) {
        res(Array.from(input.files))
      }
    })
  })
}

export function readFile(file: File, encode = "UTF-8") {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader()
    reader.readAsText(file, encode)
    reader.onload = e => {
      if (e && e.target) {
        const content = (e.target as any).result as string
        res(content)
      }
    }
  })
}