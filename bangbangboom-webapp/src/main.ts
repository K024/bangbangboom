import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import '@/tools/registerServiceWorker';
import i18n from '@/plugins/i18n';
import '@/plugins/Axios'
import '@/plugins/responsive'

import "./main.css";

Vue.config.productionTip = false;

new Vue({
    router,
    i18n,
    render: (h) => h(App),
}).$mount('#app');
