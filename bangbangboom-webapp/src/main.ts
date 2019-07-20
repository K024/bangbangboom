import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import '@/tools/registerServiceWorker';
import '@/plugins/element';
import '@/plugins/Axios'

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
