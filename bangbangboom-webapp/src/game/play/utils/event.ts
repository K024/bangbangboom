
export class GameEvent<Args extends any[]> {
    private listeners = new Set<(...args: Args) => void>()

    constructor() {
        events.push(this)
    }

    prevArgs: Args = null as any as Args

    emit(...args: Args) {
        this.listeners.forEach(l => l(...args))
        this.prevArgs = args
    }

    add(listener: (...args: Args) => void) {
        this.listeners.add(listener)
    }

    remove(listener: (...args: Args) => void) {
        this.listeners.delete(listener)
    }

    clear() {
        this.listeners.clear();
    }
}

const events = [] as Array<GameEvent<any>>

export function ClearEvents() {
    for (const e of events) {
        if (e) e.clear()
    }
}



