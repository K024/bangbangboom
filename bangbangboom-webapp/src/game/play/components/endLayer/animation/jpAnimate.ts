import { MainGame } from "../../../stages/mainStage";
import { updateEvent } from "../../../globalEvents";
import * as Pixi from 'pixi.js'
import { stayTime, secondTime } from "../fullComboAnimate";

export class jpAnimate extends Pixi.Container {

    shouldRemove = false

    time = 0

    constructor() {
        super()

        const loader = MainGame.loader

        const jsTexture = loader.resources['fullCombo'].textures

        const internal = 30

        const fu = new Pixi.Sprite(jsTexture['FullCombo_fu.png'])
        const ru = new Pixi.Sprite(jsTexture['FullCombo_ru.png'])
        const ko = new Pixi.Sprite(jsTexture['FullCombo_ko.png'])
        const un = new Pixi.Sprite(jsTexture['FullCombo_un.png'])
        const bo = new Pixi.Sprite(jsTexture['FullCombo_bo.png'])
        const thunder = new Pixi.Sprite(jsTexture['FullCombo_thunder.png'])
        thunder.scale.set(0.8)

        ru.x = internal
        ko.x = internal * 2
        un.x = internal * 3
        bo.x = internal * 4

        thunder.x = 190
        thunder.y = -80

        this.addChild(fu)
        this.addChild(ru)
        this.addChild(ko)
        this.addChild(un)
        this.addChild(bo)
        this.addChild(thunder)

        this.children.forEach(e => {
            e.alpha = 0
        })

        updateEvent.add(this.update)
    }

    update = (dt: number) => {
        this.children.forEach(e => {
            if (this.time < stayTime) { }
            else {
                let a = e.alpha
                a += (1 - a) * dt / (secondTime - stayTime) + 0.01
                if (a > 1) {
                    a = 1
                    this.shouldRemove = true
                    updateEvent.remove(this.update)
                }
                e.alpha = a
            }

        })

        this.time += dt

    }

    destroy() {
        super.destroy()
        updateEvent.remove(this.update)
    }
}

