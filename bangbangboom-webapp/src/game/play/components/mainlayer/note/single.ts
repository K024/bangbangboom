import * as Pixi from "pixi.js"
import { zspeed, notes_x_collection, noteInitScale, farlineZ } from "../../../constants";
import { single } from "../../../utils/gamemap";
import { projection } from "../../../utils/projection";
import { MainGame } from "../../../stages/mainStage";
import { singleSpriteParticle } from "../particle/singleSpriteParticle";
import { perfectSoundEvent, greatSoundEvent, badSoundEvent } from "../../../stages/soundEffect";
import { hitType, hitTypeEvent } from "../hitType";
import { hitParticalEvent } from "../particleLayer";


export class SingleSprite extends Pixi.Container {

    constructor(public info: single) {
        super()

        const loader = MainGame.loader
        // tslint:disable-next-line: no-string-literal
        const note0Texture: any = loader.resources['note'].textures;

        if (this.info.onbeat) {
            this.addChild(new Pixi.Sprite(note0Texture["note_normal_" + this.info.lane + ".png"]))
        } else {
            this.addChild(new Pixi.Sprite(note0Texture["note_normal_gray_" + this.info.lane + ".png"]))
        }
    }

    shouldRemove = false

    update(musicTime: number) {
        const dt = this.info.time - musicTime
        const z = dt * zspeed
        if (z <= -1) {
            this.shouldRemove = true
            this.visible = false
            return
        } else if (z > farlineZ) {
            this.visible = false
        } else {
            this.visible = true
        }
        const p = projection(z, notes_x_collection[this.info.lane])
        this.scale.set(p.scale * noteInitScale)
        this.position.set(p.x, p.y)
    }


    perfect() {
        hitTypeEvent.emit(hitType.perfect)
        hitParticalEvent.emit(new singleSpriteParticle(this.info.lane))
        perfectSoundEvent.emit()
        this.visible = false
        this.shouldRemove = true
    }
    great() {
        hitTypeEvent.emit(hitType.great)
        hitParticalEvent.emit(new singleSpriteParticle(this.info.lane))
        greatSoundEvent.emit()
        this.visible = false
        this.shouldRemove = true
    }
    bad() {
        hitTypeEvent.emit(hitType.bad)
        badSoundEvent.emit()
        this.visible = false
        this.shouldRemove = true
    }
    miss() {
        hitTypeEvent.emit(hitType.miss)
        this.visible = false
        this.shouldRemove = true
    }

}
