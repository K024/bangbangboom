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
        w: {
            search: 'Search',
            ranking: 'Ranking',
            favorites: 'Favorites',
            mapping: 'Mapping',
            login: 'Login',
            register: 'Register',
            forgotpass: 'Forgot password',
            username: 'Username',
            password: 'Password',
            email: 'Email',
            available: 'Available',
            confirm: 'Confirm',
        },
        l: {
            register: 'Register:',
            resetpass: 'Reset your password:',
            forgotpass: 'Forgot your password:',
        },
        s: {
            checking: 'Checking...',
            emialregistered: 'The email has been registered',
            usernameregistered: 'The user name has been registered',

            enterpass: 'Enter your password here',
            validpass: 'Require 8-digit alphanumeric password',
            enterpass2: 'Enter your password again',

            sentemail: 'An email has been sent to your address. Please follow the email to complete the remaining steps.',

            registersuccess: 'Register successfully',
            resetpasssuccess: 'Reset password successfully',

            pleaselogin: 'Please login first',
        },

        ...enLocale,
    },
    zh: {
        w: {
            search: '搜索',
            ranking: '排行',
            favorites: '收藏',
            mapping: '作图',
            login: '登录',
            register: '注册',
            forgotpass: '忘记密码',
            username: '用户名',
            password: '密码',
            email: '邮箱',
            available: '可用',
            confirm: '确认',
        },
        l: {
            register: '注册:',
            resetpass: '重置密码:',
            forgotpass: '忘记密码:',
        },
        s: {
            checking: '检察中...',
            emialregistered: '邮箱已注册',
            usernameregistered: '用户名已注册',

            enterpass: '请输入密码',
            validpass: '需要8位数字字母混合密码',
            enterpass2: '请再次输入密码',

            sentemail: '邮件已发送，请检查邮件完成剩余步骤',

            registersuccess: '注册成功',
            resetpasssuccess: '重置密码成功',

            pleaselogin: '请先登录',
        },

        ...zhLocale,
    },
    ja: {
        w: {
            search: '検索',
            ranking: 'ランキング',
            favorites: 'お気に入り',
            mapping: 'マッピング',
            login: 'ログイン',
            register: '新規登録',
            forgotpass: '忘れた',
            username: 'ユーザー名',
            password: 'パスワード',
            email: 'メール',
            available: '利用可能',
            confirm: '確認',
        },
        l: {
            register: '新規登録:',
            resetpass: 'パスワードをリセットする:',
            forgotpass: 'パスワードを忘れてしまった:',
        },
        s: {
            checking: '検察中...',
            emialregistered: 'メールが登録されました',
            usernameregistered: 'ユーザー名が登録されました',

            enterpass: 'パスワードを入力ください',
            validpass: '8桁の英数字パスワードが必要',
            enterpass2: '繰り返し',

            sentemail: 'メールが送信されました。メールに従って残りの手順を完了してください。',

            registersuccess: '新規登録成功した',
            resetpasssuccess: 'パスワードをリセットした',

            pleaselogin: 'ログインしてください',
        },

        ...jaLocale,
    },
}

const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages,
})

Vue.use(Element, {
    i18n: (key: string, value: string) => i18n.t(key, value),
})

Vue.use(VueI18n)

export default i18n
