import * as Pixi from "pixi.js"
import { MainGame } from "../../../stages/mainStage";
import { lanePos_y, notes_x_collection } from "../../../constants";
import { particleTransTime } from "../particleLayer";

// tslint:disable-next-line: class-name
export class slideCircleParticle extends Pixi.Container {

    readonly spinSpeed = 1

    readonly spin1Scale = 1.0
    readonly spin2Scale = 1.2
    readonly ringScale = 1.1

    spin1: Pixi.Sprite

    spin2: Pixi.Sprite

    shouldRemove = false;
    constructor(x: number) {
        super()
        this.x = x
        this.y = lanePos_y
        this.init()
    }

    async init() {
        const loader = MainGame.loader

        const particleTexture = loader.resources['particles'].textures;

        const ringLong = new Pixi.Sprite(particleTexture["ring_long.png"])
        this.spin1 = new Pixi.Sprite(particleTexture["spin.png"])
        this.spin2 = new Pixi.Sprite(particleTexture["spin.png"])
        ringLong.scale.set(this.ringScale)
        ringLong.rotation += 3
        this.spin1.scale.set(this.spin1Scale)
        this.spin2.scale.set(this.spin2Scale)

        const filter = new Pixi.filters.ColorMatrixFilter()
        filter.matrix = [0 / 255, 0, 0, 0, 0,
            0, 255 / 255, 0, 0, 0,
            0, 0, 127 / 255, 0, 0,
            0, 0, 0, 1, 0]
        this.spin1.filters = [filter]
        this.spin2.filters = [filter]

        this.addChild(ringLong)
        this.addChild(this.spin1)
        this.addChild(this.spin2)
        this.scale.set(1.5, 1)
    }

    update(dt: number) {
        this.spin1.rotation += dt / particleTransTime * 1
        this.spin2.rotation -= dt / particleTransTime * 1
    }


}