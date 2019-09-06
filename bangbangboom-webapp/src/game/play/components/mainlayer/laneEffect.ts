import * as Pixi from "pixi.js"
import { MainGame } from "../../stages/mainStage";

// tslint:disable-next-line: class-name
export class laneEffectSprite extends Pixi.Container {
    private readonly laneEffects: Pixi.Sprite[] = []


    constructor() {
        super()

        const loader = MainGame.loader

        // tslint:disable-next-line: no-string-literal
        const common_textures = loader.resources['common'].textures;

        if (!common_textures) throw new Error()

        this.laneEffects.push(new Pixi.Sprite(common_textures["lane_effect_0.png"]));
        this.laneEffects.push(new Pixi.Sprite(common_textures["lane_effect_1.png"]));
        this.laneEffects.push(new Pixi.Sprite(common_textures["lane_effect_2.png"]));
        this.laneEffects.push(new Pixi.Sprite(common_textures["lane_effect_3.png"]));
        this.laneEffects.push(new Pixi.Sprite(common_textures["lane_effect_2.png"]));
        this.laneEffects.push(new Pixi.Sprite(common_textures["lane_effect_1.png"]));
        this.laneEffects.push(new Pixi.Sprite(common_textures["lane_effect_0.png"]));

        // 半透明轨道
        for (let i = 0; i < 7; i++) {
            this.addChild(this.laneEffects[i]);
            // this.laneEffects[i].visible = false;
        }
        // 半透明轨道的后半部分要翻转 
        for (let i = 4; i < 7; i++) {
            const item = this.laneEffects[i];
            item.scale.x = -item.scale.x;
        }
    }

    showEffect(lane: number) {
        // todo
    }
}
