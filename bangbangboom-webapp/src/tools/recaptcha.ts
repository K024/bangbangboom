import api from "./Axios"

// tslint:disable-next-line
declare namespace grecaptcha {
    function ready(func: () => void): void
    function execute(site_key: string, options: { action: string }): PromiseLike<string>
}

// todo
const site_key = "MY_SITE_KEY"

let recaptchaReady = false

const todolist: Array<() => void> = []

grecaptcha.ready(() => {
    recaptchaReady = true
    todolist.forEach(f => f())
    todolist.length = 0
})

export async function setReCapHeader(action: string) {
    if (!recaptchaReady) {
        return new Promise((res, rej) => {
            todolist.push(() => {
                setReCapHeader(action).then(res)
            })
        })
    }
    const token = await grecaptcha.execute(site_key, { action })
    api.defaults.headers.post['X-reCAPTCHA'] = token;
    api.defaults.headers.get['X-reCAPTCHA'] = token;
}

