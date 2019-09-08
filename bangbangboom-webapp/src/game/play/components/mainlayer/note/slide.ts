import * as Pixi from "pixi.js"
import { zspeed, notes_x_collection, noteInitScale, halfNoteWidth, farlineZ, barOpacity } from "../../../constants";
import { slide } from "../../../utils/gamemap";
import { projection, ratio } from "../../../utils/projection";
import { MainGame } from "../../../stages/mainStage";
import { singleSpriteParticle } from "../particle/singleSpriteParticle";
import { holdSlide, hitParticalEvent } from "../particleLayer";
import { perfectSoundEvent, greatSoundEvent, badSoundEvent, flickSoundEvent } from "../../../stages/soundEffect";
import { hitType, hitTypeEvent } from "../hitType";
import { FlickSprite } from './flick';
import { flickSpriteParticle } from '../particle/flickSpriteParticle';


export class SlideSprite extends Pixi.Container {

    constructor(public info: slide) {
        super()

        const loader = MainGame.loader
        this.addChild(this.barlayer)
        // tslint:disable-next-line: no-string-literal
        const note0Texture: any = loader.resources['note'].textures;
        this.info.notes.forEach((n, i) => {
            let s: Pixi.Container
            if (i === 0) {
                s = new Pixi.Sprite(note0Texture["note_long_" + n.lane + ".png"])
            } else if (i === this.info.notes.length - 1) {
                if (info.flickend)
                    s = new FlickSprite({ type: "flick", time: 0, lane: 0, })
                else
                    s = new Pixi.Sprite(note0Texture["note_long_" + n.lane + ".png"])
            } else {
                s = new Pixi.Sprite(note0Texture["note_slide_among.png"])
            }
            this.notes.push(s)
            this.addChild(s)
        })
    }

    // 从private 改为 public
    notes: Pixi.Container[] = []

    private barlayer = new Pixi.Container()

    shouldRemove = false

    holding = false

    lastnoteindex = 0

    update(musicTime: number) {

        const zlist = this.info.notes.map(n => {
            const dt = n.time - musicTime
            const z = dt * zspeed
            return z
        })
        if (zlist[zlist.length - 1] <= -1) {
            this.shouldRemove = true
            this.visible = false
            return
        }
        if (this.shouldRemove) return

        this.visible = true
        this.notes.forEach(n => n.visible = false)

        let i = 0
        let lastP = { x: 0, y: 0, scale: 0 }
        let lastX = 0
        let lastZ = 0

        // for test
        // if (zlist[0] < 0) this.holding = true

        if (this.holding) {
            while (i < zlist.length && zlist[i] < 0)
                i++;

            if (i >= zlist.length) {
                i--;
                lastZ = zlist[i]
                lastX = notes_x_collection[this.info.notes[i].lane]
                lastP = projection(lastZ, lastX)

                this.notes[i].scale.set(lastP.scale * noteInitScale)
                this.notes[i].x = lastP.x
                this.notes[i].y = lastP.y
                if (lastZ < farlineZ)
                    this.notes[i].visible = true;
                i++;

            } else {
                if (i === 0) i = 1;
                lastZ = zlist[i - 1]
                lastX = notes_x_collection[this.info.notes[i - 1].lane]
                const nextZ = zlist[i]
                const nextX = notes_x_collection[this.info.notes[i].lane]

                lastX = ratio(lastZ, nextZ, 0, lastX, nextX)
                lastZ = 0

                lastP = projection(lastZ, lastX)
                this.notes[0].scale.set(noteInitScale * lastP.scale)
                this.notes[0].x = lastP.x
                this.notes[0].y = lastP.y
                if (lastZ < farlineZ)
                    this.notes[0].visible = true;
            }
            if (this.slideCircle)
                this.slideCircle.move(lastX)

        } else {
            while (i < zlist.length && zlist[i] < -1)
                i++;

            i = Math.max(i, this.lastnoteindex)

            lastZ = zlist[i]
            lastX = notes_x_collection[this.info.notes[i].lane]
            lastP = projection(lastZ, lastX)

            this.notes[i].scale.set(lastP.scale * noteInitScale)
            this.notes[i].x = lastP.x
            this.notes[i].y = lastP.y
            if (lastZ < farlineZ)
                this.notes[i].visible = true;

            i++
        }

        this.barlayer.removeChildren()

        while (i < zlist.length && zlist[i] < farlineZ) {
            const nextZ = zlist[i]
            const nextX = notes_x_collection[this.info.notes[i].lane]
            const nextP = projection(nextZ, nextX)

            const bar = SlideSprite.getBar(lastP, nextP)
            this.barlayer.addChild(bar)

            this.notes[i].scale.set(noteInitScale * nextP.scale)
            this.notes[i].x = nextP.x
            this.notes[i].y = nextP.y
            this.notes[i].visible = true;

            lastP = nextP
            lastX = nextX
            lastZ = nextZ
            i++
        }

        if (i < zlist.length) {
            let nextZ = zlist[i]
            let nextX = notes_x_collection[this.info.notes[i].lane]

            nextX = ratio(lastZ, nextZ, farlineZ, lastX, nextX)
            nextZ = farlineZ
            const nextP = projection(nextZ, nextX)
            const bar = SlideSprite.getBar(lastP, nextP)
            this.barlayer.addChild(bar)
        }


        const endn = this.notes[this.notes.length - 1]
        if (endn instanceof FlickSprite) {
            endn.updateTop(musicTime)
        }
    }

    static getBar(p1: { x: number, y: number, scale: number }, p2: { x: number, y: number, scale: number }) {
        const bar = new Pixi.Graphics()
        const barfactor = 1.3;
        bar.lineStyle(1, 0x4DFF2F, 0.6);
        bar.beginFill(0x4DFF2F, 0.4);
        bar.moveTo(p1.x - halfNoteWidth * p1.scale * noteInitScale * barfactor, p1.y)
        bar.lineTo(p1.x + halfNoteWidth * p1.scale * noteInitScale * barfactor, p1.y)
        bar.lineTo(p2.x + halfNoteWidth * p2.scale * noteInitScale * barfactor, p2.y)
        bar.lineTo(p2.x - halfNoteWidth * p2.scale * noteInitScale * barfactor, p2.y)
        bar.closePath()
        bar.endFill()
        bar.alpha = barOpacity;
        return bar
    }


    perfect(n: number) {
        hitTypeEvent.emit(hitType.perfect)
        if (n === this.info.notes.length - 1 && this.info.flickend) {
            hitParticalEvent.emit(new flickSpriteParticle(this.info.notes[n].lane))
            flickSoundEvent.emit()
        } else {
            hitParticalEvent.emit(new singleSpriteParticle(this.info.notes[n].lane))
            perfectSoundEvent.emit()
        }
        this.setHolding(true, notes_x_collection[this.info.notes[n].lane])
        if (n === this.info.notes.length - 1) {
            this.visible = false
            this.shouldRemove = true
            this.setHolding(false, 0)
        }
    }
    great(n: number) {
        hitTypeEvent.emit(hitType.great)
        greatSoundEvent.emit()
        hitParticalEvent.emit(new singleSpriteParticle(this.info.notes[n].lane))
        this.setHolding(true, notes_x_collection[this.info.notes[n].lane])
        if (n === this.info.notes.length - 1) {
            this.visible = false
            this.shouldRemove = true
            this.setHolding(false, 0)
        }
    }
    bad(n: number) {
        hitTypeEvent.emit(hitType.bad)
        badSoundEvent.emit()
        this.setHolding(true, notes_x_collection[this.info.notes[n].lane])
        if (n === this.info.notes.length - 1) {
            this.visible = false
            this.shouldRemove = true
            this.setHolding(false, 0)
        }
    }
    miss(n: number) {
        hitTypeEvent.emit(hitType.miss)
        this.lastnoteindex = n + 1
        this.setHolding(false, 0)
        if (n === this.info.notes.length - 1) {
            this.visible = false
            this.shouldRemove = true
        }
    }

    slideCircle: { move(x: number): void, miss(): void } | null = null

    setHolding(holding: boolean, x: number) {
        if (holding && !this.holding) {
            this.slideCircle = holdSlide(x)
            this.holding = true
        } else if (!holding && this.holding) {
            if (this.slideCircle) this.slideCircle.miss()
            this.holding = false
        }
    }
}
