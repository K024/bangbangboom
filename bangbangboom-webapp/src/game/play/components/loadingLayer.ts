
import { fixRatioContainer } from "../utils/fixRatioContainer";
import { layerWidth, layerHeight } from "../constants";
import { GameEvent } from "../utils/event";
import { loadingText } from "./loadingLayer/loadingText";


export const loadingTipEvent = new GameEvent<[string]>()
// tslint:disable-next-line: class-name
export class loadingLayer extends fixRatioContainer {

    private text: loadingText | null = null

    constructor() {
        super(layerWidth, layerHeight)
        loadingTipEvent.add(this.loadText)
    }

    private loadText = (rn: string) => {
        const n = new loadingText(rn)
        if (this.text)
            this.removeChild(this.text)
        this.text = n
        this.text.position.set(layerWidth / 2 - this.text.width / 2, layerHeight / 2 - this.text.height / 2)
        this.addChild(this.text)
    }

    destroy() {
        super.destroy()
        loadingTipEvent.remove(this.loadText)
    }

}
