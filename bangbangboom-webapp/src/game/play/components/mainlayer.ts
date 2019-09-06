
import { fixRatioContainer } from "../utils/fixRatioContainer";
import { layerWidth, layerHeight } from "../constants";
import { lanesSprite } from "./mainlayer/lanes";
import { comboSprite } from "./mainlayer/combo";
import { notesSprite } from "./mainlayer/notes"
import { intereactionSprite } from "./mainlayer/intereaction";
import { hitTypeSprite } from "./mainlayer/hitType";
import { particleLayer } from "./mainlayer/particleLayer";
import { isoLineLayer } from "./mainlayer/isoLineLayer";

// tslint:disable-next-line: class-name
export class mainLayer extends fixRatioContainer {

    readonly combo = new comboSprite()
    readonly notes = new notesSprite()
    readonly interRecSprite = new intereactionSprite()

    readonly hittypeSprite = new hitTypeSprite()

    constructor() {
        super(layerWidth, layerHeight)

        this.addChild(new lanesSprite())
        this.addChild(new isoLineLayer())
        this.addChild(this.notes)
        this.addChild(new particleLayer())
        this.addChild(this.hittypeSprite)
        this.addChild(this.combo)
        this.addChild(this.interRecSprite)

    }
}
