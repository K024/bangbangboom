
import { fixRatioContainer } from "../utils/fixRatioContainer";
import { layerWidth, layerHeight } from "../constants";
import { GameEvent } from "../utils/event";
import { loadingText } from "./loadingLayer/loadingText";


export const loadingTipEvent = new GameEvent<[string]>()
export class loadingLayer extends fixRatioContainer {

    private text: loadingText

    constructor() {
        super(layerWidth, layerHeight)
        loadingTipEvent.add(this.loadText)
    }

    private loadText = (rn: string) =>{
        const n = new loadingText(rn)
        this.removeChild(this.text)
        this.text = n
        this.text.position.set(layerWidth/2 - this.text.width/2,layerHeight/2 - this.text.height/2)
        this.addChild(this.text)
    }

    destroy(){
        super.destroy()
        loadingTipEvent.remove(this.loadText)
    }

}