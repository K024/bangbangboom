import * as Pixi from "pixi.js"

// tslint:disable-next-line: class-name
export class fixRatioContainer extends Pixi.Container {
    constructor(initWidth: number, initHeight: number) {
        super();
        this._width = initWidth
        this._height = initHeight
    }

    private _width: number
    private _height: number

    get width() { return this._width * this.scale.x }
    set width(v) {
        const p = v / this._width;
        this.scale.set(p, p)
    }
    get height() { return this._height * this.scale.x }
    set height(v) {
        const p = v / this._height;
        this.scale.set(p, p)
    }

    setInit(width: number, height: number) {
        this._width = width
        this._height = height
    }

    get ratio() { return this._width / this._height }

    resize(containerWidth: number, containerHeight: number, cover = false) {
        const cr = containerWidth / containerHeight
        const r = this.ratio
        if ((cr > r) !== cover) {
            this.height = containerHeight
            this.x = containerWidth / 2 - this.width / 2
            this.y = 0
        } else {
            this.width = containerWidth
            this.x = 0
            this.y = containerHeight / 2 - this.height / 2
        }
    }

}
