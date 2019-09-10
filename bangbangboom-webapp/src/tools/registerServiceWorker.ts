/* tslint:disable:no-console */

import { register, unregister } from 'register-service-worker';
import Vue from 'vue';
import i18n from '@/plugins/i18n';

const enabled = false
if (process.env.NODE_ENV === 'production' && enabled) {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB',
      );
    },
    registered() {
      console.log('Service worker has been registered.');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updatefound() {
      console.log('New content is downloading.');
    },
    updated() {
      console.log('New content is available; please refresh.');
      Vue.toasted.success(i18n.t("s.pleaseRefresh") as string);
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
} else {
  unregister()
}
