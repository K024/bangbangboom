import { MainGame } from "../../../stages/mainStage";
import { scoreNumber, scoreNumType } from "./scoreNumber";
import { greatCombo } from "../../../stages/hitScore";
import { distance_numToType } from "../whiteBg";
import * as Pixi from 'pixi.js'

// tslint:disable-next-line: class-name
export class greatBanner extends Pixi.Container {

    constructor() {
        super()

        const loader = MainGame.loader
        // tslint:disable-next-line: no-string-literal
        const hitType_textures = loader.resources['hitType'].textures;

        if (!hitType_textures) throw new Error()

        const great = new Pixi.Sprite(hitType_textures["great.png"])
        great.scale.set(0.7)
        great.x = great.width / 2
        great.y = great.height / 2

        const num = new scoreNumber(greatCombo, scoreNumType.normalGrey)

        num.x = distance_numToType
        num.y = great.height - num.height
        this.addChild(great)
        this.addChild(num)
    }
}
