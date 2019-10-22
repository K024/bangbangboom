import Vue from 'vue';

export const usersettings = Vue.observable({
    settings: {
        showoriginal: false
    }
})

const c = localStorage.getItem("usersettings")

if (c) {
    usersettings.settings = JSON.parse(c)
}

const vm = new Vue()

vm.$watch(() => JSON.stringify(usersettings.settings),
    n => localStorage.setItem("usersettings", n),
    { immediate: true })
