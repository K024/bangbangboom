
import * as Pixi from "pixi.js"
import { SingleSprite } from "./note/single";
import { FlickSprite } from "./note/flick";
import { SlideSprite } from "./note/slide";
import { addNoteEvent, getMusicTime } from "../../stages/mainStage";
import { updateEvent } from "../../globalEvents";
import { isoLineSprite } from "./note/isoLine";

type ns = SingleSprite | FlickSprite | SlideSprite
export class isoLineLayer extends Pixi.Container {

    constructor() {
        super()

        addNoteEvent.add(this.addNote)
        updateEvent.add(this.update)
    }

    map = new Map<number, {note: ns, end: boolean}>()

    addNote = (note: ns) => {
        if(note instanceof SingleSprite || note instanceof FlickSprite) {
            if (this.map.has(note.info.time)){
                const n = this.map.get(note.info.time)
                let lane = n.note.info.lane

                if (n.end) {
                    const sn = (n.note as SlideSprite).info
                    lane = sn.notes[sn.notes.length-1].lane
                }

                this.addChild(new isoLineSprite(note, n.note, note.info.time, lane, note.info.lane))
            } else {
                this.map.set(note.info.time, {note, end: false})
            }
            
        } else {
            if (this.map.has(note.info.time)) {
                const n = this.map.get(note.info.time)
                let lane = n.note.info.lane

                if (n.end) {
                    const sn = (n.note as SlideSprite).info
                    lane = sn.notes[sn.notes.length-1].lane
                }

                this.addChild(new isoLineSprite(note, n.note, note.info.time, lane, note.info.lane))
            } else {
                this.map.set(note.info.time, {note, end: false})
            }
            const end = note.info.notes[note.info.notes.length - 1]
            if (this.map.has(end.time)) {
                const n = this.map.get(end.time)
                let lane = n.note.info.lane

                if (n.end) {
                    const sn = (n.note as SlideSprite).info
                    lane = sn.notes[sn.notes.length-1].lane
                }

                this.addChild(new isoLineSprite(note, n.note, end.time, lane, end.lane))
            } else {
                this.map.set(end.time, {note, end: true})
            }
        }
    }

    update = () => {
        const remove: Pixi.Container[] = []
        this.children.forEach(n => {
            const tn = n as isoLineSprite
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
