import React, { useState } from "react"
import { useObserver } from "mobx-react-lite"
import { Api } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { MapInfo } from "../../Global/Modals"
import { Typography, Button, TextField, Box, IconButton, InputAdornment } from "@material-ui/core"
import { MapPreviewList } from "../Components/MapItem"
import { CoverProgress } from "../Components/CoverProgress"
import { FormattedMessage } from "react-intl"
import SearchIcon from '@material-ui/icons/Search'

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
  const [nomore, setNomore] = useState(true)

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
      <Typography variant="h5">Search</Typography>
      <Box display="flex" p={1}>
        <TextField style={{ flexGrow: 1 }} value={key}
          onChange={e => setKey(e.target.value)}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <IconButton onClick={search}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
          }}
        />
      </Box>
      <MapPreviewList maps={list} />
      {!nomore &&
        <CoverProgress loading={loading} m={1}>
          <Button onClick={loadMore} disabled={loading} fullWidth>
            <FormattedMessage id="label.loadmore" />
          </Button>
        </CoverProgress>}
      {nomore && list.length === 0 &&
        <Box m={2} textAlign="center">
          <Typography variant="h6">
            <FormattedMessage id="info.noresult" />
          </Typography>
        </Box>}
    </>
  ))
}
