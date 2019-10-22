import { observable } from "mobx";


export const UserState = observable({
  user: null
})

export const UsernameReg = /^[A-Za-z][A-Za-z0-9_]{3,20}$/
export const PasswordReg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)[\x00-\xff]{8,20}$/
