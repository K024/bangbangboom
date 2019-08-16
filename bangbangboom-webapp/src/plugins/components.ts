import Vue, { VNode, CreateElement } from 'vue'
import VueSlider from 'vue-slider-component'
import './vue-slider.scss'
import VueProgressBar from 'vue-progressbar'
import VueToasted from 'vue-toasted'

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
