import Vue, { VNode } from 'vue'
import { PlayState } from '../../state';


export default Vue.extend({
    props: {
        timeHeightFactor: {
            type: Number,
            required: true
        }
    },
    computed: {
        progresstrans: function (): string {
            const y = PlayState.position * this.timeHeightFactor;
            return `translateY(${-y}px)`
        }
    },
    render(h): VNode {
        return h("div")
    },
    mounted: function () {
        this.$watch(() => this.progresstrans, n => (this.$el as HTMLElement).style.transform = n,
            { immediate: true })
    }
})

