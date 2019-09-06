

import * as Pixi from "pixi.js"
import { singleSpriteParticle } from "./particle/singleSpriteParticle";
import { flickSpriteParticle } from "./particle/flickSpriteParticle";
import { updateEvent } from "../../globalEvents";
import { GameEvent } from "../../utils/event";
import { slideCircleParticle } from "./particle/slideCircle";

export const enum particleType { singleSprite, flickSprite, slideCircle }
export const particleTransTime = 300

export const hitParticalEvent = new GameEvent<[PIXI.Container]>()


// 两个圆环 不断变大 透明度减少  1
// 轨道发亮 1
// lightnormal  1
// 可选 星星
// 增加colormatrix 从开始到结束 颜色由白色变为蓝色 

// flick
// 一个圆环  1
// 白色circle 纵向拉伸   
// colormatrix 颜色从白到粉 

// slide
// 持续的绿色圆环 内外部各一个有缺口的圆环旋转方向不同
// 每个判定点都会有两个逐渐扩大的圆环

// colormatrix 都还没写

/**
 *  x的位置 ， 
 */
export function holdSlide(x: number) {
    const s = new slideCircleParticle(x)
    hitParticalEvent.emit(s)
    return {
        // tslint:disable-next-line: no-shadowed-variable
        move: (x: number) => { s.x = x },
        miss: () => { s.shouldRemove = true }
    }
}

// tslint:disable-next-line: class-name
export class particleLayer extends Pixi.Container {

    constructor() {
        super()
        hitParticalEvent.add(this.addParticle)
        updateEvent.add(this.update)
    }

    addParticle = (p: Pixi.Container) => {
        this.addChild(p);
    }

    update = (dt: number) => {
        const removeChildren: Pixi.Container[] = []
        this.children.forEach((e, i) => {
            const n = e as singleSpriteParticle | flickSpriteParticle | slideCircleParticle
            n.update(dt)
            if (n.shouldRemove)
                removeChildren.push(n)
        })
        this.removeChild(...removeChildren)
    }

    destroy() {
        super.destroy()
        hitParticalEvent.remove(this.addParticle)
        updateEvent.remove(this.update)
    }
}
