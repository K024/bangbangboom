
export class GameEvent<Args extends any[]> {
    private listeners = new Set<(...args: Args) => void>()

    prevArgs: Args = null

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
}

