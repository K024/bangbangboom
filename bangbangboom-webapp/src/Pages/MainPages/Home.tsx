import React, { useEffect } from "react"
import { Button, Typography } from "@material-ui/core"
import { setMessage } from "../../Global/Snackbar"
import { observable } from "mobx"
import { MapInfo } from "../../Global/Modals"
import { Api } from "../../Global/Axios"
import { MergeListDistinct } from "../../Global/Utils"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { MapPreviewList } from "../Components/MapItem"
import { FormattedMessage } from "react-intl"
import { CoverProgress } from "../Components/CoverProgress"

const HomePageMaps = observable({
  maps: [] as MapInfo[],
  page: 1,
  nomore: false,
})

const comparator = (a: MapInfo, b: MapInfo) => {
  const ta = (a.reviewed && new Date(a.reviewed)) || new Date(0)
  const tb = (b.reviewed && new Date(b.reviewed)) || new Date(0)
  return tb.getTime() - ta.getTime()
}

const LoadPage = async (page = 1) => {
  try {
    const res = await Api.get<MapInfo[]>("map/latest", { params: { page } })
    const list = MergeListDistinct(HomePageMaps.maps, res.data, comparator)
    HomePageMaps.maps = list
    if (res.data.length === 0) HomePageMaps.nomore = true
  } catch (error) {
    setMessage("error.neterr", "error")
  }
}

export const Home = () => {

  const s = useLocalStore(() => ({
    loading: false
  }))

  useEffect(() => {
    s.loading = true
    LoadPage(1)
    s.loading = false
  }, [s])

  const LoadMore = async () => {
    s.loading = true
    HomePageMaps.page++
    await LoadPage(HomePageMaps.page)
    s.loading = false
  }

  return useObserver(() => (<>
    <Typography variant="h2">Home</Typography>
    <MapPreviewList maps={HomePageMaps.maps} />
    {!HomePageMaps.nomore &&
      <CoverProgress loading={s.loading} m={1}>
        <Button onClick={LoadMore} disabled={s.loading} fullWidth>
          <FormattedMessage id="label.loadmore" />
        </Button>
      </CoverProgress>}
  </>))
}
