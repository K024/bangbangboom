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

export const emailvalidate = (email: string) =>
    email && /^.+@.+$/.test(email) || false

export const usernamevalidate = (username: string) =>
    username && /^[A-Za-z][A-Za-z0-9_]{3,}$/.test(username) || false

export const passwordvalidate = (pass: string) =>
    pass && pass.length >= 8 && /[a-z]/.test(pass) && /[0-9]/.test(pass) || false;
