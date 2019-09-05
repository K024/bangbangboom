import { MainGame } from "../../../stages/mainStage";
import { scoreNumber, scoreNumType } from "./scoreNumber";
import { perfectCombo } from "../../../stages/hitScore";
import { distance_numToType } from "../whiteBg";
import * as Pixi from 'pixi.js'

export class perfectBanner extends Pixi.Container{

    constructor(){
        super()

        const loader = MainGame.loader
        const hitType_textures = loader.resources['hitType'].textures;

        if (!hitType_textures) return

        const perfect = new Pixi.Sprite(hitType_textures["perfect.png"])
        perfect.scale.set(0.7)
        perfect.x=perfect.width/2
        perfect.y=perfect.height/2

        const num = new scoreNumber(perfectCombo,scoreNumType.normalGrey)

        num.x = distance_numToType
        num.y = perfect.height - num.height
        this.addChild(perfect)
        this.addChild(num)
    }
}