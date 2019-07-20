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


