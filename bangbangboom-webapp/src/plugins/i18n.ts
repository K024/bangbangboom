import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
    en: {
        w: {
            search: 'Search',
            ranking: 'Ranking',
            favorites: 'Favorites',
            mapping: 'Mapping',
            login: 'Login',
            register: 'Register',
            forgotpass: 'Forgot password',
            username: 'Username',
            password: 'Password',
            email: 'Email',
            available: 'Available',
            confirm: 'Confirm',
            account: 'Account',
            logout: 'Logout',
            more: 'More...',
            Reply: 'Reply',
            reply: 'reply',
            cancel: 'cancel',
            send: 'send',
            edit: 'edit',
            musics: 'Musics',
            settings: 'Settings',
            home: 'home',
            description: 'Description',
            loading: 'Loading',
            info: 'Info',
            maps: 'Maps',
            admin: 'Admin',
            difficulty: 'Difficulty',
            submit: 'submit',
            title: 'Title',
            artist: 'Artist',
            speed: 'Speed',
            uploaded: 'uploaded',
            updated: 'updated',
            Comment: 'Comment',
            shortcut: 'Shortcut',
            None: 'None',
            Delete: 'Delete',
            follow: 'Follow',
            Triplet: 'Triplet',
            local: 'Local',
            beatDivision: 'Beat division',
            MusicSource: 'Music source',
            MusicId: 'By Music id (check from the musics page)',
            load: 'Load',
            modify: 'Modify',
            addnew: 'Add new',
            meta: "Meta",
            timing: "Timing",
            mirror: "Mirror",
        },
        l: {
            register: 'Register:',
            resetpass: 'Reset your password:',
            forgotpass: 'Forgot your password:',
            noProfile: 'No Profile',
            uploadProfile: 'Upload Profile',
            nickName: 'Nick name',
            whatsUp: 'whats up',
            uploadMap: 'Upload Map',
            uploadMusic: 'Upload Music',
            commentLocked: 'Comment locked',
            noComment: 'No Comment',
            changeImg: 'Change image',
            updateMapContent: 'Update map content',
            lastModified: 'Last modified',
            noUploadedMap: 'No Uploaded Map',
            noUploadedMusic: 'No Uploaded Music',
            noFavorite: 'No Favorite',
            mapName: 'Map name',
            mapNameAscii: 'Map name (only ascii charactors)',
            imageFile: 'Image File',
            musicId: 'Music id',
            mapDescription: 'Map Description',
            uploadedAt: 'uploaded at',
            mapsCount: 'Maps count',
            titleUnicode: 'Title unicode',
            artistUnicode: 'Artist unicode',
            noResult: 'No result',
            musicFile: 'Music File',
            musicTitleAscii: 'Music title (only ascii charactors)',
            musicTitleUnicode: 'Music title unicode',
            artistAscii: 'Artist (only ascii charactors)',
            visualOffset: 'Visual Offset',
            judgeOffset: 'Judge Offset',
            noteScale: 'Note Scale',
            barOpacity: 'Bar Opacity',
            backgroundDim: 'Background Dim',
            pleaseLogin: 'Please login',
            notRecommended: 'Not recommended',
            lowerPerformance: 'Lower performance',
            BackgroundCover: 'Background cover',
            BackgroundImage: 'Background image',
            halfspeed: 'Half speed',
            timepoints: 'Time points',
            meter: "Meter",
            timeoffset: "Time offset",
            moveonebeat: 'Move one beat',
            settocurrent: 'Set to current time',
            muteticker: 'Mute ticker',
            testplay: 'Test play',
        },
        s: {
            checking: 'Checking...',
            emialregistered: 'The email has been registered',
            usernameregistered: 'The user name has been registered',

            enterpass: 'Enter your password here',
            validpass: 'Require 8-digit alphanumeric password',
            enterpass2: 'Enter your password again',

            sentemail: 'An email has been sent to your address. Please follow the email to complete the remaining steps.',

            registersuccess: 'Register successfully',
            resetpasssuccess: 'Reset password successfully',

            pleaselogin: 'Please login first',

            neterror: "An error occurred with network connection",

            notfound: "Page not found",

            mapUploadNotice: "Notice: Map content will be loaded from local storage saved from mapping page",

            notSupportAudio: "Your browser does not support the audio element.",

            showSongNameInOLanguage: "Show song name in original language",

            toastedError: "Error: something wrong, please retry",

            localStorageEmpty: 'Local storage is empty',

            userNameOrPasswordWrong: 'Username or password is wrong',

            accountLockOut: 'Account locked out',

            emailNotConfirmed: 'Email not confirmed',

            emailNotFound: "Email not found",

            pleaseRefresh: "Please refresh this page",

            downloadcurrentmap: 'Download current game map',

            loadmapfile: 'Load map file (need to refresh this page)',

            loadbsmap: 'Load Bang! Simulator map file (testing function, need to refresh)',

            clearmap: 'Clear current map (need to refresh this page)',

            hitorpresstomeasure: "Hit here or press \'t\' 5 times and more to measure",

            selectorcreatetp: "Select or create a time point first",

            savedinbrowser: 'Saved in browser',

            mapinlargerdevice: 'Mapping is recommended in larger devices',

            maploaded: "Map loaded, please refresh",

            convertfailed: "Convert failed",
        },
        c: {
            minutesago: 'less than 1 munite ago | 1 minute ago | {n} minutes ago',
            hoursago: 'less than 1 hour ago | 1 hour ago | {n} hours ago',
        }
    },
    zh: {
        w: {
            search: '搜索',
            ranking: '排行',
            favorites: '收藏',
            mapping: '作图',
            login: '登录',
            register: '注册',
            forgotpass: '忘记密码',
            username: '用户名',
            password: '密码',
            email: '邮箱',
            available: '可用',
            confirm: '确认',
            account: '个人账户',
            logout: '登出',
            more: '更多...',
            Reply: '回复',
            reply: '回复',
            cancel: '取消',
            send: '发送',
            edit: '编辑',
            musics: '音乐',
            settings: '设置',
            home: '主页',
            description: '描述',
            loading: '加载中',
            info: '信息',
            maps: '谱面',
            admin: '管理员',
            difficulty: '难度',
            submit: '提交',
            title: '标题',
            artist: '艺术家',
            speed: '速度',
            uploaded: '已上传',
            updated: '已更新',
            Comment: '评论',
            shortcut: '快捷键',
            None: '无',
            Delete: '删除',
            follow: '跟随',
            Triplet: '三连音',
            beatDivision: '节拍细分',
            MusicSource: '音乐源',
            local: '本地',
            MusicId: '音乐 id (从音乐页面查看)',
            load: '加载',
            modify: '修改',
            addnew: '添加',
            meta: "通用",
            timing: "时间轴",
            mirror: "镜像",
        },
        l: {
            register: '注册:',
            resetpass: '重置密码:',
            forgotpass: '忘记密码:',
            noProfile: '没有头像',
            uploadProfile: '上传头像',
            nickName: '昵称',
            whatsUp: '个人签名',
            uploadMap: '上传谱面',
            uploadMusic: '上传音乐',
            commentLocked: '评论被锁定',
            noComment: '无回复',
            changeImg: '更改图片',
            updateMapContent: '更新谱面内容',
            lastModified: '上次更改',
            noUploadedMap: '没有上传的谱面',
            noUploadedMusic: '没有上传的音乐',
            noFavorite: '没有收藏',
            mapName: '谱面名',
            mapNameAscii: '谱面名 (仅限ascii字符)',
            imageFile: '图片文件',
            musicId: '音乐id',
            mapDescription: '谱面详情',
            uploadedAt: '上传于',
            mapsCount: '谱面数量',
            titleUnicode: '标题unicode',
            artistUnicode: '艺术家unicode',
            noResult: '无结果',
            musicFile: '音乐文件',
            musicTitleAscii: '音乐名(仅限ascii字符)',
            musicTitleUnicode: '音乐名unicode',
            artistAscii: '艺术家(仅限ascii字符)',
            visualOffset: '视觉偏移',
            judgeOffset: '判定偏移',
            noteScale: '音符大小',
            barOpacity: '长条不透明度',
            backgroundDim: '背景暗化',
            pleaseLogin: '请登录',
            notRecommended: '不推荐',
            lowerPerformance: '较低性能',
            BackgroundCover: '背景覆盖',
            BackgroundImage: '背景图片',
            halfspeed: '半速',
            timepoints: '计时点',
            meter: "拍号",
            timeoffset: "偏移时间",
            moveonebeat: '移动一拍',
            settocurrent: '设为现在时间',
            muteticker: '节拍器静音',
            testplay: '测试播放',
        },
        s: {
            checking: '检察中...',
            emialregistered: '邮箱已注册',
            usernameregistered: '用户名已注册',

            enterpass: '请输入密码',
            validpass: '需要8位数字字母混合密码',
            enterpass2: '请再次输入密码',

            sentemail: '邮件已发送，请检查邮件完成剩余步骤',

            registersuccess: '注册成功',
            resetpasssuccess: '重置密码成功',

            pleaselogin: '请先登录',

            neterror: "网络连接故障",

            notfound: "页面不存在",

            mapUploadNotice: "注意: 谱面内容将从作谱页面的本地存储地址中加载",

            notSupportAudio: "您的浏览器不支持audio元素。",

            showSongNameInOLanguage: "以原本语言显示歌曲名",

            toastedError: "错误: 有什么出错了, 请重试",

            localStorageEmpty: '本地存储为空',

            userNameOrPasswordWrong: '用户名或密码错误',

            accountLockOut: '账户已锁定',

            emailNotConfirmed: '邮箱未验证',

            emailNotFound: "邮箱未找到",

            pleaseRefresh: "请刷新当前页面",

            downloadcurrentmap: '下载当前谱面',

            loadmapfile: '加载谱面文件 (需要刷新页面)',

            loadbsmap: '加载Bang! Simulator铺面文件 (测试功能, 需要刷新页面)',

            clearmap: '清除谱面 (需要刷新页面)',

            hitorpresstomeasure: "点击这里或者按 \'t\' 5次以上进行测量",

            selectorcreatetp: "请先选择或创建计时点",

            savedinbrowser: '已保存在浏览器中',

            mapinlargerdevice: '推荐在更大的设备上作图',

            maploaded: "谱面已加载，请刷新页面",

            convertfailed: "转换失败",
        },
        c: {
            minutesago: '不到1分钟前 | 1分钟前 | {n}分钟前',
            hoursago: '不到1小时前 | 1小时前 | {n}小时前',
        }
    },
    ja: {
        w: {
            search: '検索',
            ranking: 'ランキング',
            favorites: 'お気に入り',
            mapping: 'マッピング',
            login: 'ログイン',
            register: '新規登録',
            forgotpass: '忘れた',
            username: 'ユーザー名',
            password: 'パスワード',
            email: 'メール',
            available: '利用可能',
            confirm: '確認',
            account: 'アカウント',
            logout: 'ログアウト',
            more: 'もっと...',
            Reply: '返事',
            reply: '返事',
            cancel: 'キャンセル',
            send: '送る',
            edit: '編集する',
            musics: '音楽',
            settings: '設定',
            home: 'ホームページ',
            description: '説明',
            loading: '読み込み中',
            info: '情報',
            maps: '譜面',
            admin: '管理者',
            difficulty: '難易',
            submit: '提出する',
            title: 'タイトル',
            artist: 'アーティスト',
            speed: '速度',
            uploaded: 'アップロードしました',
            updated: '更新しました',
            Comment: 'コメント',
            shortcut: 'ショートカットキー',
            None: '無し',
            Delete: '消す',
            follow: '従う',
            Triplet: 'トリプレット',
            beatDivision: 'ビート分割',
            MusicSource: '音楽ソース',
            local: 'ローカル',
            MusicId: 'ミュージック id (音楽ページで確認してください)',
            load: 'ロード',
            modify: '修正する',
            addnew: '追加する',
            meta: "メタ",
            timing: "タイムライン",
            mirror: "ミラー",
        },
        l: {
            register: '新規登録:',
            resetpass: 'パスワードをリセットする:',
            forgotpass: 'パスワードを忘れてしまった:',
            noProfile: 'アバターがない',
            uploadProfile: 'アバターをアップロードする',
            nickName: 'ニックネーム',
            whatsUp: '個人プロフィールデータ',
            uploadMap: '譜面をアップロードする',
            uploadMusic: 'ミュージックをアップロードする',
            commentLocked: 'コメントはロックされています',
            noComment: '返事がない',
            changeImg: '画像を変更',
            updateMapContent: '譜面内容を更新する',
            lastModified: '最終更新日',
            noUploadedMap: 'アップロードされた譜面はありません',
            noUploadedMusic: 'アップロードされた音楽はありません',
            noFavorite: 'お気に入りなし',
            mapName: '譜面名',
            mapNameAscii: '譜面名(アスキー文字のみ)',
            imageFile: '画像ファイル',
            musicId: '音楽id',
            mapDescription: '譜面説明',
            uploadedAt: 'アップロード時間',
            mapsCount: '譜面数',
            titleUnicode: 'タイトルunicode',
            artistUnicode: 'アーティストunicode',
            noResult: '検索結果はありません',
            musicFile: '音楽ファイル',
            musicTitleAscii: '音楽名(アスキー文字のみ)',
            musicTitleUnicode: '音楽名unicode',
            artistAscii: 'アーティスト(アスキー文字のみ)',
            visualOffset: '視覚的オフセット',
            judgeOffset: 'ジャッジオフセット',
            noteScale: '音符大きさ',
            barOpacity: 'バー不透明度',
            backgroundDim: '背景暗化',
            pleaseLogin: 'ログインしてください',
            notRecommended: '推奨しません',
            lowerPerformance: '低いパフォーマンス',
            BackgroundCover: '覆うバックグラウンド',
            BackgroundImage: '背景画像',
            halfspeed: '半速',
            timepoints: 'タイミングポイント',
            meter: "拍子",
            timeoffset: "オフセット時間",
            moveonebeat: '一拍動く',
            settocurrent: '現在の時刻に設定',
            muteticker: 'メトロノームをミュートする',
            testplay: 'テストプレイ',
        },
        s: {
            checking: '検察中...',
            emialregistered: 'メールが登録されました',
            usernameregistered: 'ユーザー名が登録されました',

            enterpass: 'パスワードを入力ください',
            validpass: '8桁の英数字パスワードが必要',
            enterpass2: '繰り返し',

            sentemail: 'メールが送信されました。メールに従って残りの手順を完了してください。',

            registersuccess: '新規登録成功した',
            resetpasssuccess: 'パスワードをリセットした',

            pleaselogin: 'ログインしてください',

            neterror: "ネット接続エラーが発生しました",

            notfound: "ページが見つかりません",

            mapUploadNotice: "ご注意: 譜面コンテンツは、マッピングページから保存されたローカルストレージからロードされます",

            notSupportAudio: "お使いのブラウザはオーディオ要素をサポートしていません。",

            showSongNameInOLanguage: "元の言語で曲名を表示する",

            toastedError: "エラー：何か問題があります。再試行してください",

            localStorageEmpty: 'ローカルストレージが空です',

            userNameOrPasswordWrong: 'ユーザー名またはパスワードが間違っています',

            accountLockOut: 'アカウントはロックされています',

            emailNotConfirmed: 'メールボックスは検証されません',

            emailNotFound: "メールが見つかりません",

            pleaseRefresh: "ページを更新してください",

            downloadcurrentmap: '現在のマップをダウンロードする',

            loadmapfile: 'マップファイルの読み込み（ページを更新する必要がある）',

            loadbsmap: 'Bang! Simulatorマップファイルの読み込み（テスト機能、ページを更新する必要がある）',

            clearmap: '現在のマップをクリアする （ページを更新する必要がある）',

            hitorpresstomeasure: "ここを押すか、「t」を5回以上押して測定します",

            selectorcreatetp: "先ずはタイムポイントを選択または作成してください",

            savedinbrowser: 'ブラウザに保存されました',

            mapinlargerdevice: '大きなデバイスではマッピングが推奨されます',

            maploaded: "譜面がロードされました。ページを更新してください",

            convertfailed: "変換に失敗しました",
        },
        c: {
            minutesago: '1分未満 | 1分前 | {n}分前',
            hoursago: '1時間未満前 | 1時間前 | {n}時間前',
        }
    },
}

const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages,
})

Vue.use(VueI18n)

export default i18n
