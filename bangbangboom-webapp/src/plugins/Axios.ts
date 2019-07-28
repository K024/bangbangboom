import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import qs from 'qs'

/**
 * 默认api请求的axios实例（已经设置baseURL）
 */
const api = axios.create({
    baseURL: location.origin + "/api/",
    timeout: 3000,
})

const GetXSRFHeader = async () => {

    try {
        const result = await api.get<string>('xsrf')
        api.defaults.headers.post['X-XSRF-TOKEN'] = result.data;
    } catch (error) {
        console.log("Get csrf failed, retry after 60s.")
        setTimeout(GetXSRFHeader, 60 * 1000)
    }
}
GetXSRFHeader()

export default api

/**
 * 构建x-www-form-urlencoded表单（用于一般请求）
 * @param form 表单对象
 */
export function Xform(form: object): AxiosRequestConfig {
    return {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(form),
    }
}

/**
 * 构建form-data表单（用于携带二进制数据的表单）
 * @param form 
 */
export function Form(form: { [k: string]: string | Blob }): AxiosRequestConfig {
    const data = new FormData()
    for (const key in form) data.append(key, form[key])
    return { data }
}

/**
 * 如果请求有响应，返回相应，否则抛出错误
 */
export function HandleErr<T>(err: AxiosError<T>) {
    if (!err.response) throw err
    return err.response
}

