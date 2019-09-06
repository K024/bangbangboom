import * as Pixi from "pixi.js"
import { updateEvent } from "../../../globalEvents";
import { singleRingParticle } from "./singleRingParticle";
import { flickCircleParticle } from "./flickCircleParticle";
import { lightBaseParticle } from "./lightBaseParticle";

// tslint:disable-next-line: class-name
export class flickSpriteParticle extends Pixi.Container {
    shouldRemove: boolean = false

    constructor(lane: number) {
        super()
        this.addChild(new singleRingParticle(lane))
        this.addChild(new flickCircleParticle(lane))
        this.addChild(new lightBaseParticle(lane))

        updateEvent.add(this.update)
    }

    update = (dt: number) => {
        const removeChildren: Pixi.Container[] = []
        this.children.forEach((e, i) => {
            const n = e as singleRingParticle | lightBaseParticle | flickCircleParticle
            n.update(dt)
            if (n.shouldRemove)
                removeChildren.push(n)
        })
        this.removeChild(...removeChildren)

        if (this.children.length === 0) {
            this.shouldRemove = true;
        }
    }

    destroy() {
        super.destroy()
        updateEvent.remove(this.update)
    }
}
