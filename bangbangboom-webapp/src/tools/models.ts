
export class AccountInfo {
    username = ''
    email = ''
    roles = [] as string[]
}

export class AppUserShort {
    username = ''
    nickname = ''
}

export class AppUserDetailed {
    username = ''
    nickname = ''
    whatsup = ''
    hasprofile = false
    uploadedmusics = ''
    uploadedmaps = ''
}

export class CommentDetail {
    id = 0
    mapid = 0
    user = new AppUserShort()
    parentcommentid?: number
    datetime = ''
    content = ''
    locked = false
    like = 0
    dislike = 0
}

export class MusicShort {
    id = 0
    uploader = new AppUserShort()
    title = ''
    titleunicode = ''
    artist = ''
    artistunicode = ''
    locked = false
    date = ''
}

export class MusicDetailed {
    id = 0
    uploader = new AppUserShort()
    title = ''
    titleunicode = ''
    artist = ''
    artistunicode = ''
    description = ''
    mapscount = 0
    locked = false
    date = ''
}

export class MapShort {
    id = ''
    mapname = ''
    difficulty = 0
    proved = false
    rate = 0
    plays = 0
    music = new MusicShort()
    uploader = new AppUserShort()
    locked = false
}

export class RateDetail {
    r1 = 0
    r2 = 0
    r3 = 0
    r4 = 0
    r5 = 0
}

export class MapDetailed {
    id = 0
    mapname = ''
    difficulty = 0
    proved = false
    description = ''
    rate = new RateDetail()
    plays = 0
    date = ''
    lastmodified = ''
    music = new MusicDetailed()
    uploader = new AppUserShort()
    locked = false
}


export class ReportDetail {
    id = 0
    date = ''
    from = ''
    type = ''
    target = ''
    reason = ''
    handled = false
    handledby = new AppUserShort()
    additional?: string
    lastmodified = ''
}
