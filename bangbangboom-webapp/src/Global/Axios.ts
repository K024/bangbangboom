import axios, { AxiosError } from 'axios'
import qs from 'qs'
import { setMessage } from './Snackbar'

/* eslint-disable no-restricted-globals */
export const Api = axios.create({
    baseURL: location.origin + "/api/",
})

export const GetXSRFHeader = async () => {
    try {
        const result = await Api.get<string>('xsrf')
        Api.defaults.headers.post['X-XSRF-TOKEN'] = result.data
    } catch (error) {
        setMessage("error.neterr", "error")
    }
}
GetXSRFHeader()

export function Xform(form: object): string {
    return qs.stringify(form)
}

export function Form(form: { [k: string]: string | Blob }): FormData {
    const data = new FormData()
    for (const key in form) data.append(key, form[key])
    return data
}

export function HandleErr<T>(err: AxiosError<T>) {
    if (!err.response) {
        return
    }
    return err.response
}


