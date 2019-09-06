
import { autoPlay } from "./chooseLayer/autoPlay";
import { normalPlay } from "./chooseLayer/normalPlay";
import { layerWidth, layerHeight } from "../constants";
import { fixRatioContainer } from "../utils/fixRatioContainer";

export enum chooseState { normalPlay, autoPlay }
// tslint:disable-next-line: class-name
export class chooseLayer extends fixRatioContainer {

    constructor() {
        super(layerWidth, layerHeight)
        const n = new normalPlay()
        const a = new autoPlay()
        n.x = layerWidth / 2 - n.width / 2
        n.y = layerHeight / 2 - n.height / 2 - n.height * 2
        a.x = layerWidth / 2 - a.width / 2
        a.y = layerHeight / 2 - a.height / 2 + a.height * 2
        this.addChild(n)
        this.addChild(a)

    }

}
