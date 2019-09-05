import * as Pixi from "pixi.js"
import { MainGame, gameState } from "../../stages/mainStage";
import { layerWidth, layerHeight } from "../../constants";
import { updateEvent } from "../../globalEvents";
import { GameEvent } from "../../utils/event";
import { chooseState } from "../chooseLayer";

// 顺序不可变
export const enum hitType { perfect, great, good, bad, miss }



export const hitTypeEvent = new GameEvent<[number]>();


// 如果为auotoplay 则不显示
export class hitTypeSprite extends Pixi.Container {
    private readonly hitWord: Pixi.Sprite[] = []


    constructor() {
        super()

        const loader = MainGame.loader

        const hitType_textures = loader.resources['hitType'].textures;

        if (!hitType_textures) return

        // 顺序不可变
        this.hitWord.push(new Pixi.Sprite(hitType_textures["perfect.png"]))
        this.hitWord.push(new Pixi.Sprite(hitType_textures["great.png"]))
        this.hitWord.push(new Pixi.Sprite(hitType_textures["good.png"]))
        this.hitWord.push(new Pixi.Sprite(hitType_textures["bad.png"]))
        this.hitWord.push(new Pixi.Sprite(hitType_textures["miss.png"]))

        for (let i of this.hitWord) {
            i.visible = false;
            this.addChild(i);
        }

        this.scale.set(0.75)
        this.x = layerWidth / 2
        this.y = layerHeight * 0.75

        if (gameState === chooseState.normalPlay) {
            hitTypeEvent.add(this.showEffect)
            updateEvent.add(this.update)
        }


    }


    showEffect = (type: number) => {
        // todo
        for (let i of this.hitWord) {
            i.visible = false;
        }
        this.hitWord[type].visible = true;
        this.scale.set(0.6)
        this.timeCounter = 0
    }
    timeCounter = 0

    update = (dt: number, now: number) => {
        let s = this.scale.x
        if (s < 1) {
            s += (1 - s) * dt / 100 + 0.01
            if (s > 1) s = 1
            this.scale.set(s)
        }
        this.timeCounter += dt
        if (this.timeCounter > 1000) this.visible = false
        else this.visible = true
    }
    destroy(){
        super.destroy()
        if (gameState === chooseState.normalPlay) {
            hitTypeEvent.remove(this.showEffect)
            updateEvent.remove(this.update)
        }

    }
}
