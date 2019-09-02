<template>
    <div>
        <div v-for="c in comments" :key="c.id">
            <div>{{c.user.nickname}}@{{c.user.username}}</div>
            <div>{{c.datetime}}</div>
            <div v-if="c.locked">Comment locked</div>
            <div v-else>{{c.content}}</div>
            <div>likes:{{c.like}} dislikes:{{c.dislike}}</div>
            <div>
                <div v-for="s in c.children" :key="s.id">
                    <div>{{s.user.nickname}}@{{s.user.username}}</div>
                    <div>{{s.datetime}}</div>
                    <div v-if="s.locked">Comment locked</div>
                    <div v-if="s.reply">Re: {{s.user.nickname}} : {{s.reply.content}}</div>
                    <div v-else>{{s.content}}</div>
                    <div>likes:{{s.like}} dislikes:{{s.dislike}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import api from "../../tools/Axios";
import { AppUserShort, CommentDetail } from "@/tools/models";

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
        mapid: { type: String, required: true }
    },
    data() {
        return {
            comments: [] as ParentComment[]
        };
    },
    methods: {
        async load() {
            try {
                const res = await api.get<CommentDetail[]>("comment/map", {
                    params: { mapid: this.mapid }
                });
                this.comments = ListComment(res.data);
            } catch (error) {
                this.$toasted.error("Error: something wrong, please retry");
            }
        }
    }
});
</script>

<style scoped>
</style>
