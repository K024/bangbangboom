import React, { useState, useEffect } from "react"
import { useObserver } from "mobx-react-lite"
import { Api } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { MapInfo } from "../../Global/Modals"
import { Typography, Button } from "@material-ui/core"
import { MapPreviewList } from "../Components/MapItem"
import { ButtonProgress } from "../Components/CoverProgress"
import { FormattedMessage } from "react-intl"


const GetFavorites = async (page = 1) => {
  try {
    const res = await Api.get<MapInfo[]>("favorites/all", { params: { page } })
    return res.data
  } catch (error) {
    setMessage("error.neterr", "error")
    return []
  }
}

export const FavoritesPage = () => {

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([] as MapInfo[])
  const [nomore, setNomore] = useState(false)

  useEffect(() => {
    setLoading(true)
    GetFavorites().then(v => {
      setLoading(false)
      setPage(2)
      setList(v)
      if (v.length === 0) setNomore(true)
    })
  }, [])

  const loadMore = async () => {
    setLoading(true)
    const res = await GetFavorites(page)
    setLoading(false)
    setPage(page + 1)
    setList(list.concat(...res))
    if (res.length === 0) setNomore(true)
  }

  return useObserver(() => (
    <>
      <Typography variant="h2">Favorites</Typography>
      <MapPreviewList maps={list} />
      {!nomore &&
        <ButtonProgress loading={loading} m={1}>
          <Button onClick={loadMore} disabled={loading} fullWidth>
            <FormattedMessage id="home.loadmore" />
          </Button>
        </ButtonProgress>}
    </>
  ))
}
