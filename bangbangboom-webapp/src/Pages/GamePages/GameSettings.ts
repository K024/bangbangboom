import { observable, autorun } from "mobx"
import { GameConfig } from "bangbangboom-game"


function LoadFromStorage() {
  try {
    const str = localStorage.getItem("gamesettings")
    if (!str) return {}
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}

const settings = observable(Object.assign({}, new GameConfig(), LoadFromStorage()))

autorun(r => {
  localStorage.setItem("gamesettings", JSON.stringify(settings))
}, { delay: 100 })

export const GameSettings = settings
