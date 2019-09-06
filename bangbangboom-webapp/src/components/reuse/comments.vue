<template>
    <div>
        <div v-for="(c, i) in comments" :key="c.id" :class="{gray: i%2===0}">
            <md-divider v-if="i!==0"></md-divider>
            <div class="comment-item">
                <user class="user" :user="c.user"></user>
                <div class="comment-content">
                    <div class="flex">
                        <date-time :time="c.datetime"></date-time>
                        <div class="flex right">
                            {{c.like==0&&c.dislike==0?'':c.like-c.dislike}}
                            <md-button
                                class="md-icon-button md-dense"
                                :class="{'md-accent':mylikedislikes.get(c.id)===true}"
                                @click="dislike(c)"
                            >
                                <md-icon>thumb_down</md-icon>
                            </md-button>
                            <md-button
                                class="md-icon-button md-dense"
                                :class="{'md-primary':mylikedislikes.get(c.id)===false}"
                                @click="like(c)"
                            >
                                <md-icon>thumb_up</md-icon>
                            </md-button>
                        </div>
                    </div>
                    <div v-if="c.locked">{{$t('l.commentLocked')}}</div>
                    <div v-else>{{c.content}}</div>
                    <div class="flex right">
                        <span class="reply" @click="replycomment(c)">{{$t('w.reply')}}</span>
                    </div>
                    <div>
                        <div v-for="s in c.children" :key="s.id">
                            <md-divider></md-divider>
                            <div class="comment-item">
                                <user class="user" :user="s.user"></user>
                                <div class="comment-content">
                                    <div class="flex">
                                        <date-time :time="s.datetime"></date-time>
                                        <div class="flex right">
                                            {{s.like==0&&s.dislike==0?'':s.like-s.dislike}}
                                            <md-button
                                                class="md-icon-button md-dense"
                                                :class="{'md-accent':mylikedislikes.get(s.id)===true}"
                                                @click="dislike(s)"
                                            >
                                                <md-icon>thumb_down</md-icon>
                                            </md-button>
                                            <md-button
                                                class="md-icon-button md-dense"
                                                :class="{'md-primary':mylikedislikes.get(s.id)===false}"
                                                @click="like(s)"
                                            >
                                                <md-icon>thumb_up</md-icon>
                                            </md-button>
                                        </div>
                                    </div>
                                    <div v-if="s.reply" class="ellipsis re">Re: {{s.reply.content}}</div>
                                    <div v-if="s.locked">{{$t('l.commentLocked')}}</div>
                                    <div v-else>{{s.content}}</div>
                                    <div class="flex right">
                                        <span class="reply" @click="replycomment(s)">{{$t('w.reply')}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fill-w flex center">
            <div class="md-display-1" v-if="loaded&&comments.length===0">{{$t('w.reply')}}</div>
        </div>
        <div v-if="reply" style="margin-top: 10px;">
            <div v-if="reply" class="ellipsis re">Re: {{reply.content}}</div>
            <div class="flex right">
                <div class="reply" @click="reply=null">{{$t('w.cancel')}}</div>
            </div>
        </div>
        <md-field>
            <label>{{reply?"Reply":"Comment"}}</label>
            <md-textarea v-model="comment" md-counter="200"></md-textarea>
        </md-field>
        <div class="flex right" ref="comment">
            <md-button :disabled="!comment || comment.length > 200" @click="send()">{{$t('w.send')}}</md-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import api, { Xform } from "../../tools/Axios";
import { AppUserShort, CommentDetail } from "../../tools/models";
import { userstate } from "../account/state";
import { MyLikeDislikeInfo } from "../../tools/models";

type ParentComment = CommentDetail & {
    children: ReplyComment[];
};
type ReplyComment = CommentDetail & {
    reply: CommentDetail | undefined;
};

function ListComment(list: CommentDetail[]) {
    const l = [] as ParentComment[];
    for (const c of list) {
        if (c.parentcommentid) {
            const p = l.find(x => x.id === c.parentcommentid);
            if (p) {
                p.children.push({ ...c, reply: undefined });
            } else {
                for (const pa of l) {
                    const re = pa.children.find(
                        x => x.id === c.parentcommentid
                    );
                    if (re) {
                        pa.children.push({ ...c, reply: re });
                        break;
                    }
                }
            }
        } else {
            const p = { ...c, children: [] };
            l.push(p);
        }
    }
    return l;
}

export default Vue.extend({
    props: {
        mapid: { type: Number, required: true }
    },
    data() {
        return {
            comments: [] as ParentComment[],
            mylikedislikes: new Map<number, boolean>(),
            loaded: false,
            comment: "",
            reply: null as CommentDetail | null,
            sending: false
        };
    },
    methods: {
        async load() {
            try {
                const res = await api.get<CommentDetail[]>("comment/map", {
                    params: { mapid: this.mapid }
                });
                this.comments = ListComment(res.data);
                if (userstate.loginstate) {
                    const res2 = await api.get<MyLikeDislikeInfo[]>(
                        "comment/mylikedislikes",
                        { params: { mapid: this.mapid } }
                    );
                    this.mylikedislikes = new Map<number, boolean>();
                    for (const i of res2.data) {
                        this.mylikedislikes.set(i.id, i.isdislike);
                    }
                }
                this.loaded = true;
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string );
            }
        },
        async send() {
            try {
                this.sending = true;
                await api.post(
                    "comment/send",
                    Xform({
                        mapid: this.mapid,
                        replyid: this.reply ? this.reply.id : undefined,
                        comment: this.comment
                    })
                );
                this.load();
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string );
            } finally {
                this.sending = false;
            }
        },
        replycomment(c: CommentDetail) {
            if (this.reply === c) this.reply = null;
            else {
                this.reply = c;
                (this.$refs.comment as HTMLElement).scrollIntoView();
            }
        },
        async like(c: CommentDetail) {
            try {
                this.sending = true;
                const ld = this.mylikedislikes.get(c.id);
                if (ld === false) {
                    this.mylikedislikes.delete(c.id);
                    await api.post("comment/cancellike", Xform({ id: c.id }));
                } else {
                    this.mylikedislikes.set(c.id, false);
                    await api.post("comment/like", Xform({ id: c.id }));
                }
                this.load();
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string );
            } finally {
                this.sending = false;
            }
        },
        async dislike(c: CommentDetail) {
            try {
                this.sending = true;
                const ld = this.mylikedislikes.get(c.id);
                if (ld === true) {
                    this.mylikedislikes.delete(c.id);
                    await api.post("comment/cancellike", Xform({ id: c.id }));
                } else {
                    this.mylikedislikes.set(c.id, true);
                    await api.post("comment/dislike", Xform({ id: c.id }));
                }
                this.load();
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string );
            } finally {
                this.sending = false;
            }
        }
    },
    mounted() {
        this.load();
    }
});
</script>

<style scoped>
.comment-item {
    display: flex;
    align-items: flex-start;
    position: relative;
}
.comment-content {
    flex-grow: 1;
}
.right {
    justify-content: flex-end;
    flex-grow: 1;
}
.user {
    margin: 10px 10px 0 0;
}
.md-divider {
    margin: 5px;
}
.reply {
    color: gray;
    transition: color 0.3s;
    cursor: pointer;
}
.reply:hover {
    color: #4488ff;
}
.date {
    color: gray;
}
.re {
    padding: 3px 8px;
    border-radius: 3px;
    background: rgba(214, 214, 214, 0.275);
    color: rgb(143, 143, 143);
}
</style>
