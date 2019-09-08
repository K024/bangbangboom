import * as Pixi from "pixi.js"
import { zspeed, notes_x_collection, noteInitScale, farlineZ } from "../../../constants";
import { flick } from "../../../utils/gamemap";
import { projection } from "../../../utils/projection";
import { MainGame } from "../../../stages/mainStage";
import { flickSpriteParticle } from "../particle/flickSpriteParticle";
import { flickSoundEvent } from "../../../stages/soundEffect";
import { hitType, hitTypeEvent } from "../hitType";
import { hitParticalEvent } from "../particleLayer";


export class FlickSprite extends Pixi.Container {

    constructor(public info: flick) {
        super()
        const loader = MainGame.loader
        // tslint:disable-next-line: no-string-literal
        const note0Texture: any = loader.resources['note'].textures;
        this.top = new Pixi.Sprite(note0Texture["note_flick_top.png"])
        this.addChild(new Pixi.Sprite(note0Texture["note_flick_" + this.info.lane + ".png"]))
        this.addChild(this.top)
    }

    top: Pixi.Sprite

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

        this.updateTop(musicTime)
    }

    updateTop(musicTime: number) {
        this.top.y = Math.cos(musicTime * 10) * 30 - 30
    }


    perfect() {
        hitTypeEvent.emit(hitType.perfect)
        hitParticalEvent.emit(new flickSpriteParticle(this.info.lane))
        flickSoundEvent.emit()
        this.visible = false
        this.shouldRemove = true
    }
    great() {
        hitParticalEvent.emit(new flickSpriteParticle(this.info.lane))
        hitTypeEvent.emit(hitType.great)
        flickSoundEvent.emit()
        this.visible = false
        this.shouldRemove = true
    }
    bad() {
        hitTypeEvent.emit(hitType.bad)
        flickSoundEvent.emit()
        this.visible = false
        this.shouldRemove = true
    }
    miss() {
        hitTypeEvent.emit(hitType.miss)
        this.visible = false
        this.shouldRemove = true
    }
}
