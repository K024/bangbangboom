import api from "./Axios"
import { site_key } from "./sitekey"

// tslint:disable-next-line
declare namespace grecaptcha {
    function ready(func: () => void): void
    function execute(site_key: string, options: { action: string }): PromiseLike<string>
}


let recaptchaReady = false

const todolist: Array<() => void> = []

grecaptcha.ready(() => {
    recaptchaReady = true
    todolist.forEach(f => f())
    todolist.length = 0
})

export async function getReCapHeader(action: string): Promise<string> {
    if (!recaptchaReady) {
        return new Promise((res, rej) => {
            todolist.push(() => {
                getReCapHeader(action).then(res)
            })
        })
    }
    return await grecaptcha.execute(site_key, { action })
}

