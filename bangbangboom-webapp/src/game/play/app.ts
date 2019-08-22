import * as Pixi from 'pixi.js'
import { Ticker } from '../core/Ticker';

export class App {

    private readonly renderer: Pixi.Renderer

    private readonly stage = new Pixi.Container()

    private readonly loader = new Pixi.Loader()

    private readonly ticker = new Ticker()

    constructor(canvas: HTMLCanvasElement) {

        this.renderer = Pixi.autoDetectRenderer({
            width: canvas.clientWidth,
            height: canvas.clientHeight,
            view: canvas
        })
    }

    setLowPerformance(low: boolean = true) {
        this.ticker.SkipFrame = low ? 1 : 0
    }

    resizeCanvas() {
        const v = this.renderer.view
        this.renderer.resize(v.clientWidth, v.clientHeight)
    }

    destroy() {
        // todo
    }
}
