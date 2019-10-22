import { GameConfig as Config } from 'bangbangboom-game';
import Vue from 'vue';

export const GameConfig = Vue.observable({
    config: new Config()
})

const c = localStorage.getItem("gameconfig")

if (c) {
    const config = JSON.parse(c)
    Object.assign(GameConfig.config, config)
}

const vm = new Vue()

vm.$watch(() => JSON.stringify(GameConfig.config),
    n => localStorage.setItem("gameconfig", n),
    { immediate: true })

