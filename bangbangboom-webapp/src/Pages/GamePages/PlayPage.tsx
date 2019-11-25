import React, { useEffect, useRef } from "react"
import { useParams, useHistory } from "react-router"
import { makeStyles } from "@material-ui/core"
import { Game, GameLoadConfig } from "bangbangboom-game"
import { Api } from "../../Global/Axios"
import { MapInfo } from "../../Global/Modals"
import { GameSettings } from "./GameSettings"
import { setMessage } from "../../Global/Snackbar"
import { MetaState } from "../../Mapping/MappingState"
import { GameMapToString } from "../../Mapping/core/MapCore"
import { GameMapState } from "../../Mapping/GameMapState"

const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    left: 0, right: 0, top: 0, bottom: 0,
    background: "black"
  },
  canvas: {
    position: "absolute",
    width: "100%",
    height: "100%"
  }
}))

export const PlayPage = () => {

  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { root, canvas } = useStyles()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let unmounted = false
    let game: Game
    const callback = () => {
      if (unmounted) return
      unmounted = true
      history.goBack()
    }
    (async () => {
      try {
        let loadconfig: GameLoadConfig
        if (id !== "local") {
          const res = await Api.get<MapInfo>("/api/map/info", { params: { id } })
          if (unmounted) return
          loadconfig = {
            musicSrc: "/api/map/music/" + id,
            backgroundSrc: "/api/map/image/" + id,
            mapSrc: "/api/map/content/" + id,
            skin: "/assets/default",
            songName: (res.data.musicname || "(empty)") + " - " + (res.data.mapname || "(empty)")
          }
        } else {
          const mapstr = GameMapToString(GameMapState.map)
          const url = URL.createObjectURL(new Blob([mapstr]))
          loadconfig = {
            musicSrc: MetaState.musicSrc,
            backgroundSrc: MetaState.backgroundImageSrc,
            mapSrc: url,
            skin: "/assets/default",
            songName: "local"
          }
        }
        if (!ref.current) throw new Error("Error")
        game = new Game(ref.current, GameSettings, loadconfig)
        game.start()
        game.ondestroyed = callback
      } catch (error) {
        setMessage("error.neterr", "error")
        callback()
      }
    })()
    return callback
  }, [id, history])


  return (
    <div className={root}>
      <canvas ref={ref} className={canvas}></canvas>
    </div>)
}
