import * as Pixi from "pixi.js"
import { MainGame } from "../../../stages/mainStage";
import { lanePos_y, notes_x_collection } from "../../../constants";
import { particleTransTime } from "../particleLayer";

// tslint:disable-next-line: class-name
export class doubleRingParticle extends Pixi.Container {

    // 在particleLayer里面删除 child 即 ringparticle

    // 两个圆环 不断变大 透明度减少

    // 增加colormatrix 从开始到结束 颜色由白色变为蓝色 暂时未加


    // 外围大小从 0.8 到 2.5 
    readonly initScale = 0.8

    readonly finalScale = 2.5

    readonly initScale1 = 1
    readonly initScale2 = 0.8

    readonly lane: number

    shouldRemove = false;

    constructor(lane: number) {
        super()
        this.lane = lane;
        this.init()
    }

    async init() {
        const loader = MainGame.loader

        // tslint:disable-next-line: no-string-literal
        const particleTexture = loader.resources['particles'].textures;

        if (!particleTexture) throw new Error("texture null")
        const ring1 = new Pixi.Sprite(particleTexture["ring.png"])
        const ring2 = new Pixi.Sprite(particleTexture["ring.png"])
        ring1.scale.set(this.initScale1)
        ring2.scale.set(this.initScale2)
        this.addChild(ring1)
        this.addChild(ring2)
        this.scale.set(this.initScale, this.initScale / 1.5)



        this.position.set(notes_x_collection[this.lane], lanePos_y)


    }

    update(dt: number) {
        let s = this.scale.x
        let a = this.alpha
        if (s < this.finalScale && a > 0) {
            s += dt / particleTransTime * (this.finalScale - s) * 3 + 0.01
            a -= dt / particleTransTime * (1 - a) * 3 + 0.01
            if (s > this.finalScale) {
                s = 1
                this.shouldRemove = true
            }
            if (a < 0) {
                this.alpha = 0
                this.shouldRemove = true;
            }
            this.scale.set(s, s / 1.5)
            this.alpha = a
        }
    }
}
