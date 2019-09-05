import * as Pixi from "pixi.js"
import { MainGame } from "../../../stages/mainStage";
import { lanePos_y, notes_x_collection } from "../../../constants";
import { particleTransTime } from "../particleLayer";

// tslint:disable-next-line: class-name
export class lightNormalParticle extends Pixi.Container {

    // 轨道发亮
    // 需要 colormatrix 来判断发光的类型 蓝 白 粉 绿？

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
        this.addChild(new Pixi.Sprite(particleTexture["light_normal.png"]))

        this.position.set(notes_x_collection[this.lane],lanePos_y)

    }

    update(t: number) {
        let a = this.alpha
        if (a > 0) {
            a -= t / particleTransTime
            if (a < 0) {
                this.alpha = 0
                this.shouldRemove = true
            }
            this.alpha = a
        }
    }
}