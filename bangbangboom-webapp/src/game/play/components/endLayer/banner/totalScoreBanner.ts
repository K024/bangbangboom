import { MainGame, gameState } from "../../../stages/mainStage";
import { scoreNumber, scoreNumType } from "./scoreNumber";
import { perfectCombo, score } from "../../../stages/hitScore";
import { distance_numToType } from "../whiteBg";
import * as Pixi from 'pixi.js'
import { chooseLayer, chooseState } from "../../chooseLayer";


export class totalScoreBanner extends Pixi.Container {

    constructor() {
        super()

        const wordStyel = new Pixi.TextStyle({
            fontSize: 48,
            fontFamily: "Saira",
            fill: ['#404040', '#404040'],
            fontWeight: 'bold'
        })


        const word = new Pixi.Text("Score", wordStyel)

        const num = new scoreNumber(score, scoreNumType.red)

        const styleRed = new Pixi.TextStyle({
            fontSize: 48,
            fontFamily: "Saira",
            fontWeight: 'bold',
            fill: ['#DC143C', '#DC143C']
        })
        const autoplay = new Pixi.Text("autoplay", styleRed)

        num.x = 600 - num.width
        autoplay.x = 600 - autoplay.width
        
        if (gameState === chooseState.autoPlay)
            this.addChild(autoplay)
        else if (gameState === chooseState.normalPlay)
            this.addChild(num)
        this.addChild(word)
    }
}