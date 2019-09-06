import { Container, Loader } from "pixi.js"
import { audios } from "./loadingStage";
import { mainLayer } from "../components/mainlayer";
import { backgroundSprite } from "../components/background";
import { GameEvent } from "../utils/event";
import { SingleSprite } from "../components/mainlayer/note/single";
import { FlickSprite } from "../components/mainlayer/note/flick";
import { SlideSprite } from "../components/mainlayer/note/slide";
import { resizeEvent, updateEvent, stageSwitchEvent } from "../globalEvents";
import { note } from "../utils/gamemap";
import { MinTicker } from "../../core/Ticker";
import { farlineZ, zspeed, visualOffset } from "../constants";
import { judger } from "./judger";
import { endStage } from "./endStage";
import { autoPlayJudger } from "./autoPlayJudger";
import { chooseState } from "../components/chooseLayer";


export const MainGame = {
    loader: null as any as Loader,
    audios: null as any as audios,
    notes: [] as note[],
}

/** faster than update trigger */
export const musicTimeUpdateEvent = new GameEvent<[number]>()

let musicTime = 0

export function getMusicTime() {
    return musicTime - visualOffset / 1000
}

export const addNoteEvent = new GameEvent<[SingleSprite | FlickSprite | SlideSprite]>()
export const endEvent = new GameEvent()
export let musicId = 0

export let gameState = 0
export class MainStage extends Container {
    private background = new backgroundSprite()
    private main: mainLayer
    private minticker = new MinTicker()

    // private judger = new judger()
    // private judger = new autoPlayJudger()
    private juder: judger | autoPlayJudger

    constructor(playState: number) {
        super()

        gameState = playState
        switch (playState) {
            case chooseState.normalPlay:
                this.juder = new judger()
                break;
            default:
                this.juder = new autoPlayJudger()
                break;
        }
        this.main = new mainLayer()


        this.addChild(this.background)
        this.addChild(this.main)
        this.main.alpha = 0

        updateEvent.add(this.enterTrans)

        this.resize(...resizeEvent.prevArgs)
        resizeEvent.add(this.resize)

        musicTime = -3

        MainGame.audios.song.on("end", () => endEvent.emit())

        // 设置padding 在开始后的2秒后播放音乐
        setTimeout(() => {
            this.minticker.Tick.add((dt) => {
                if (musicTime < 0) {
                    musicTime += dt
                    if (musicTime >= 0) {
                        musicId = MainGame.audios.song.play()
                        musicTime = MainGame.audios.song.seek(undefined, musicId) as number
                    }
                } else {
                    musicTime = MainGame.audios.song.seek(undefined, musicId) as number
                }
                musicTimeUpdateEvent.emit(musicTime)
            })
        }, 2000);



        this.minticker.Start()

        updateEvent.add(this.update)
        endEvent.add(this.endTrans)
    }

    endTrans = () => {
        updateEvent.add(this.hideMain)
    }

    private lastNoteId = 0
    update = () => {
        let n = MainGame.notes[this.lastNoteId]
        while (n && n.time < musicTime + farlineZ / zspeed) {

            if (n.type === "flick") {
                addNoteEvent.emit(new FlickSprite(n))
            } else if (n.type === "single") {
                addNoteEvent.emit(new SingleSprite(n))
            } else if (n.type === "slide") {
                addNoteEvent.emit(new SlideSprite(n))
            }

            this.lastNoteId++;
            n = MainGame.notes[this.lastNoteId]
        }
    }

    resize = (x: number, y: number) => {
        this.background.resize(x, y, true)
        this.main.resize(x, y)

    }

    hideMain = (dt: number) => {
        let a = this.main.alpha
        if (a > 0) {
            a -= (1 - a) * dt / 4000 + 0.01
            if (a < 0)
                a = 0
        }
        this.main.alpha = a
        if (a === 0) {
            updateEvent.remove(this.hideMain)
            stageSwitchEvent.emit(new endStage())
        }
    }

    enterTrans = (dt: number) => {
        let a = this.main.alpha
        a += (1 - a) * dt / 5000 + 0.01
        if (a > 1)
            a = 1
        this.main.alpha = a
        if (a >= 1) {
            updateEvent.remove(this.enterTrans)
        }
    }

    destroy() {
        super.destroy({ children: true })
        resizeEvent.remove(this.resize)
        updateEvent.remove(this.update)
        endEvent.remove(this.endTrans)
    }

}
