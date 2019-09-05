import { GameEvent } from "../utils/event";
import { MainGame } from "./mainStage";


export const perfectSoundEvent = new GameEvent()
export const greatSoundEvent = new GameEvent()
export const badSoundEvent = new GameEvent()
export const buttonSoundEvent = new GameEvent()
export const flickSoundEvent = new GameEvent()


perfectSoundEvent.add(() => MainGame.audios.perfect.play())

greatSoundEvent.add(() => MainGame.audios.great.play())

badSoundEvent.add(() => MainGame.audios.good.play())

buttonSoundEvent.add(() => MainGame.audios.game_button.play())

flickSoundEvent.add(() => MainGame.audios.flick.play())

