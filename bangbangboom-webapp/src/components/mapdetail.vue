<template>
    <div>
        <template v-if="loaded">
            <div class="image" @click="$router.push('/play/'+mapdetail.id)">
                <md-ripple>
                    <img v-lazy="'/api/map/image/' + mapdetail.id" />
                    <div class="play flex center">
                        <md-icon class="md-size-3x" style="color: white">play_circle_filled</md-icon>
                    </div>
                </md-ripple>
                <md-content class="modify" v-if="canedit" md-theme="dark">
                    <div class="flex">
                        <md-button class="fill-w dark-bg" @click.stop="uploadNewImage">{{$t('l.changeImg')}}</md-button>
                    </div>
                    <div class="flex">
                        <md-button class="fill-w dark-bg" @click.stop="dialog=true">{{$t('l.updateMapContent')}}</md-button>
                    </div>
                </md-content>
            </div>
            <md-dialog-confirm
                :md-active.sync="dialog"
                md-content="Are you sure to update map content from current local storage?"
                md-confirm-text="Yes"
                md-cancel-text="No"
                @md-confirm="updateMapContent"
            />
            <div class="container">
                <editable
                    :label="$t('l.musicId')"
                    :default="''+mapdetail.music.id"
                    :handler="createhandler('musicid')"
                    :enabled="!!canedit"
                    autowidth
                >
                    <music-title
                        @click.native="$router.push('/music/'+mapdetail.music.id)"
                        class="md-display-1 md-headline title"
                        :music="mapdetail.music"
                    ></music-title>
                </editable>
                <music-artist class="md-title md-headline" :music="mapdetail.music"></music-artist>
                <div class="flex end">
                    <div class="flex m-right">
                        <md-icon>music_note</md-icon>
                        <editable
                            :label="$t('w.difficulty')"
                            :default="''+mapdetail.difficulty"
                            :handler="createhandler('difficulty')"
                            :enabled="!!canedit"
                            autowidth
                        >{{mapdetail.difficulty}}</editable>
                    </div>
                    <div class="flex m-right">
                        <md-icon>play_circle_filled</md-icon>
                        {{mapdetail.plays}}
                    </div>
                    <div class="flex">
                        <md-button class="md-icon-button md-dense" @click="favorite">
                            <md-icon style="color: #ff3939" v-if="isfavorite">favorite</md-icon>
                            <md-icon v-else>favorite_border</md-icon>
                        </md-button>
                    </div>
                </div>
                <div class="md-layout md-gutter" style="margin: 10px 0">
                    <div class="md-layout-item md-xsmall-size-100 md-small-size-50">
                        <div class="flex">
                            <user :user="mapdetail.uploader" class="m-right"></user>
                            <editable
                                :label="$t('l.mapName')"
                                :default="mapdetail.mapname"
                                :handler="createhandler('mapname')"
                                :enabled="!!canedit"
                                maxlength="100"
                                style="width:auto"
                            >
                                <div>{{mapdetail.mapname}}</div>
                            </editable>
                        </div>
                        <div class="flex" style="margin-top: 10px">
                            <div>{{$t('l.lastModified')}}:</div>
                            <date-time :time="mapdetail.lastmodified"></date-time>
                        </div>
                    </div>
                    <div class="md-layout-item md-xsmall-size-100 md-small-size-50">
                        <rate :rate="mapdetail.rate" :myrate="myrate" @rate="rate"></rate>
                    </div>
                </div>
                <div class="md-subheading">{{$t('w.description')}}:</div>
                <editable
                    :label="$t('l.mapDescription')"
                    :default="mapdetail.description"
                    :handler="createhandler('description')"
                    :enabled="!!canedit"
                    maxlength="100"
                    block
                >
                    <div style="margin: 10px 0">{{mapdetail.description}}</div>
                </editable>
                <comments :mapid="mapdetail.id"></comments>
            </div>
        </template>
        <not-found v-else-if="notfound"></not-found>
        <div v-else>{{$t('w.loading')}}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import notFound from "./others/notfound.vue";
import { MapDetailed, MyRateInfo } from "../tools/models";
import rate from "./reuse/rate.vue";
import comments from "./reuse/comments.vue";
import { userstate } from "./account/state";
import api, { Xform, HandleErr, Form } from "@/tools/Axios";

export default Vue.extend({
    components: {
        notFound,
        rate,
        comments
    },
    data() {
        return {
            mapdetail: new MapDetailed(),
            loaded: false,
            notfound: false,
            myrate: undefined as number | undefined,
            isfavorite: false,
            dialog: false
        };
    },
    computed: {
        canedit(): string {
            if (!userstate.loginstate) return "";
            if (
                this.mapdetail.uploader.username ===
                userstate.currentuser.username
            )
                return "user";
            if (userstate.currentuser.roles.indexOf("admin") >= 0)
                return "admin";
            return "";
        }
    },
    methods: {
        async load() {
            const id = Number.parseInt(this.$route.params.id);
            if (isNaN(id)) this.$router.replace("/");
            try {
                const res = await api.get<MapDetailed>("map/info", {
                    params: { id }
                });
                this.mapdetail = res.data;
                this.loaded = true;
                if (userstate.loginstate) {
                    const res2 = await api.get<MyRateInfo>("map/myrate", {
                        params: { id }
                    });
                    if (res2.data.rated) this.myrate = res2.data.score;
                    else this.myrate = undefined;
                    this.isfavorite = res2.data.favorite;
                }
            } catch (error) {
                const res = HandleErr(error);
                if (!res)
                    this.$toasted.error(this.$t("s.toastedError") as string);
                else if (res.status === 404) this.notfound = true;
            }
        },
        async rate(r: number) {
            try {
                if (userstate.loginstate) {
                    if (r !== this.myrate)
                        await api.post(
                            "map/rate",
                            Xform({ id: this.mapdetail.id, score: r })
                        );
                    else
                        await api.post(
                            "map/cancelrate",
                            Xform({ id: this.mapdetail.id })
                        );
                    this.load();
                }
            } catch (error) {
                this.$toasted.error(this.$t("s.toastedError") as string);
            }
        },
        async favorite(r: number) {
            try {
                if (userstate.loginstate) {
                    if (this.isfavorite)
                        await api.post(
                            "user/removefavorite",
                            Xform({ mapid: this.mapdetail.id })
                        );
                    else
                        await api.post(
                            "user/addfavorite",
                            Xform({ mapid: this.mapdetail.id })
                        );
                    this.load();
                }
            } catch (error) {
                this.$toasted.error(this.$t("s.toastedError") as string);
            }
        },
        createhandler(key: string) {
            return async (value: string | Blob) => {
                if (!value || !this.canedit) return;
                try {
                    const form = { id: this.mapdetail.id } as any;
                    form[key] = value;
                    const url =
                        this.canedit === "user"
                            ? "map/modify"
                            : "admin/modifymapinfo";
                    const res = await api.post(url, Form(form));
                    this.load();
                } catch (error) {
                    this.$toasted.error(this.$t("s.toastedError") as string);
                }
            };
        },
        uploadNewImage() {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.click();
            input.addEventListener("change", async () => {
                if (input.files && input.files.length) {
                    const file = input.files.item(0);
                    if (!file) return;
                    await this.createhandler("image")(file);
                    this.$toasted.success(this.$t("w.uploaded") as string);
                }
            });
        },
        async updateMapContent() {
            const content = localStorage.getItem("gamemapstate");
            if (!content) return;
            await this.createhandler("content")(content);
            this.$toasted.success(this.$t("w.updated") as string);
        }
    },
    mounted() {
        this.load();
    }
});
</script>

<style scoped>
.container {
    padding: 10px;
}
.image {
    position: relative;
}
.modify {
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    z-index: 6;
}
.title {
    cursor: pointer;
}
.play {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    background: rgba(0, 0, 0, 0.4);
    transition: opacity 0.4s;
}
.image:hover .play {
    opacity: 1;
}
.end {
    justify-content: flex-end;
}
.m-right {
    margin-right: 20px;
}
.date {
    margin: 0 10px;
}
.block {
    display: block;
}
</style>
