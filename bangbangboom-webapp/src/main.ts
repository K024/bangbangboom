import Vue from 'vue';
import router from '@/router';
import i18n from '@/plugins/i18n';
import '@/plugins/material'
import '@/plugins/responsive'
import '@/plugins/progressbar'
import '@/tools/registerServiceWorker';
import '@/tools/Axios'
import App from '@/components/App.vue';

import "./main.css";

Vue.config.productionTip = false;

new Vue({
    router,
    i18n,
    render: (h) => h(App),
}).$mount('#app');
