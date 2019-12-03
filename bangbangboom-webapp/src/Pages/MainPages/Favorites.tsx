import React, { useEffect } from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { Api } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { MapInfo } from "../../Global/Modals"
import { Typography, Button, Box } from "@material-ui/core"
import { MapPreviewList } from "../Components/MapItem"
import { CoverProgress } from "../Components/CoverProgress"
import { FormattedMessage } from "react-intl"
import { UserState } from "../UserState"


const GetFavorites = async (page = 1) => {
  try {
    const res = await Api.get<MapInfo[]>("favorite/all", { params: { page } })
    return res.data
  } catch (error) {
    setMessage("error.neterr", "error")
    return []
  }
}

export const FavoritesPage = () => {

  const s = useLocalStore(() => ({
    page: 1,
    loading: false,
    list: [] as MapInfo[],
    nomore: false,
  }))

  useEffect(() => {
    if (!UserState.user) return
    s.loading = true
    GetFavorites().then(v => {
      s.loading = false
      s.page = 2
      s.list = v
      if (v.length === 0) s.nomore = true
    })
  }, [s])

  const loadMore = async () => {
    s.loading = true
    const res = await GetFavorites(s.page)
    s.loading = false
    s.page = s.page + 1
    s.list.push(...res)
    if (res.length === 0) s.nomore = true
  }

  return useObserver(() => (
    <>
      <Typography variant="h2">Favorites</Typography>
      {!UserState.user
        ? <Box m={1}><FormattedMessage id="info.pleaselogin" /></Box>
        : <>
          <MapPreviewList maps={s.list} />
          {!s.nomore &&
            <CoverProgress loading={s.loading} m={1}>
              <Button onClick={loadMore} disabled={s.loading} fullWidth>
                <FormattedMessage id="label.loadmore" />
              </Button>
            </CoverProgress>}
        </>}
    </>
  ))
}
