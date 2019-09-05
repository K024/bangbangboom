import * as Pixi from "pixi.js"
import { MainGame } from "../../../stages/mainStage";
import { lanePos_y, notes_x_collection } from "../../../constants";
import { particleTransTime } from "../particleLayer";

// tslint:disable-next-line: class-name
export class flickCircleParticle extends Pixi.Container {

    // 在particleLayer里面删除 child 即 ringparticle

    // 2个实心圆 一个固定大小，白色，透明度减少
    // 一个纵向伸长，粉色 透明度减少

    // 增加colormatrix 从开始到结束 颜色由白色变为粉色 暂时未加


    readonly initScale = 0.5

    readonly finalScale = 8

    shouldRemove = false;

    readonly lane: number

    private circleBelow: Pixi.Sprite

    constructor(lane: number) {
        super()
        this.lane = lane
        this.init()
    }

    async init() {
        const loader = MainGame.loader

        const particleTexture = loader.resources['particles'].textures;

        const circle1 = new Pixi.Sprite(particleTexture["circle.png"])
        this.circleBelow = new Pixi.Sprite(particleTexture["circle.png"])
        circle1.scale.set(this.initScale)
        this.circleBelow.scale.set(this.initScale)

        // 255 255 255
        // to  255 105 180
        const filter = new Pixi.filters.ColorMatrixFilter()
        filter.matrix = [255 / 255, 0, 0, 0, 0,
            0, 105 / 255, 0, 0, 0,
            0, 0, 180 / 255, 0, 0,
            0, 0, 0, 1, 0]
        this.circleBelow.filters = [filter]

        this.addChild(circle1)
        this.addChild(this.circleBelow)

        this.position.set(notes_x_collection[this.lane],lanePos_y)

    }

    update(dt: number) {
        let s = this.circleBelow.scale.y
        let a = this.alpha
        if (s < this.finalScale && a>0) {
            s += dt / particleTransTime * (this.finalScale - this.initScale)
            a -= dt / particleTransTime
            if (s > this.finalScale) {
                s = this.finalScale
                this.shouldRemove = true
            }
            if (a < 0) {
                a = 0
                this.shouldRemove = true;
            }
            this.circleBelow.scale.y=s
            this.alpha = a

        }
    }

}