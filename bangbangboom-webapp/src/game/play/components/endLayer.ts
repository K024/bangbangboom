import { fixRatioContainer } from "../utils/fixRatioContainer";
import { layerWidth, layerHeight } from "../constants";
import { whiteBg } from "./endLayer/whiteBg";
import { backToBegin } from "./endLayer/backToBegin";

export class endLayer extends fixRatioContainer {

    /**
     *  先有一个星星 旋转着从中间冒出来 变大
     * 然后full combo 依次出现
     * 同时星星旋转一周 到达日文最后的位置 过程中 会产生向外扩散的波纹 ，此时背景中模糊的花火都开始出现
     *  这时フルコンボ 和感叹号出现
     * 然后全部渐隐，
     */

    constructor() {
        super(layerWidth, layerHeight)
        // 不要用 fullcombo 的动画

        const w = new whiteBg()
        w.x = layerWidth * 0.5 - w.width * 0.5
        w.y = layerHeight * 0.5 - w.height * 0.5

        const b = new backToBegin()
        b.x = layerWidth/2 - b.width/2
        b.y = w.y + w.height + b.y

        this.addChild(w)
        this.addChild(b)
        
    }


}
