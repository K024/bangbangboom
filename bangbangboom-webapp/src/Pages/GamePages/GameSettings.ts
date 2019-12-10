import { GameConfig } from "bangbangboom-game"
import { CreateAutoSaveObservableStore } from "../../Global/LocalStore"

const settings = CreateAutoSaveObservableStore("gamesettings", Object.assign({}, new GameConfig()))

export const GameSettings = settings
