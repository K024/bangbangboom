
export type AppUserInfo = {
  username: string
  nickname?: string
  whatsup?: string
  hasprofile: boolean
  uploadedmaps?: number
  roles?: string[]
}

export type CommentInfo = {
  id: number
  mapid: number
  user: AppUserInfo
  parentcommentid?: number
  datetime: string
  content: string
  locked: boolean
}

export type MapInfo = {
  id: number
  uploader: AppUserInfo
  musicname?: string
  artist?: string
  mapname?: string
  difficulty?: number
  description?: string
  plays?: number
  favorites?: number
  created: string
  lastmodified: string
  reviewed?: string
  status: "wip" | "reviewing" | "notpass" | "reviewed" | "proved"
  hasmusic: boolean
  hasimage: boolean
}

