import { Container, Loader, LoaderResource } from "pixi.js"
import { Howl } from "howler"
import { stageSwitchEvent, resizeEvent } from "../globalEvents";
import { MainGame } from "./mainStage";
import { loadingLayer, loadingTipEvent } from "../components/loadingLayer";
import { note, convert } from "../utils/gamemap";
import { GameMap } from "../../core/MapCore";
import { loadingBgEvent } from "../components/loadingLayer/loadingBg";
import { chooseStage } from "./chooseStage";
import { Config } from '../constants';
import { perfectSoundEvent, greatSoundEvent, badSoundEvent, buttonSoundEvent, flickSoundEvent } from './soundEffect';
import { hitTypeEvent } from '../components/mainlayer/hitType';
import { handleHit } from './hitScore';

// tslint:disable: class-name interface-name

export interface gameoptions {
    songurl: string,
    mapsource: string | "local",
    background: string | "local",
    skin: string,
    config: Config
}

function skinResources(skin: string = "skin0") {
    return {
        common: `/assets/${skin}/common.json`,
        lane: `/assets/${skin}/lane.json`,
        note: `/assets/${skin}/note.json`,
        particles: `/assets/${skin}/particles.json`,
        hitType: `/assets/${skin}/hitType.json`,
        fullCombo: `/assets/${skin}/fullCombo.json`,
        full_combo: `/assets/${skin}/full_combo.png`
    }
}

function audioResources(skin: string = "skin0") {
    return {
        perfect: `/assets/${skin}/perfect.mp3`,
        great: `/assets/${skin}/great.mp3`,
        good: `/assets/${skin}/good.mp3`,
        flick: `/assets/${skin}/flick.mp3`,
        long: `/assets/${skin}/long.mp3`,
        game_button: `/assets/${skin}/game_button.mp3`,
    }
}

export interface audios {
    perfect: Howl,
    great: Howl,
    good: Howl,
    flick: Howl,
    long: Howl,
    game_button: Howl,

    song: Howl,
}

export class loadingStage extends Container {
    constructor(options: gameoptions) {
        super()
        this.addChild(this.layer)
        this.layerResize(...resizeEvent.prevArgs)
        resizeEvent.add(this.layerResize)
        this.init(options)
    }

    private layer = new loadingLayer()
    private layerResize = (x: number, y: number) => this.layer.resize(x, y)

    private loader = new Loader()
    private audio = {} as audios
    private map: note[] = []

    private ready = 0

    async init(options: gameoptions) {
        const skin = skinResources(options.skin)
        for (const key in skin) {
            const k = key as keyof typeof skin
            this.loader.add(key, skin[k])
        }
        this.loader.add("background", options.background,
            { loadType: LoaderResource.LOAD_TYPE.IMAGE })
        this.loader.on("progress", this.picLoadProgressHandler)
        this.loader.onError = () => this.error()
        this.loader.load(() => this.partloaded())

        const audior = audioResources(options.skin)

        for (const key in audior) {
            const k = key as keyof typeof audior
            this.audio[k] = new Howl({
                src: audior[k],
                // onload: () => this.partloaded(),
                onload: () => this.soundLoadHandler(),
                onloaderror: () => this.error()
            })
        }
        this.audio.song = new Howl({
            src: options.songurl,
            format: "mp3",
            // onload: () => this.partloaded(),
            onload: () => this.soundLoadHandler(),
            onloaderror: () => this.error(),
        })

        if (options.mapsource === 'local') {
            const mapstring = localStorage.getItem("gamemapstate")
            if (!mapstring) this.error()
            else {
                this.map = convert(GameMap.fromMapString(mapstring))
                this.mapLoadHandler()
                this.partloaded()
            }
        } else {
            const res = await fetch(options.mapsource)
            const mapstring = await res.text()
            this.map = convert(GameMap.fromMapString(mapstring))
            this.mapLoadHandler()
            this.partloaded()
        }
    }

    initListeners() {
        perfectSoundEvent.add(() => MainGame.audios.perfect.play())
        greatSoundEvent.add(() => MainGame.audios.great.play())
        badSoundEvent.add(() => MainGame.audios.good.play())
        buttonSoundEvent.add(() => MainGame.audios.game_button.play())
        flickSoundEvent.add(() => MainGame.audios.flick.play())

        hitTypeEvent.add(handleHit)
    }

    private partloaded() {
        this.ready++;
        if (this.ready >= 9) {
            MainGame.notes = this.map
            MainGame.audios = this.audio
            MainGame.loader = this.loader
            // // 测试
            // stageSwitchEvent.emit(new endStage())
            // stageSwitchEvent.emit(new mainStage())
            this.initListeners()
            stageSwitchEvent.emit(new chooseStage())
            loadingBgEvent.emit()
            resizeEvent.remove(this.layerResize)
        }
    }

    private error() {
        // todo
    }

    private picLoadProgressHandler = (loader: any, resource: any) => {
        loadingTipEvent.emit(resource.name)
        // 因为音乐资源最大，所以可能在图片资源加载完时音乐还在加载
        if (loader.progress >= 100)
            loadingTipEvent.emit("music")
    }

    private soundLoadHandler() {
        loadingTipEvent.emit("music")
        this.partloaded()
    }

    private mapLoadHandler() {
        loadingTipEvent.emit("map")
    }
}


