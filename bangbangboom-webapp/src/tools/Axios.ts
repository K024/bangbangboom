import axios, { AxiosError } from 'axios'
import qs, { stringify } from 'qs'
import Vue from 'vue'
import i18n from '@/plugins/i18n'
import { getReCapHeader } from './recaptcha'

/**
 * 默认api请求的axios实例（已经设置baseURL）
 */
const api = axios.create({
    baseURL: location.origin + "/api/",
    timeout: 3000,
})

export const GetXSRFHeader = async () => {

    try {
        const result = await api.get<string>('xsrf')
        api.defaults.headers.post['X-XSRF-TOKEN'] = result.data;
    } catch (error) {
        Vue.toasted.error(i18n.t("s.neterror") as string)
    }
}
GetXSRFHeader()

api.interceptors.request.use(async req => {
    if (req.url && req.method && req.method.toLowerCase() === "post") {
        const result = /^(?:https?:\/\/[\.\w:]+\/api\/)?(\w+)(?:\/(\w+))?(?:\/|\?|#|$)/.exec(req.url)
        if (result) {
            let action = result[1]
            if (result[2]) action += "_" + result[2]
            try {
                const token = await getReCapHeader(action)
                req.headers["X-reCAPTCHA"] = token
            } catch (error) {
                console.warn("Cannot get reCaptcha token")
            }
        }
    }
    return req
})

export default api

/**
 * 构建x-www-form-urlencoded表单（用于一般请求）
 * @param form 表单对象
 */
export function Xform(form: object): string {
    return qs.stringify(form)
}

/**
 * 构建form-data表单（用于携带二进制数据的表单）
 * @param form 
 */
export function Form(form: { [k: string]: string | Blob }): FormData {
    const data = new FormData()
    for (const key in form) data.append(key, form[key])
    return data
}

/**
 * 如果请求有响应，返回相应，否则返回undefined
 */
export function HandleErr<T>(err: AxiosError<T>) {
    if (!err.response) {
        return
    }
    return err.response
}

