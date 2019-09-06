import * as Pixi from "pixi.js"
import { fixRatioContainer } from "../utils/fixRatioContainer";
import { layerWidth, layerHeight } from "../constants";
import { MainGame } from "../stages/mainStage";
import { GameConfig } from '../config';

// tslint:disable-next-line: class-name
export class backgroundSprite extends fixRatioContainer {
    constructor() {
        super(layerWidth, layerHeight)
        // tslint:disable-next-line: no-string-literal
        const bgPic = new Pixi.Sprite(MainGame.loader.resources['background'].texture);
        this.addChild(bgPic);
        this.setInit(bgPic.width, bgPic.height)

        bgPic.alpha = 1 - GameConfig.config.backgroundDim

    }
}

