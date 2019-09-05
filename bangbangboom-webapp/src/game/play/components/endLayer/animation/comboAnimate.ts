import { updateEvent } from "../../../globalEvents";
import { MainGame } from "../../../stages/mainStage";
import * as Pixi from 'pixi.js'

export class comboAnimate extends Pixi.Container {

    shouldRemove = false

    firstTime = 2000

    private transTime: number = 1000    

    private time: number = 0
    //                       f  u    l    l    c    o    m      b    o
    private pos: number[] = [0, 110, 220, 310, 600, 710, 840, 960, 1070]
    constructor() {
        super()
        const loader = MainGame.loader

        const jsTexture = loader.resources['fullCombo'].textures

        const f = new Pixi.Sprite(jsTexture['FullCombo_F.png'])
        const u = new Pixi.Sprite(jsTexture['FullCombo_U.png'])
        const l1 = new Pixi.Sprite(jsTexture['FullCombo_L.png'])
        const l2 = new Pixi.Sprite(jsTexture['FullCombo_L.png'])
        const c = new Pixi.Sprite(jsTexture['FullCombo_C.png'])
        const o1 = new Pixi.Sprite(jsTexture['FullCombo_O.png'])
        const m = new Pixi.Sprite(jsTexture['FullCombo_M.png'])
        const b = new Pixi.Sprite(jsTexture['FullCombo_B.png'])
        const o2 = new Pixi.Sprite(jsTexture['FullCombo_O.png'])
        this.addChild(f)
        this.addChild(u)
        this.addChild(l1)
        this.addChild(l2)
        this.addChild(c)
        this.addChild(o1)
        this.addChild(m)
        this.addChild(b)
        this.addChild(o2)
        this.children.forEach((e, i) => {
            e.alpha = 0
            e.rotation = -0.25
            e.x = this.pos[i]
            e.y = -100
        })
        this.scale.set(0.7)

        updateEvent.add(this.update)
    }

    update = (dt: number) => {
        this.children.forEach((e, i) => {
            if (this.time < this.firstTime + i * 100) { }
            else {
                if (e.alpha === 1) { 
                    this.shouldRemove =true
                }
                else {
                    let a = e.alpha
                    let r = e.rotation
                    let y = e.y
                    a += (1 - a) * dt / this.transTime + 0.01
                    r += (0 - r) * dt / this.transTime + 0.01 * 0.25
                    y += (0 + 100) * dt / this.transTime + 1
                    if (a > 1 || r > 0 || y > 0) {
                        a = 1
                        r = 0
                        y = 0
                    }
                    e.alpha = a
                    e.rotation = r
                    e.y = y
                }
            }
        })
        this.time += dt
    }

    destroy = () => {
        super.destroy()
        updateEvent.remove(this.update)
    }
}

