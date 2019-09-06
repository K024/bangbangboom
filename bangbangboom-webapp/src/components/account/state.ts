import Vue from 'vue'
import { AccountInfo } from '@/tools/models';
import api, { GetXSRFHeader } from '@/tools/Axios';


export const userstate = Vue.observable({
    loginstate: false,
    currentuser: new AccountInfo(),
})

export const emailvalidate = (email: string) =>
    email && /^.+@.+$/.test(email) || false

export const usernamevalidate = (username: string) =>
    username && /^[A-Za-z][A-Za-z0-9_]{3,}$/.test(username) || false

export const passwordvalidate = (pass: string) =>
    pass && pass.length >= 8 && /[a-z]/.test(pass) && /[0-9]/.test(pass) || false;

export async function LoadCurrentUser() {
    try {
        await GetXSRFHeader()
        const res = await api.get<AccountInfo>("account/current");
        userstate.currentuser = res.data;
        userstate.loginstate = true;
    } catch (error) {
        userstate.loginstate = false;
    }
}
