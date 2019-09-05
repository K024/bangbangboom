import * as Pixi from "pixi.js"
import { layerHeight, layerWidth } from "../../constants";
import { hanabi } from "./animation/hanabi";


// [255 / 255, 0, 0, 0, 0,
//     0, 105 / 255, 0, 0, 0,
//     0, 0, 180 / 255, 0, 0,
//     0, 0, 0, 1, 0]
export class backHanabi extends Pixi.Container{

    // colors: number[][] = [[],[],]

    posX: number[] = []
    posY: number[] = []

    scales: number[] =[]

    totalNumber =15
    constructor(){
        super()

        this.posX.push(layerWidth * 0.45)
        this.posY.push(layerHeight/2)
        this.scales.push(1)

        for(let i=0;i<this.totalNumber-1;i++){
            this.posX.push(layerWidth * Math.random())
            this.posY.push(layerHeight * Math.random())
            this.scales.push(0.4 * Math.random() + 0.3)
        }

        let i=0
        const intv = setInterval(()=>{
            const n = new hanabi()
            n.x =this.posX[i]
            n.y=this.posY[i]
            n.scale.set(this.scales[i])
            this.addChild(n)
            i++
            if(i===this.totalNumber)
                clearInterval(intv)
        },300)
    }
}
