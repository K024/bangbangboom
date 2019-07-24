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
    get size() { return r.size }
    get g() { return r.size >= 768 }
    get s() { return !this.g }
}

declare module 'vue/types/vue' {
    // tslint:disable-next-line
    interface Vue {
        $responsive: Responsive
    }
}

Vue.use(new Responsive())
