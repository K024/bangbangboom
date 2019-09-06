
import Vue, { VNode, CreateElement } from 'vue'
import VueSlider from 'vue-slider-component'
import './vue-slider.scss'
import VueProgressBar from 'vue-progressbar'
import VueToasted from 'vue-toasted'
import { SecondToString } from '@/tools/functions';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css'
import './material.scss'

import LazyLoad from 'vue-lazyload'
import datetime from '../components/others/datetime.vue'
import avatar from '../components/others/avatar.vue'
import user from '../components/others/user.vue'
import musictitle from '../components/others/musictitle.vue'
import musicartist from '../components/others/musicartist.vue'
import editable from '../components/reuse/editable.vue'

Vue.use(VueMaterial)

Vue.use(LazyLoad)


const option: VueProgressBar.OptionType = {
    thickness: "4px",
    color: "#409eff",
    transition: {
        speed: "0.5s",
        opacity: "0.3s",
        termination: 300
    }
}

Vue.use(VueProgressBar, option)

Vue.component("md-slider", VueSlider)

Vue.use(VueToasted, {
    position: "bottom-center",
    duration: 5000,
    iconPack: "material",
})

Vue.filter("time", SecondToString)

Vue.filter("date", (s: string) => new Date(s).toLocaleString())

Vue.component("date-time", datetime)
Vue.component("avatar", avatar)
Vue.component("user", user)
Vue.component("editable", editable)
Vue.component("music-title", musictitle)
Vue.component("music-artist", musicartist)


