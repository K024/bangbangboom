import * as Pixi from "pixi.js"
import { snowParticle } from "./snowParticle";
import { layerWidth, layerHeight } from "../../constants";
import { updateEvent } from "../../globalEvents";
import { GameEvent } from "../../utils/event";

export const loadingBgEvent = new GameEvent<[]>()

// 该类并没有被使用
// tslint:disable-next-line: class-name
export class loadingBg extends Pixi.Container {

    readonly snow: snowParticle[] = []

    readonly num = 200

    constructor() {
        super()
        for (let i = 0; i < this.num; i++) {
            const n = new snowParticle()
            n.x = Math.random() * layerWidth
            n.y = Math.random() * layerHeight
            this.snow.push(n)
            this.addChild(n)
        }
        updateEvent.add(this.update)
        loadingBgEvent.add(this.deleteUpdate)
    }

    update = () => {
        for (const n of this.snow) {
            const m = Math.random() * 2 * Math.PI
            n.x += 0.1 * Math.sin(m)
            n.y += m * 0.0001
            if (n.y > layerHeight)
                n.y = 0
            if (n.x > 0 || n.x < layerWidth) {
                n.x = Math.random() * layerWidth
            }
        }
    }

    deleteUpdate = () => {
        updateEvent.remove(this.update)
    }
}
