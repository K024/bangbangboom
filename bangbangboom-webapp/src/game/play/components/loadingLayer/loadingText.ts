
import * as Pixi from "pixi.js"


export class loadingText extends Pixi.Container {

    constructor(w: string) {
        super()
        const word_style = new Pixi.TextStyle({
            fontSize:48,
            fill: "white"
        })
        const word = new Pixi.Text("Loading: "+w, word_style)
        this.addChild(word);
    }


}
