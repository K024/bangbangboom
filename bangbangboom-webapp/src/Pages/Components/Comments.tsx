import React, { useEffect } from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { Box, Grid, Divider, Card, TextField, Button, Link } from "@material-ui/core"
import { CommentInfo } from "../../Global/Modals"
import { Api, Xform } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { UserProfile, UserName } from "./UserProfile"
import { DateTime } from "./DateTime"
import { FormattedMessage } from "react-intl"
import { UserState } from "../UserState"
import { CoverProgress } from "./CoverProgress"
import { CanNone } from "./CanNone"

type CommentInfoEx = CommentInfo & {
  chrildren: CommentInfoEx[]
  parent: CommentInfoEx
}

function process(comments: CommentInfoEx[]) {
  const list = [] as CommentInfoEx[]
  const root = new Set<CommentInfoEx>()
  const map = new Map<number, CommentInfoEx>()
  comments.forEach(c => {
    if (!c.chrildren) c.chrildren = []
    map.set(c.id, c)
    if (!c.parentcommentid) {
      list.push(c)
      root.add(c)
    } else {
      const parent = map.get(c.parentcommentid)
      if (!parent) throw new Error("No parent comment")
      Object.defineProperty(c, "parent", {
        get() { return parent }
      })
      let r = parent
      while (!root.has(r)) {
        if (!r) throw new Error("No parent comment")
        r = r.parent
      }
      r.chrildren.push(c)
    }
  })
  return list
}

export const Comments = ({ id }: { id: string }) => {

  const s = useLocalStore(() => ({
    loading: false,
    comments: () => [] as CommentInfoEx[],

    reply: null as null | CommentInfoEx,
    content: "",

    async load() {
      s.loading = true
      s.reply = null
      try {
        const res = await Api.get<CommentInfoEx[]>("comment/map", { params: { mapid: id } })
        const data = process(res.data)
        s.comments = () => data
      } catch (error) {
        if (error instanceof Error) throw error
        setMessage("error.neterr", "error")
      }
      s.loading = false
    }
  }))

  useEffect(() => {
    s.load()
  }, [s])

  const handleComment = async () => {
    s.loading = true
    try {
      await Api.post("comment/send", Xform({
        mapid: id,
        replyid: (s.reply && s.reply.id) || undefined,
        comment: s.content
      }))
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    await s.load()
    s.loading = false
  }

  const handleDelete = async (e: React.SyntheticEvent, c: CommentInfoEx) => {
    e.preventDefault()
    e.stopPropagation()
    s.loading = true
    try {
      await Api.post("comment/delete", Xform({
        id: c.id
      }))
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    await s.load()
    s.loading = false
  }

  return useObserver(() =>
    <Box p={2}>
      {s.comments().map(root =>
        <React.Fragment key={root.id}>
          <Divider />
          <Box py={1}><Grid container spacing={2}
            onClick={() => s.reply = s.reply === root ? null : root}>
            <Grid item>
              <UserProfile user={root.user} />
            </Grid>
            <Grid item xs>
              <Grid container>
                <Grid item>
                  <UserName user={root.user} />
                </Grid>
                <Grid item xs></Grid>
                <Grid item>
                  <DateTime date={root.datetime} />
                </Grid>
              </Grid>
              <CanNone value={root.content} />
              {UserState.user && root.user.username === UserState.user.username &&
                <Box textAlign="right">
                  <Link onClick={(e: any) => handleDelete(e, root)}>
                    <FormattedMessage id="label.delete" />
                  </Link>
                </Box>}
              {root.chrildren.map(c =>
                <React.Fragment key={c.id}>
                  <Divider />
                  <Box p={1}>
                    <Grid container spacing={2}
                      onClick={e => { e.stopPropagation(); s.reply = s.reply === c ? null : c }}>
                      <Grid item>
                        <UserProfile user={c.user} />
                      </Grid>
                      <Grid item xs>
                        <Grid container>
                          <Grid item>
                            <UserName user={c.user} />
                          </Grid>
                          <Grid item xs></Grid>
                          <Grid item>
                            <DateTime date={c.datetime} />
                          </Grid>
                        </Grid>
                        {c.parent !== root &&
                          <Card>Re: <UserName user={c.parent.user} /></Card>}
                        <CanNone value={c.content} />
                        {UserState.user && c.user.username === UserState.user.username &&
                          <Box textAlign="right">
                            <Link onClick={(e: any) => handleDelete(e, c)}>
                              <FormattedMessage id="label.delete" />
                            </Link>
                          </Box>}
                      </Grid>
                    </Grid>
                  </Box>
                </React.Fragment>)}
            </Grid>
          </Grid>
          </Box>
        </React.Fragment>)}

      {UserState.user && <>
        {s.reply && <Box onClick={() => s.reply = null}>
          Re: <UserName user={s.reply.user} /> : {s.reply.content}
        </Box>}
        <TextField fullWidth value={s.content} onChange={e => s.content = e.target.value} />
        <Box p={2}>
          <Grid container justify="flex-end">
            <Grid item>
              <CoverProgress loading={s.loading}>
                <Button disabled={!s.content || s.loading || s.content.length > 200}
                  onClick={handleComment}><FormattedMessage id="label.comment" /></Button>
              </CoverProgress>
            </Grid>
          </Grid>
        </Box>
      </>}
    </Box>)
}
