import Vue from 'vue'
import Element from 'element-ui'
import VueI18n from 'vue-i18n'

// tslint:disable-next-line: no-var-requires
const enLocale = require('element-ui/lib/locale/lang/en')
// tslint:disable-next-line: no-var-requires
const zhLocale = require('element-ui/lib/locale/lang/zh-CN')
// tslint:disable-next-line: no-var-requires
const jaLocale = require('element-ui/lib/locale/lang/ja')

Vue.use(VueI18n)

const messages = {
    en: {
        message: 'hello',
        ...enLocale,
    },
    zh: {
        message: '你好',
        ...zhLocale,
    },
    ja: {
        message: 'こんにちは',
        ...jaLocale,
    },
}

const i18n = new VueI18n({
    locale: 'en',
    messages,
})

Vue.use(Element, {
    i18n: (key: string, value: string) => i18n.t(key, value),
})

