import * as Pixi from "pixi.js"
import { MainGame } from "../../../stages/mainStage";
import { lanePos_y, notes_x_collection } from "../../../constants";
import { particleTransTime } from "../particleLayer";

// tslint:disable-next-line: class-name
export class singleRingParticle extends Pixi.Container {

    // 在particleLayer里面删除 child 即 ringparticle

    // 1个圆环 不断变大 透明度减少

    // 增加colormatrix 从开始到结束 颜色由白色变为粉色 暂时未加


    // 外围大小从 0.8 到 2.5 
    readonly initScale = 0.8

    readonly finalScale = 2.5

    shouldRemove = false;

    readonly lane: number

    constructor(lane: number) {
        super()
        this.lane = lane
        this.init()
    }

    async init() {
        const loader = MainGame.loader

        const particleTexture = loader.resources['particles'].textures;

        const ring = new Pixi.Sprite(particleTexture["ring.png"])
        
        this.addChild(ring)
        this.scale.set(this.initScale,this.initScale/1.5)

        
        // 255 255 255
        // to  255 105 180
        const filter = new Pixi.filters.ColorMatrixFilter()
        filter.matrix = [255 / 255, 0, 0, 0, 0,
            0, 105 / 255, 0, 0, 0,
            0, 0, 180 / 255, 0, 0,
            0, 0, 0, 1, 0]
        this.filters = [filter]

        this.position.set(notes_x_collection[this.lane], lanePos_y)

    }

    update(dt: number) {
        let s = this.scale.x
        let a = this.alpha
        if (s < this.finalScale && a>0) {
            s += dt / particleTransTime * (this.finalScale-s) * 3 + 0.01
            a -= dt / particleTransTime * (1 - a) * 3 + 0.01
            if (s > this.finalScale) {
                s = 1
                this.shouldRemove = true
            }
            if (a < 0) {
                this.alpha = 0
                this.shouldRemove = true;
            }
            this.scale.set(s,s/1.5)
            this.alpha = a
        }
    }

}