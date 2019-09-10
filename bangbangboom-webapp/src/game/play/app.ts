import * as Pixi from 'pixi.js'
import { Ticker } from '../core/Ticker';
import { updateEvent, resizeEvent, stageSwitchEvent, rawPointerEvent } from './globalEvents';
import { loadingStage, gameoptions, audios } from './stages/loadingStage';
import 'pepjs'
import { ClearEvents } from './utils/event';
import { MainGame } from './stages/mainStage';
import { note } from './utils/gamemap';
import { clearCombo } from './stages/hitScore';
import { apply } from './constants';
export class App {

    private readonly renderer: Pixi.Renderer;

    private stage = new Pixi.Container();

    private readonly ticker = new Ticker();

    constructor(canvas: HTMLCanvasElement, options: gameoptions) {

        this.renderer = Pixi.autoDetectRenderer({
            width: canvas.clientWidth,
            height: canvas.clientHeight,
            view: canvas,
        })

        this.setCanvasListener(canvas)

        stageSwitchEvent.add(this.createNewStage)

        this.ticker.Tick.add((delta, now) => {

            updateEvent.emit(delta, now)

            if (this.stage)
                this.renderer.render(this.stage)
        });

        this.ticker.Start();

        this.resizeCanvas();

        this.stage = new loadingStage(options)
        apply(options.config)
    }

    createNewStage = (newStage: Pixi.Container) => {
        this.stage.destroy()
        this.stage = newStage
    }

    setLowPerformance(low: boolean = true) {
        this.ticker.SkipFrame = low ? 1 : 0
    }

    setCanvasListener(canvas: HTMLCanvasElement) {
        canvas.addEventListener("pointerdown", e => rawPointerEvent.emit(e))
        canvas.addEventListener("pointercancel", e => rawPointerEvent.emit(e))
        canvas.addEventListener("pointermove", e => rawPointerEvent.emit(e))
        canvas.addEventListener("pointerup", e => rawPointerEvent.emit(e))
        canvas.addEventListener("pointerenter", e => rawPointerEvent.emit(e))
        canvas.addEventListener("pointerleave", e => rawPointerEvent.emit(e))
        canvas.addEventListener("pointerout", e => rawPointerEvent.emit(e))
        canvas.addEventListener("pointerover", e => rawPointerEvent.emit(e))
    }

    resizeCanvas() {
        const v = this.renderer.view
        this.renderer.resize(v.clientWidth, v.clientHeight)
        resizeEvent.emit(v.clientWidth, v.clientHeight)
    }

    destroy() {
        this.ticker.Stop()
        this.stage.destroy()
        this.renderer.destroy(false)
        ClearEvents()
        clearCombo()
        Pixi.utils.destroyTextureCache()
        MainGame.loader.destroy()
        MainGame.audios.song.unload()
        MainGame.notes = [] as note[]
    }

}
