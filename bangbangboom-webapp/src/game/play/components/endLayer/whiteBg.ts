import * as Pixi from "pixi.js"
import { layerWidth, layerHeight } from "../../constants";
import { totalScoreBanner } from "./banner/totalScoreBanner";
import { updateEvent } from "../../globalEvents";
import { hitTypeScore } from "./hitTypeScore";
import { greyCircle } from "./banner/greyCircle";

const lineTexture = Pixi.Texture.from((() => {
    const c = document.createElement("canvas")
    c.width = 500
    c.height = 2
    const ctx  = c.getContext("2d")
    const g = ctx.createLinearGradient(0,0,c.width,0)
    g.addColorStop(0, "rgba(0,0,0,0)")
    g.addColorStop(0.1, "rgba(0,0,0,1)")
    g.addColorStop(0.9, "rgba(0,0,0,1)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0,0,c.width,c.height)
    return c
})())


export const distance_numToType: number = 300
export class whiteBg extends Pixi.Container{

    bannerPosx = 25
    constructor(){
        super()

        const width = layerWidth * 0.62
        const height = layerHeight*0.55

        const rect = new Pixi.Graphics()
        rect.lineStyle(2,0x000000)
        rect.beginFill(0xFFFFFF)
        rect.drawRoundedRect(0,0,width,height,8)
        rect.endFill()
        

        const totalScore = new totalScoreBanner()
        totalScore.x = this.bannerPosx
        totalScore.y = 15

        const circles = new greyCircle( width * 0.95)
        circles.x = this.bannerPosx
        circles.y = 90

        const hitscore = new hitTypeScore()
        hitscore.x = this.bannerPosx
        hitscore.y = 130


        this.addChild(rect)
        this.addChild(totalScore)
        this.addChild(circles)
        this.addChild(hitscore)
    

        this.alpha = 0

        updateEvent.add(this.update)
    }

    update=(dt: number)=>{
        let a = this.alpha
        a += (1-a) * dt/1000 + 0.01
        if(a>1){
            a=1
            updateEvent.remove(this.update)
        }
        this.alpha = a
    }

    destroy(){
        super.destroy()
        updateEvent.remove(this.update)
    }
}
