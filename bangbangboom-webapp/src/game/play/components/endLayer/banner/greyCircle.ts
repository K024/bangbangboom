
import * as Pixi from 'pixi.js'

// tslint:disable-next-line: class-name
export class greyCircle extends Pixi.Container {

    private readonly innerWidth: number = 8
    private readonly interval: number = 10
    constructor(width: number) {
        super()
        const n = Math.ceil(width / (this.innerWidth + this.interval))
        for (let i = 0; i < n; i++) {
            const circle = new Pixi.Graphics()
            circle.beginFill(0x666666, 1)
            circle.drawCircle(i * (this.innerWidth + this.interval), 0, this.innerWidth / 2)
            circle.endFill()
            this.addChild(circle)
        }
    }
}
