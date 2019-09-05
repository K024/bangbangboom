import * as Pixi from 'pixi.js'
import { MainGame } from '../../../stages/mainStage';
import { updateEvent } from '../../../globalEvents';


// 暂时不做颜色
export class hanabi extends Pixi.Container {


    // 是个星星 随机向四周扩展
    angx: number[] = []
    angy: number[] = []

    stars: Pixi.Sprite[] = []
    speed: number = 1

    dis: number = 300

    nowDis: number = 0

    coef: number = 2.5

    initScale = 2
    finalScale = 0.4

    initAlpha = 0.8
    // constructor(matrix: number[]) {
    constructor() {
        super()

        const loader = MainGame.loader
        const jsTexture = loader.resources['fullCombo'].textures
        // const filter = new Pixi.filters.ColorMatrixFilter()
        // filter.matrix = matrix

        for (let i = 0; i < 15; i++) {
            const n = Math.random()
            this.angx.push(Math.cos(n * Math.PI * 2))
            this.angy.push(Math.sin(n * Math.PI * 2))
            const star = new Pixi.Sprite(jsTexture['FullCombo_star.png'])
            star.scale.set(this.initScale)
            star.alpha=this.initAlpha
            // star.filters = [filter]
            this.stars.push(star)
            this.addChild(star)
        }

        updateEvent.add(this.update)

    }

    update = (dt: number) => {
        let a = this.stars[0].alpha
        a -= (this.initAlpha - a) * dt / 500 + 0.01
        if (a > 0) {
            if (this.nowDis < this.dis) {
                this.stars.forEach((e, i) => {
                    e.x += dt / 1000 * this.angx[i] * this.speed * (this.dis - this.nowDis) * this.coef
                    e.y += dt / 1000 * this.angy[i] * this.speed * (this.dis - this.nowDis) * this.coef
                    let sx = e.scale.x
                    sx -= (sx - this.finalScale) * dt / 500 + 0.01
                    if (sx < this.finalScale)
                        sx = this.finalScale
                    e.scale.set(sx)
                })
                this.nowDis += dt / 1000 * this.speed
            }

        }
        else {
            a = 0
        }
        this.stars.forEach(e => {
            e.alpha = a
        })
        if (a === 0) {
            updateEvent.remove(this.update)
        }
    }
}
