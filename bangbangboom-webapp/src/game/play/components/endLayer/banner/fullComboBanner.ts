import { MainGame, gameState } from "../../../stages/mainStage";
import * as Pixi from 'pixi.js'
import { chooseState } from "../../chooseLayer";

export class fullComboBanner extends Pixi.Container {

    constructor() {
        super()

        const loader = MainGame.loader
        const fullcomboComplete = new Pixi.Sprite(loader.resources['full_combo'].texture);

        if (!fullcomboComplete) return
        fullcomboComplete.scale.set(0.15)
        if (gameState !== chooseState.autoPlay)
            this.addChild(fullcomboComplete)
    }
}