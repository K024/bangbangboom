import * as Pixi from "pixi.js"
import { fixRatioContainer } from "../../utils/fixRatioContainer";
import { layerWidth, layerHeight, lanePos_x, lanePos_y } from "../../constants";
import { MainGame } from "../../stages/mainStage";


// tslint:disable-next-line: class-name
export class lanesSprite extends Pixi.Container {
    constructor() {
        super()

        const loader = MainGame.loader
        // tslint:disable-next-line: no-string-literal
        const lane0_textures: any = loader.resources['lane'].textures;
        const bg_line_rhythm_Pic = new Pixi.Sprite(lane0_textures["bg_line_rhythm.png"]);
        const game_play_line_Pic = new Pixi.Sprite(lane0_textures["game_play_line.png"]);
        this.addChild(bg_line_rhythm_Pic);
        this.addChild(game_play_line_Pic);

        bg_line_rhythm_Pic.x = lanePos_x;
        bg_line_rhythm_Pic.y = lanePos_y;
        game_play_line_Pic.x = lanePos_x;
        game_play_line_Pic.y = lanePos_y;
    }
}
