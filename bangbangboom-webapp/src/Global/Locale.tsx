import React, { ReactNode } from "react"
import { observable, reaction } from "mobx"
import { useObserver } from "mobx-react-lite"
import { IntlProvider } from "react-intl"
import en from "./Languages/en.json"
import zh from "./Languages/zh.json"
import { CreateLocalStore } from "./LocalStore"

export const Messages = {
    en, zh
}

export const Locale = observable({
    locale: "en" as keyof typeof Messages
})

const { value: lang, save } = CreateLocalStore("locale", navigator.language.substr(0, 2))

if (lang in Messages) {
    Locale.locale = lang as keyof typeof Messages
}
reaction(() => Locale.locale, (l) => {
    save(l)
}, { fireImmediately: true })


export const LocaleProvider = ({ children = {} as ReactNode }) => {
    return useObserver(() => (
        <IntlProvider locale={Locale.locale} messages={Messages[Locale.locale]}>
            {children}
        </IntlProvider>
    ))
}


