import * as Pixi from "pixi.js"
import { layerWidth, layerHeight, linePos_x_collection, lanePos_y } from "../../constants";
import interactionEvent = Pixi.interaction.InteractionEvent
import { rawPointerEvent } from "../../globalEvents";
import { intereactEvent } from "../../stages/judger";


const dw = linePos_x_collection[1] - linePos_x_collection[0]
const rectangleWidth = dw * 7.4;
const rectangleHeight = layerHeight;

export class intereactionSprite extends Pixi.Container {

    private rect: Pixi.Container

    constructor() {
        super()

        const r = new Pixi.Graphics();
        r.lineStyle(1, 0xFF3300, 1);
        r.beginFill(0, 0);
        r.drawRect(0, 0, rectangleWidth, rectangleHeight);
        r.endFill();

        r.x = linePos_x_collection[0] - dw * 0.2
        r.y = layerHeight / 2
        r.alpha = 0

        this.addChild(r)
        this.rect = r

        rawPointerEvent.add(this.handler)
    }

    handler = (e: PointerEvent) => {
        const p = this.rect.toLocal(new Pixi.Point(e.x, e.y))
        let l = Math.floor((p.x - 0.2 * dw) / dw)
        if (!this.rect.getLocalBounds().contains(p.x, p.y)) l = -10
        else if (l === -1) l = 0
        else if (l === 7) l = 6

        intereactEvent.emit(e.pointerId, e.type, l, p)
    }

    destroy() {
        super.destroy()

        rawPointerEvent.remove(this.handler)
    }
}
