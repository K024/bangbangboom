
import { layerWidth, layerHeight } from "../../constants";
import { comboAnimate } from "./animation/comboAnimate";
import { starAnimate } from "./animation/starAnimate";
import { jpAnimate } from "./animation/jpAnimate";
import * as Pixi from "pixi.js"
import { updateEvent } from "../../globalEvents";

export const firstTime = 1000
export const stayTime = firstTime + 1500
export const secondTime = stayTime + 2000

export class fullComboAnimate extends Pixi.Container {

    /**
     *  先有一个星星 旋转着从中间冒出来 变大
     * 然后full combo 依次出现
     * 同时星星旋转一周 到达日文最后的位置 过程中 会产生向外扩散的波纹 ，此时背景中模糊的花火都开始出现
     *  这时フルコンボ 和感叹号出现
     * 然后全部渐隐，
     */

    //背后的花火还没做


    shouldRemove = false
    constructor() {
        super()
        const c = new comboAnimate()
        c.y = layerHeight * 0.5
        c.x = layerWidth * 0.2
        this.addChild(c)

        const j = new jpAnimate()
        j.x = layerWidth * 0.7
        j.y = layerHeight * 0.60
        this.addChild(j)

        const s = new starAnimate()
        s.x = layerWidth * 0.45
        s.y = layerHeight / 2
        this.addChild(s)

        updateEvent.add(this.update)
    }

    update = () => {
        let b = true
        this.children.forEach(e => {
            const n = e as comboAnimate | jpAnimate | starAnimate
            if (!n.shouldRemove)
                b = false
        })
        this.shouldRemove = b
        if (this.shouldRemove)
            updateEvent.remove(this.update)
    }

}