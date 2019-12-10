import { observable, reaction } from "mobx"
import { AppUserInfo } from "../Global/Modals"
import { setMessage } from "../Global/Snackbar"
import { GetXSRFHeader, Api } from "../Global/Axios"

export const UserState = observable({
  user: null as null | AppUserInfo
})

export const UsernameReg = /^[A-Za-z][A-Za-z0-9_]{3,20}$/
export const PasswordReg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)[\x00-\xff]{8,20}$/ /* eslint-disable-line */

export async function LoadCurrentUser() {
  try {
    const res = await Api.get<AppUserInfo>("user/me")
    if (res.status === 200) {
      UserState.user = res.data
    } else {
      UserState.user = null
    }
  } catch (error) {
    setMessage("error.neterr", "error")
  }
}

reaction(() => UserState.user, async u => {
  await GetXSRFHeader()
})
