import React from "react"
import { AppUserInfo } from "../../Global/Modals"
import { Avatar, Typography } from "@material-ui/core"
import { AvatarProps } from "@material-ui/core/Avatar"

export type UserProfileProps = { user: AppUserInfo } & AvatarProps

export const UserProfile = ({ user, ...others }: UserProfileProps) => (
  <Avatar
    style={{ background: "#808080" }}
    {...(user.hasprofile ?
      { src: `/api/user/profile/${user.username}` } :
      { children: (user.nickname || user.username).charAt(0).toUpperCase() })}
    {...others} />)

export type UserNameProps = { user: AppUserInfo } &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>

export const UserName = ({ user, ...others }: UserNameProps) => (
  <span {...others}>
    {!user.nickname ?
      <Typography variant="body1" display="inline">@{user.username}</Typography> :
      <>
        <Typography variant="body1" display="inline">{user.nickname}</Typography>
        <Typography variant="body2" display="inline">@{user.username}</Typography>
      </>}
  </span>)