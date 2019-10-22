import React from "react"
import { Button } from "@material-ui/core"
import { Loading } from "../../Global/Progress"
import { setMessage } from "../../Global/Snackbar"

export const Home = () => {
  return (<>
    <Button onClick={() => Loading.loading = true}>Load</Button>
    <Button onClick={() => Loading.loading = false}>Stop</Button>
    <Button onClick={() => setMessage("Message")}>Stop</Button>
    <Button onClick={() => setMessage("Message2", "success")}>Stop</Button>
    <Button onClick={() => setMessage("Message3", "warning")}>Stop</Button>
    <Button onClick={() => setMessage("Message3", "error")}>Stop</Button>
  </>)
}
