import React from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { Api } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { MapInfo } from "../../Global/Modals"
import { Typography, Button, TextField, Box, IconButton, InputAdornment } from "@material-ui/core"
import { MapPreviewList } from "../Components/MapItem"
import { CoverProgress } from "../Components/CoverProgress"
import { FormattedMessage } from "react-intl"
import SearchIcon from '@material-ui/icons/Search'
import { findex } from "../../Mapping/core/Utils"

const Search = async (key: string, end?: string) => {
  try {
    const res = await Api.get<MapInfo[]>("map/search", { params: { key, end } })
    return res.data
  } catch (error) {
    setMessage("error.neterr", "error")
    return []
  }
}

export const SearchPage = () => {

  const s = useLocalStore(() => ({
    key: "",
    searchingkey: "",
    end: undefined as undefined | string,
    loading: false,
    list: [] as MapInfo[],
    nomore: false,
  }))

  const loadMore = async () => {
    if (s.searchingkey.trim() === "") return
    s.loading = true
    const end = findex(s.list, -1)
    const res = await Search(s.searchingkey, end && end.reviewed)
    s.loading = false
    s.list.push(...res)
    s.list = s.list.splice(0)
    if (res.length === 0) s.nomore = true
  }

  const search = async () => {
    s.searchingkey = s.key
    await loadMore()
  }

  return useObserver(() => (
    <Box p={1}>
      <Typography variant="h5">Search</Typography>
      <Box display="flex" p={1}>
        <TextField style={{ flexGrow: 1 }} value={s.key}
          onChange={e => s.key = e.target.value}
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
      <MapPreviewList maps={s.list} />
      {!s.nomore &&
        <CoverProgress loading={s.loading} m={1}>
          <Button onClick={loadMore} disabled={s.loading} fullWidth>
            <FormattedMessage id="label.loadmore" />
          </Button>
        </CoverProgress>}
      {s.nomore && s.list.length === 0 &&
        <Box m={2} textAlign="center">
          <Typography variant="h6">
            <FormattedMessage id="info.noresult" />
          </Typography>
        </Box>}
    </Box>
  ))
}
