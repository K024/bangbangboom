import * as Pixi from "pixi.js"
import { doubleRingParticle } from "./doubleRingParticle";
import { lightBaseParticle } from "./lightBaseParticle";
import { updateEvent } from "../../../globalEvents";
import { lightNormalParticle } from "./lightNormalParticle";

export class singleSpriteParticle extends Pixi.Container {


    shouldRemove: boolean = false

    constructor(lane: number) {
        super()
        this.addChild(new doubleRingParticle(lane))
        this.addChild(new lightBaseParticle(lane))
        this.addChild(new lightNormalParticle(lane))

        updateEvent.add(this.update)

        
        // 255 255 255
        // to 160 200 255
        const filter = new Pixi.filters.ColorMatrixFilter()
        filter.matrix = [200 / 255, 0, 0, 0, 0,
            0, 255 / 255, 0, 0, 0,
            0, 0, 255 / 255, 0, 0,
            0, 0, 0, 1, 0]
        this.filters = [filter]
    }

    update = (dt: number) => {
        const removeChildren: Pixi.Container[] = []
        this.children.forEach((e, i) => {
            const n = e as doubleRingParticle | lightBaseParticle | lightNormalParticle
            n.update(dt)
            if (n.shouldRemove)
                removeChildren.push(n)
        })
        this.removeChild(...removeChildren)

        if (this.children.length == 0) {
            this.shouldRemove = true;
        }
    }

    destroy(){
        super.destroy()
        updateEvent.remove(this.update)
    }

}