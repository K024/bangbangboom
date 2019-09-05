import * as Pixi from "pixi.js"
import { zspeed, notes_x_collection, noteInitScale, farlineZ} from "../../../constants";
import { projection } from "../../../utils/projection";
import { MainGame } from "../../../stages/mainStage";
import { SingleSprite } from "./single";
import { FlickSprite } from "./flick";
import { SlideSprite } from "./slide";


type ns = SingleSprite | FlickSprite | SlideSprite
export class isoLineSprite extends Pixi.Container {

    constructor(public n1: ns, public n2: ns, public time: number, lane1: number, lane2: number) {
        super()
        const loader = MainGame.loader
        const note0Texture: any = loader.resources['note'].textures;
        const s = new Pixi.Sprite(note0Texture["simultaneous_line.png"])
        s.width = Math.abs(notes_x_collection[lane1] - notes_x_collection[lane2])
        
        this.addChild(s)
        this.lanex = Math.min(notes_x_collection[lane1], notes_x_collection[lane2])
        this.visible = false
    }

    shouldRemove = false
    lanex: number

    update(musicTime: number) {
        if(this.n1.shouldRemove || this.n2.shouldRemove) {
            this.shouldRemove = true
            this.visible = false
            return
        }
        const dt = this.time - musicTime
        const z = dt * zspeed
        if (z <= 0) {
            this.shouldRemove = true
            this.visible = false
            return
        } else if (z > farlineZ) {
            this.visible = false
        } else {
            this.visible = true
        }
        const p = projection(z, this.lanex)
        this.scale.set(p.scale, p.scale * noteInitScale)
        this.position.set(p.x, p.y)

    }
}