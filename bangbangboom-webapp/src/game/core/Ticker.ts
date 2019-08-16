function Now() {
    if (performance)
        return performance.now()
    return Date.now()
}

export class Ticker {
    SkipFrame = 0;

    Tick = new Set<(delta: number, now: number) => void>()

    private lasttime = Now()

    private StopFlag = true
    private EndFlag = true

    Start() {
        if (!this.EndFlag) return;
        this.StopFlag = false

        let skipframecounter = 0
        const func = () => {
            this.EndFlag = false
            if (this.StopFlag) {
                this.EndFlag = true
                return
            }

            requestAnimationFrame(func)

            if (skipframecounter > 0) {
                skipframecounter--;
                return
            }
            skipframecounter = this.SkipFrame

            const now = Now()
            if (this.Tick)
                this.Tick.forEach(t => t(now - this.lasttime, now))

            this.lasttime = now
        }
        this.lasttime = Now()
        func()
    }

    Stop() {
        this.StopFlag = true
    }
}

export class MinTicker {

    Tick = new Set<(delta: number, now: number) => void>()

    private lasttime = Now()
    private interval = 0
    private started = false

    Start() {
        if (this.started) return
        this.started = true
        this.interval = setInterval(() => {
            const now = Now()
            this.Tick.forEach(t => t(now - this.lasttime, now))
            this.lasttime = now
        })
    }

    Stop() {
        clearInterval(this.interval)
        this.started = false
    }
}
