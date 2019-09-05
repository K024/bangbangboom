import * as Pixi from 'pixi.js'
import { resolveTxt } from 'dns';

export enum scoreNumType { normal, normalGrey, red }
// 普通黑 普通黑加灰色0  红色

export class scoreNumber extends Pixi.Container {

    private num: number

    private count: number

    private numType: number

    constructor(num: number, type: number) {
        super()
        this.num = num
        this.numType = type
        this.setCount()
        this.setNumText()
    }

    setNumText() {
        const size = 36
        const redSize = 48
        let numString: string = this.num.toString()
        let x = 0

        const styleGrey = new Pixi.TextStyle({
            fontSize: size,
            fontFamily: "Saira",
            fontWeight: 'bold',
            fill: ['#A0A0A0', '#A0A0A0']
        })
        const styleRed = new Pixi.TextStyle({
            fontSize: redSize,
            fontFamily: "Saira",
            fontWeight: 'bold',
            fill: ['#DC143C', '#DC143C']
        })
        const n = "0"
        const testString1 = new Pixi.Text(n, styleGrey)
        let width1 = testString1.width
        const testStirng2 = new Pixi.Text(n,styleRed)
        let width2 = testStirng2.width

        switch (this.numType) {
            case scoreNumType.normal:
                x = 0
                const style = new Pixi.TextStyle({
                    fontSize: size,
                    fontFamily: "Saira",
                    fontWeight: 'bold'
                })
                for (let i = 0; i < numString.length; i++) {
                    const n = numString[i]
                    const blackText = new Pixi.Text(n, style)
                    blackText.x = x
                    x += width1
                    this.addChild(blackText)
                }
                break;

            case scoreNumType.normalGrey:
                x = 0
                if (this.count < 4) {
                    const styleGrey = new Pixi.TextStyle({
                        fontSize: size,
                        fontFamily: "Saira",
                        fontWeight: 'bold',
                        fill: ['#A0A0A0', '#A0A0A0']
                    })
                    for (let i = 0; i < 4 - this.count; i++) {
                        const n = "0"
                        const headString = new Pixi.Text(n, styleGrey)
                        headString.x = x
                        x += width1
                        this.addChild(headString)
                    }
                }
                const styleBlack = new Pixi.TextStyle({
                    fontSize: size,
                    fontFamily: "Saira",
                    fontWeight: 'bold'
                })
                for (let i = 0; i < this.count; i++) {
                    const n = numString[i]
                    const blackText = new Pixi.Text(n, styleBlack)
                    blackText.x = x
                    x += width1
                    this.addChild(blackText)
                }
                break;

            case scoreNumType.red:
                x = 0;
                const styleRed = new Pixi.TextStyle({
                    fontSize: redSize,
                    fontFamily: "Saira",
                    fontWeight: 'bold',
                    fill: ['#DC143C', '#DC143C']
                })
                for (let i = 0; i < numString.length; i++) {
                    const n = numString[i]
                    const redText = new Pixi.Text(n, styleRed)
                    redText.x = x
                    x += width2
                    this.addChild(redText)
                }
                break;
        }
    }

    setCount() {
        if (this.num >= 1000) this.count = 4
        else if (this.num >= 100) this.count = 3
        else if (this.num >= 10) this.count = 2
        else this.count = 1
    }
}