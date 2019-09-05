import { endLayer } from "../components/endLayer";
import { backgroundSprite } from "../components/background";
import { resizeEvent } from "../globalEvents";
import * as Pixi from 'pixi.js'


export class endStage extends Pixi.Container {

    private background = new backgroundSprite()
    private end = new endLayer()
    constructor(){
        super()
        this.addChild(this.background)
        this.addChild(this.end)

        this.resize(...resizeEvent.prevArgs)
        resizeEvent.add(this.resize)
    }

    
    resize = (x: number, y: number) => {
        this.background.resize(x, y, true)
        this.end.resize(x, y)
    }

    destroy(){
        super.destroy()
        resizeEvent.remove(this.resize)
    }

}