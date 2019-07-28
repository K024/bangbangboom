import Vue, { PluginObject } from 'vue'
import CreateStore from '@/tools/CreateStore';

const r = CreateStore({
    size: 0
})

class Responsive implements PluginObject<any> {
    install(vue: typeof Vue, options: any) {
        Vue.prototype.$responsive = this
        function resize() {
            r.size = window.innerWidth
        }
        window.addEventListener("resize", resize)
        resize()
    }
    /** 屏幕宽度 */
    get size() { return r.size }
    /** 大于768px */
    get g() { return r.size > 768 }
    /** 小于等于768px */
    get s() { return !this.g }
}

declare module 'vue/types/vue' {
    // tslint:disable-next-line
    interface Vue {
        /**
         * 可观察的响应式变量
         */
        $responsive: Responsive
    }
}

Vue.use(new Responsive())
