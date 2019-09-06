import { MainGame } from "../../../stages/mainStage";
import { scoreNumber, scoreNumType } from "./scoreNumber";
import { badCombo } from "../../../stages/hitScore";
import { distance_numToType } from "../whiteBg";
import * as Pixi from 'pixi.js'

// tslint:disable-next-line: class-name
export class badBanner extends Pixi.Container {

    constructor() {
        super()

        const loader = MainGame.loader
        // tslint:disable-next-line: no-string-literal
        const hitType_textures = loader.resources['hitType'].textures;

        if (!hitType_textures) throw new Error()

        const bad = new Pixi.Sprite(hitType_textures["bad.png"])
        bad.scale.set(0.7)
        bad.x = bad.width / 2
        bad.y = bad.height / 2

        const num = new scoreNumber(badCombo, scoreNumType.normalGrey)

        num.x = distance_numToType
        num.y = bad.height - num.height
        this.addChild(bad)
        this.addChild(num)
    }
}
