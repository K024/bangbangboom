import React, { useState, useEffect } from "react"
import { useObserver } from "mobx-react-lite"
import { Api } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { MapInfo } from "../../Global/Modals"
import { Typography, Button, TextField, Box } from "@material-ui/core"
import { MapPreviewList } from "../Components/MapItem"
import { ButtonProgress } from "../Components/CoverProgress"
import { FormattedMessage } from "react-intl"


const Search = async (key: string, page = 1) => {
  try {
    const res = await Api.get<MapInfo[]>("map/search", { params: { key, page } })
    return res.data
  } catch (error) {
    setMessage("error.neterr", "error")
    return []
  }
}

export const SearchPage = () => {

  const [key, setKey] = useState("")
  const [searchingkey, setSearchingkey] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([] as MapInfo[])
  const [nomore, setNomore] = useState(false)

  const loadMore = async () => {
    if (searchingkey.trim() === "") return
    setLoading(true)
    const res = await Search(searchingkey, page)
    setLoading(false)
    setPage(page + 1)
    setList(list.concat(...res))
    if (res.length === 0) setNomore(true)
  }

  const search = async () => {
    setPage(1)
    setSearchingkey(key)
    await loadMore()
  }

  return useObserver(() => (
    <>
      <Typography variant="h2">Search</Typography>
      <Box display="flex">
        <TextField style={{ flexGrow: 1 }} value={key} onChange={e => setKey(e.target.value)} />
        <Button onClick={search}>
          <FormattedMessage id="home.loadmore" />
        </Button>
      </Box>
      <MapPreviewList maps={list} />
      {!nomore &&
        <ButtonProgress loading={loading} m={1}>
          <Button onClick={loadMore} disabled={loading} fullWidth>
            <FormattedMessage id="home.loadmore" />
          </Button>
        </ButtonProgress>}
      {nomore && list.length === 0 &&
        <Typography variant="h3">
          <FormattedMessage id="search.noresult" />
        </Typography>}
    </>
  ))
}
