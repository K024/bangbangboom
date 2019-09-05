import { MainGame } from "../../../stages/mainStage";
import { updateEvent } from "../../../globalEvents";
import * as Pixi from 'pixi.js'
import { firstTime, stayTime, secondTime } from "../fullComboAnimate";


export class starAnimate extends Pixi.Container {


    readonly star: Pixi.Sprite
    readonly initsScale = 0.4

    readonly secondScale = 2

    readonly lastScale = 1

    shouldRemove = false

    posX = 500
    posY = 90

    time = 0

    rollTime = 500

    constructor() {
        super()
        const loader = MainGame.loader
        const jsTexture = loader.resources['fullCombo'].textures

        this.star = new Pixi.Sprite(jsTexture['FullCombo_star.png'])
        this.star.alpha = 0
        this.star.scale.set(this.initsScale)
        this.addChild(this.star)

        updateEvent.add(this.update)
    }

    update = (dt: number) => {
        this.star.rotation += dt / this.rollTime
        if (this.time < firstTime) {
            let a = this.star.alpha
            let scale = this.star.scale.x
            a += (1 - a) * dt / firstTime + 0.01
            scale += (this.secondScale - scale) * dt / firstTime + 0.03
            if (a > 1 || scale > this.secondScale) {
                a = 1
                scale = this.secondScale
            }
            this.star.alpha = a
            this.star.scale.set(scale)
        }
        else if (this.time < stayTime) {
            this.star.alpha = 1
            this.star.scale.set(this.secondScale)
        }
        else {
            this.star.alpha = 1
            let scale = this.star.scale.x
            scale -= (scale - this.lastScale) * dt / (secondTime - stayTime) + (this.secondScale - this.lastScale) / 100
            let x = this.star.x
            let y = this.star.y
            x += (this.posX - x) * (dt) / (secondTime - stayTime) + this.posX / 100
            y += (this.posY - y) * (dt) / (secondTime - stayTime) + this.posY / 100
            if (x > this.posX || y > this.posY) {
                x = this.posX
                y = this.posY
            }
            if (scale < this.lastScale) {
                scale = this.lastScale
            }
            this.star.x = x
            this.star.y = y
            this.star.scale.set(scale)
        }

        if (this.time > secondTime)
            this.shouldRemove = true

        this.time += dt
    }

    destroy() {
        super.destroy()
        updateEvent.remove(this.update)
    }
}

