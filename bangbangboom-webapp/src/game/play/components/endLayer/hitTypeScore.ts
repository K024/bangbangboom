import * as Pixi from 'pixi.js'
import { perfectBanner } from './banner/perfectBanner';
import { greatBanner } from './banner/greatBanner';
import { badBanner } from './banner/badBanner';
import { missBanner } from './banner/missBanner';
import { maxComboBanner } from './banner/maxComboBanner';
import { isFullCombo } from '../../stages/hitScore';
import { fullComboBanner } from './banner/fullComboBanner';

const lineTexture = Pixi.Texture.from((() => {
    const c = document.createElement("canvas")
    c.width = 420
    c.height = 2
    const ctx = c.getContext("2d")
    const g = ctx.createLinearGradient(0, 0, c.width, 0)
    g.addColorStop(0, "rgba(0,0,0,0)")
    g.addColorStop(0.1, "rgba(0,0,0,1)")
    g.addColorStop(0.9, "rgba(0,0,0,1)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, c.width, c.height)
    return c
})())

export class hitTypeScore extends Pixi.Container {

    bannerPosY: number[] = []
    constructor() {
        super()

        for (let i = 0; i < 4; i++) {
            this.bannerPosY.push(65 * i)
        }

        const perfect = new perfectBanner()
        perfect.y = this.bannerPosY[0]
        const line1 = new Pixi.Sprite(lineTexture)
        line1.y = this.bannerPosY[1] - 10

        const great = new greatBanner()
        great.y = this.bannerPosY[1]
        const line2 = new Pixi.Sprite(lineTexture)
        line2.y = this.bannerPosY[2] - 10
        const bad = new badBanner()
        bad.y = this.bannerPosY[2]
        const line3 = new Pixi.Sprite(lineTexture)
        line3.y = this.bannerPosY[3] - 10
        const miss = new missBanner()
        miss.y = this.bannerPosY[3]
        const maxcombo = new maxComboBanner()
        maxcombo.x = 510
        maxcombo.y = (this.bannerPosY[1] - this.bannerPosY[0]) * 0.25 + this.bannerPosY[0]

        this.addChild(perfect)
        this.addChild(line1)
        this.addChild(great)
        this.addChild(line2)
        this.addChild(bad)
        this.addChild(line3)
        this.addChild(miss)
        this.addChild(maxcombo)

        if(isFullCombo){
            const fullcombo = new fullComboBanner()
            fullcombo.x = 480
            fullcombo.y = this.bannerPosY[3]
            this.addChild(fullcombo)
        }
    }
}
