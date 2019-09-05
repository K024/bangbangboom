import { MainGame } from "../../../stages/mainStage";
import { scoreNumber, scoreNumType } from "./scoreNumber";
import { greatCombo } from "../../../stages/hitScore";
import { distance_numToType } from "../whiteBg";
import * as Pixi from 'pixi.js'

export class greatBanner extends Pixi.Container{

    constructor(){
        super()

        const loader = MainGame.loader
        const hitType_textures = loader.resources['hitType'].textures;

        if (!hitType_textures) return

        const great = new Pixi.Sprite(hitType_textures["great.png"])
        great.scale.set(0.7)
        great.x = great.width/2
        great.y = great.height/2

        const num = new scoreNumber(greatCombo,scoreNumType.normalGrey)

        num.x = distance_numToType
        num.y = great.height - num.height
        this.addChild(great)
        this.addChild(num)
    }
}