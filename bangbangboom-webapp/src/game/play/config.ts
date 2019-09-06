import { Config } from './constants';
import Vue from 'vue';

export const GameConfig = Vue.observable({
    config: new Config()
})

const c = localStorage.getItem("gameconfig")

if (c) {
    GameConfig.config = JSON.parse(c)
}

const vm = new Vue()

vm.$watch(() => JSON.stringify(GameConfig.config),
    n => localStorage.setItem("gameconfig", n),
    { immediate: true })

