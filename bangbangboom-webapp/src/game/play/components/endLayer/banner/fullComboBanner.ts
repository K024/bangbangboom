import { MainGame, gameState } from "../../../stages/mainStage";
import * as Pixi from 'pixi.js'
import { chooseState } from "../../chooseLayer";

// tslint:disable-next-line: class-name
export class fullComboBanner extends Pixi.Container {

    constructor() {
        super()

        const loader = MainGame.loader
        // tslint:disable-next-line: no-string-literal
        const fullcomboComplete = new Pixi.Sprite(loader.resources['full_combo'].texture);

        if (!fullcomboComplete) throw new Error()
        fullcomboComplete.scale.set(0.15)
        if (gameState !== chooseState.autoPlay)
            this.addChild(fullcomboComplete)
    }
}
