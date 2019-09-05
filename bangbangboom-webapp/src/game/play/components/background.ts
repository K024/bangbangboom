import * as Pixi from "pixi.js"
import { fixRatioContainer } from "../utils/fixRatioContainer";
import { layerWidth, layerHeight } from "../constants";
import { MainGame } from "../stages/mainStage";

// tslint:disable-next-line: class-name
export class backgroundSprite extends fixRatioContainer {
    constructor() {
        super(layerWidth, layerHeight)
        const bgPic = new Pixi.Sprite(MainGame.loader.resources['background'].texture);
        this.addChild(bgPic);
        this.setInit(bgPic.width, bgPic.height)

    }
}

