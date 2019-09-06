import * as Pixi from "pixi.js"

// tslint:disable-next-line: class-name
export class snowParticle extends Pixi.Container {

    constructor() {
        super()
        const g = new Pixi.Graphics()
        g.beginFill(0xF0F0F0, 0.9)
        g.drawCircle(0, 0, 10 * (Math.random() * 0.4 + 0.3))
        g.endFill()
        this.addChild(g)
    }
}
