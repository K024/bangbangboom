import { MainGame } from "../../../stages/mainStage";
import { scoreNumber, scoreNumType } from "./scoreNumber";
import { greatCombo, missCombo } from "../../../stages/hitScore";
import { distance_numToType } from "../whiteBg";
import * as Pixi from 'pixi.js'


// tslint:disable-next-line: class-name
export class missBanner extends Pixi.Container {

    constructor() {
        super()

        const loader = MainGame.loader
        // tslint:disable-next-line: no-string-literal
        const hitType_textures = loader.resources['hitType'].textures;

        if (!hitType_textures) throw new Error()

        const miss = new Pixi.Sprite(hitType_textures["miss.png"])
        miss.scale.set(0.7)
        miss.x = miss.width / 2
        miss.y = miss.height / 2

        const num = new scoreNumber(missCombo, scoreNumType.normalGrey)

        num.x = distance_numToType
        num.y = miss.height - num.height
        this.addChild(miss)
        this.addChild(num)
    }
}
