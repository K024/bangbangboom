import { GameEvent } from "./utils/event";
import { Container } from "pixi.js"

export const updateEvent = new GameEvent<[number, number]>()

export const stageSwitchEvent = new GameEvent<[Container]>()

export const resizeEvent = new GameEvent<[number, number]>()

export const rawPointerEvent = new GameEvent<[PointerEvent]>()

