
import { backgroundSprite } from "../components/background";
import { resizeEvent } from "../globalEvents";
import * as Pixi from 'pixi.js'
import { chooseLayer } from "../components/chooseLayer";

// 在进入游戏后进入选择界面 选择正常play 或 auto play
// tslint:disable-next-line: class-name
export class chooseStage extends Pixi.Container {

    private background = new backgroundSprite()
    private choose = new chooseLayer()
    constructor() {
        super()
        this.addChild(this.background)
        this.addChild(this.choose)

        this.resize(...resizeEvent.prevArgs)
        resizeEvent.add(this.resize)
    }


    resize = (x: number, y: number) => {
        this.background.resize(x, y, true)
        this.choose.resize(x, y)
    }

    destroy() {
        super.destroy({ children: true })
        resizeEvent.remove(this.resize)
    }

}
