import * as Pixi from "pixi.js"
import { SingleSprite } from "./note/single";
import { FlickSprite } from "./note/flick";
import { SlideSprite } from "./note/slide";
import { addNoteEvent, getMusicTime } from "../../stages/mainStage";
import { updateEvent } from "../../globalEvents";


// tslint:disable-next-line: class-name
export class notesSprite extends Pixi.Container {

    constructor() {
        super()

        addNoteEvent.add(this.addNote)
        updateEvent.add(this.update)
    }

    addNote = (note: SingleSprite | FlickSprite | SlideSprite) => {
        note.visible = false
        this.addChild(note)
    }

    update = () => {
        const remove: Pixi.Container[] = []
        this.children.forEach(n => {
            const tn = n as SingleSprite | FlickSprite | SlideSprite
            tn.update(getMusicTime())
            if (tn.shouldRemove)
                remove.push(tn)
        })
        this.removeChild(...remove)
    }

    destroy() {
        super.destroy()

        addNoteEvent.remove(this.addNote)
        updateEvent.remove(this.update)
    }
}
