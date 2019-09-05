import { MainGame } from "../../../stages/mainStage";
import { scoreNumber, scoreNumType } from "./scoreNumber";
import { maxCombo } from "../../../stages/hitScore";
import { distance_numToType } from "../whiteBg";
import * as Pixi from 'pixi.js'


export class maxComboBanner extends Pixi.Container {

    private readonly reacWidth: number = 180
    private readonly blackReacHeight: number = 100
    private readonly whiteReacHeight: number = 60

    constructor() {
        super()

        const lw = 5
        // 最外侧的 方形
        const blackLineRec = new Pixi.Graphics()
        blackLineRec.lineStyle(lw, 0x111111)
        blackLineRec.beginFill(0xFFFFFF, 1)
        blackLineRec.drawRoundedRect(0, 0, this.reacWidth, this.blackReacHeight + this.whiteReacHeight, 8)
        blackLineRec.endFill()

        // 上侧的方形
        const blackRec = new Pixi.Graphics()
        blackRec.beginFill(0x111111, 1)
        blackRec.drawRoundedRect(0, 0, this.reacWidth, this.blackReacHeight, 8)
        blackRec.endFill()

        // 中间遮住圆角的线
        const blackLine = new Pixi.Graphics()
        blackLine.lineStyle(10, 0x111111)
        blackLine.moveTo(0, this.blackReacHeight - lw/2 )
        blackLine.lineTo(this.reacWidth, this.blackReacHeight - lw/2 )

        const style = new Pixi.TextStyle({
            fontSize: 30,
            fontFamily:"Saira",
            fontWeight: 'bold',
            fill: ['#FFFFFF', '#FFFFFF']
        })

        const max = new Pixi.Text("MAX", style)
        const combo = new Pixi.Text("COMBO", style)
        max.anchor.set(0.5,0.5)
        combo.anchor.set(0.5,0.5)
        const num = new scoreNumber(maxCombo, scoreNumType.normalGrey)

        max.x = this.reacWidth / 2
        combo.x = this.reacWidth / 2
        num.x = this.reacWidth / 2 - num.width/2
        max.y = this.blackReacHeight * 0.35
        combo.y = this.blackReacHeight * 0.65
        num.y = this.blackReacHeight + this.whiteReacHeight * 0.5 -num.height/2

        this.addChild(blackLineRec)
        this.addChild(blackRec)
        this.addChild(blackLine)
        this.addChild(max)
        this.addChild(combo)
        this.addChild(num)

    }
}