import CreateStore from '@/tools/CreateStore'
import axios, { AxiosError } from 'axios'

export class User {
    username = ""
    email = ""
    roles: string[] = []
}

const userstate = CreateStore({
    loginstate: false,
    currentuser: new User(),
    message: ""
})
export default userstate

export const passwordvalidate = (pass: string) =>
    pass.length >= 8 && /[a-z]/.test(pass) && /[0-9]/.test(pass);
