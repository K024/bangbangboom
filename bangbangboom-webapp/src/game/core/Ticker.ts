
export class Ticker {
    SkipFrame = 0;

    private Now() {
        if (performance)
            return performance.now()
        return Date.now()
    }

    private lastd = 0
    get lastFrame() { return this.lastd }

    Tick = new Set<(delta: number, now: number) => void>()

    private lasttime = this.Now()

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

            const now = this.Now()
            this.lastd = now - this.lasttime
            if (this.Tick)
                this.Tick.forEach(t => t(this.lastd, now))

            this.lasttime = now
        }
        this.lasttime = this.Now()
        func()
    }

    Stop() {
        this.StopFlag = true
    }
}
