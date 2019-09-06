import * as Pixi from "pixi.js"
import { stageSwitchEvent } from "../../globalEvents";
import { MainStage } from "../../stages/mainStage";
import { chooseState } from "../chooseLayer";

// tslint:disable-next-line: class-name
export class normalPlay extends Pixi.Container {

    constructor() {
        super()
        const textStyle = new Pixi.TextStyle({
            fontSize: 52,
            fill: "white",
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        })
        const text = new Pixi.Text("play", textStyle)

        const g = new Pixi.Graphics()
        g.beginFill(0x000000)
        g.drawRect(0, 0, text.width, text.height)
        g.endFill()
        g.alpha = 0

        g.interactive = true
        g.on("pointerdown", () => { stageSwitchEvent.emit(new MainStage(chooseState.normalPlay)) })

        this.addChild(text)
        this.addChild(g)
    }
}
