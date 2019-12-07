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
import { reaction } from "mobx"


const GetFavorites = async (end?: string) => {
  try {
    const res = await Api.get<{ data: MapInfo[], end: string }>("favorite/all", { params: { end } })
    return res.data
  } catch (error) {
    setMessage("error.neterr", "error")
    return
  }
}

export const FavoritesPage = () => {

  const s = useLocalStore(() => ({
    loading: false,
    list: [] as MapInfo[],
    end: undefined as undefined | string,
    nomore: false,
    async loadMore() {
      s.loading = true
      const res = await GetFavorites(s.end)
      if (!res) return
      s.loading = false
      s.list.push(...res.data)
      s.list = s.list.splice(0)
      s.end = res.end
      if (res.data.length === 0) s.nomore = true
    },
  }))

  useEffect(() => {
    return reaction(() => UserState.user, u => {
      if (!u) return
      s.list = []
      s.loadMore()
    }, { fireImmediately: true })
  }, [s])


  return useObserver(() => (
    <>
      <Typography variant="h2">Favorites</Typography>
      <Box p={1}>
        {!UserState.user
          ? <FormattedMessage id="info.pleaselogin" />
          : <>
            <MapPreviewList maps={s.list} />
            {!s.nomore &&
              <CoverProgress loading={s.loading} m={1}>
                <Button onClick={s.loadMore} disabled={s.loading} fullWidth>
                  <FormattedMessage id="label.loadmore" />
                </Button>
              </CoverProgress>}
          </>}
      </Box>
    </>
  ))
}
