import * as Pixi from "pixi.js"
import { MainGame } from "../../stages/mainStage";
import { layerWidth, layerHeight } from "../../constants";
import { updateEvent } from "../../globalEvents";
import { hitScoreEvent } from "../../stages/hitScore";

// tslint:disable-next-line: class-name
class combonumbers extends Pixi.Container {
    constructor() {
        super()
        this.init()
    }

    readonly numberTextures: Pixi.Texture[] = []

    async init() {
        const loader = MainGame.loader

        // tslint:disable-next-line: no-string-literal
        const common_textures = loader.resources['common'].textures;
        if (!common_textures) throw new Error()
        for (let i = 0; i < 10; i++) {
            this.numberTextures.push(common_textures[i + ".png"])
        }
    }

    setCombo(combo: number) {
        this.removeChildren()

        const half = 35
        this.x = half

        while (combo > 0) {
            const digit = combo % 10
            combo = Math.floor(combo / 10)
            const d = new Pixi.Sprite(this.numberTextures[digit])
            this.children.forEach(c => c.x += half * 2)
            this.x -= half
            this.addChild(d)
        }
    }
}

// tslint:disable-next-line: class-name
export class comboSprite extends Pixi.Container {
    constructor() {
        super()
        const loader = MainGame.loader
        // tslint:disable-next-line: no-string-literal
        const common_textures = loader.resources['common'].textures;
        if (!common_textures) throw new Error()
        const common_word = new Pixi.Sprite(common_textures["combo.png"]);
        common_word.x = 0
        common_word.y = 0

        this.addChild(this.combonumber)
        this.addChild(common_word)

        this.visible = false

        this.position.set(0.75 * layerWidth, 0.5 * layerHeight)

        hitScoreEvent.add(this.setCombo)
        updateEvent.add(this.update)
    }

    private combonumber = new combonumbers()

    setCombo = (combo: number) => {
        if (combo <= 0) {
            this.visible = false
            return
        } else {
            this.scale.set(0.8)
            this.visible = true
            this.combonumber.setCombo(combo)
        }
    }

    update = (dt: number) => {
        let s = this.scale.x
        if (s < 1) {
            s += (1 - s) * dt / 100 + 0.01
            if (s > 1) s = 1
            this.scale.set(s)
        }
    }

    destroy() {
        super.destroy()
        hitScoreEvent.remove(this.setCombo)
        updateEvent.remove(this.update)
    }
}
