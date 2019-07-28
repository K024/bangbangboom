import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'

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

