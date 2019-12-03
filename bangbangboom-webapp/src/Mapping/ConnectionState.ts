import { observable, autorun, toJS, reaction } from "mobx"
import { CreateLocalStore, CreateAutoSaveObservableStore } from "../Global/LocalStore"
import { GameMapState, ResetMap } from "./GameMapState"
import { GameMapToString } from "./core/MapCore"
import { Api, HandleErr, Form } from "../Global/Axios"
import { MapInfo, CanModifyStatus } from "../Global/Modals"
import { setMessage } from "../Global/Snackbar"
import { UserState, LoadCurrentUser } from "../Pages/UserState"
import { MetaState } from "./MappingState"

function handleError(error: any) {
  const err = HandleErr<string>(error)
  if (!err) setMessage("error.neterr", "error")
  else if (err.status === 400) setMessage("error.badrequest", "error")
  else if (err.status === 403) setMessage("error.forbidden", "error")
  else if (err.status === 404) setMessage("notice.notfound", "error")
  else setMessage(err.status + ": " + err.data, "error")
}

function createLocalSlot(name: string) {
  const { value, save } = CreateLocalStore(name)
  const init = {
    musicname: undefined as undefined | string,
    artist: undefined as undefined | string,
    mapname: undefined as undefined | string,
    difficulty: undefined as number | undefined,
    description: undefined as undefined | string,
    musicSrc: "",
    imageSrc: "",
    mapcontent: "",
  }
  const localslot = observable(value ? JSON.parse(value) as typeof init : init)
  autorun(() => {
    const o = toJS(localslot)
    o.musicSrc = ""
    o.imageSrc = ""
    save(JSON.stringify(o))
  }, { delay: 100 })
  return localslot
}

const localslot = createLocalSlot("localslot")
let onlineslot: MapInfo

export const ConnectionState = CreateAutoSaveObservableStore("connectionstate", {
  source: "local",
  loading: false,
  connected: false,
  readonly: true
})

reaction(() => ConnectionState.source, async s => {
  ConnectionState.connected = false
  ConnectionState.readonly = true
  if (!s) return
  if (s === "local") {
    ConnectionState.loading = false
    ConnectionState.connected = true
    ConnectionState.readonly = false
    ResetMap(localslot.mapcontent)
  } else {
    ConnectionState.loading = true
    try {
      const res = await Api.get<MapInfo>("map/info", { params: { id: s } })
      onlineslot = observable(res.data)
      ConnectionState.connected = true
      const map = await Api.get<string>("map/content/" + s)
      ResetMap(map.data)
      if (!UserState.user) await LoadCurrentUser()
      if (UserState.user && (onlineslot.uploader.username === UserState.user.username
        || CanModifyStatus.indexOf(onlineslot.status)) >= 0) {
        ConnectionState.readonly = false
      }
    } catch (error) {
      handleError(error)
    }
    ConnectionState.loading = false
  }
}, { fireImmediately: true })


function CommonGetter<T extends keyof (MapInfo | typeof localslot)>(propname: T) {
  if (!ConnectionState.connected) return undefined
  if (ConnectionState.source === "local")
    return localslot[propname]
  return onlineslot[propname]
}

async function CommonSetter<T extends keyof (MapInfo | typeof localslot)>(propname: T, value: (typeof localslot | MapInfo)[T]) {
  if (!ConnectionState.connected || ConnectionState.readonly) return
  if (ConnectionState.source === "local") {
    localslot[propname] = value as any
    return
  }
  ConnectionState.loading = true
  try {
    await Api.post("map/modify", Form({ id: onlineslot.id.toString(), [propname]: value as any }))
    onlineslot[propname] = value as any
  } catch (error) {
    handleError(error)
  }
  ConnectionState.loading = false
}

export const ConnectionInfo = observable({
  get musicname() {
    return CommonGetter("musicname")
  },
  setMusicname(name = "") {
    return CommonSetter("musicname", name)
  },
  get artist() {
    return CommonGetter("artist")
  },
  setArtist(artist: string) {
    return CommonSetter("artist", artist)
  },
  get mapname() {
    return CommonGetter("mapname")
  },
  setMapname(name: string) {
    return CommonSetter("mapname", name)
  },
  get difficulty() {
    return CommonGetter("difficulty")
  },
  setDifficulty(difficulty: number) {
    return CommonSetter("difficulty", difficulty)
  },
  get description() {
    return CommonGetter("description")
  },
  setDescription(description: string) {
    return CommonSetter("description", description)
  },

  get musicSrc() {
    if (!ConnectionState.connected) return ""
    if (ConnectionState.source === "local") return localslot.musicSrc
    if (onlineslot.hasmusic) return "/api/map/music/" + onlineslot.id
    return ""
  },
  get imageSrc() {
    if (!ConnectionState.connected) return ""
    if (ConnectionState.source === "local") return localslot.imageSrc
    if (onlineslot.hasimage) return "/api/map/image/" + onlineslot.id
    return ""
  },

  async uploadMusic(file: File) {
    if (!ConnectionState.connected || ConnectionState.readonly) return
    if (ConnectionState.source === "local") {
      localslot.musicSrc = URL.createObjectURL(file)
      return
    }
    ConnectionState.loading = true
    try {
      await Api.post("map/modify", Form({ id: onlineslot.id.toString(), music: file }))
      onlineslot.hasmusic = false
      onlineslot.hasmusic = true
    } catch (error) {
      handleError(error)
    }
    ConnectionState.loading = false
  },

  async uploadImage(file: File) {
    if (!ConnectionState.connected || ConnectionState.readonly) return
    if (ConnectionState.source === "local") {
      localslot.imageSrc = URL.createObjectURL(file)
      return
    }
    ConnectionState.loading = true
    try {
      await Api.post("map/modify", Form({ id: onlineslot.id.toString(), image: file }))
      onlineslot.hasimage = false
      onlineslot.hasimage = true
    } catch (error) {
      handleError(error)
    }
    ConnectionState.loading = false
  },

  async saveMapContent(content: string) {
    if (!ConnectionState.connected || ConnectionState.readonly) return
    if (ConnectionState.source === "local") {
      localslot.mapcontent = content
      return
    }
    ConnectionState.loading = true
    try {
      await Api.post("map/modify", Form({ id: onlineslot.id.toString(), content }))
    } catch (error) {
      handleError(error)
      return false
    }
    ConnectionState.loading = false
  },
})

export function getConnectionLoadConfig() {
  let url: string
  if (ConnectionState.source === "local") {
    const mapstr = GameMapToString(GameMapState.map)
    url = URL.createObjectURL(new Blob([mapstr]))
  } else {
    url = "/api/map/content/" + ConnectionState.source
  }
  return {
    musicSrc: ConnectionInfo.musicSrc,
    backgroundSrc: ConnectionInfo.imageSrc,
    mapSrc: url,
    skin: "/assets/default",
    songName: (ConnectionInfo.musicname || "(empty)") + " - "
      + (ConnectionInfo.mapname || "(empty)")
  }
}

autorun(() => {
  MetaState.musicSrc = ConnectionInfo.musicSrc
  MetaState.backgroundImageSrc = ConnectionInfo.imageSrc
})