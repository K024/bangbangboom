<template>
    <div>
        <template v-if="loaded">
            <div class="container">
                <editable
                    :default="musicdetail.title"
                    :handler="createhandler('title')"
                    :enabled="!!canedit"
                    :label="$t('w.title')"
                    :validator="(v)=>/^[\x00-\x7F]*$/.test(v) || 'Ascii charactors only'"
                    maxlength="100"
                >
                    <div class="md-headline">{{musicdetail.title}}</div>
                </editable>
                <editable
                    class="sub"
                    :default="musicdetail.titleunicode"
                    :handler="createhandler('titleunicode')"
                    :enabled="!!canedit"
                    :label="$t('l.titleUnicode')"
                    maxlength="100"
                >
                    <div>{{musicdetail.titleunicode}}</div>
                </editable>
                <editable
                    :default="musicdetail.artist"
                    :handler="createhandler('artist')"
                    :enabled="!!canedit"
                    :label="$t('w.artist')"
                    :validator="(v)=>/^[\x00-\x7F]*$/.test(v) || 'Ascii charactors only'"
                    maxlength="100"
                >
                    <div class="md-headline">{{musicdetail.artist}}</div>
                </editable>
                <editable
                    class="sub"
                    :label="$t('l.artistUnicode')"
                    :default="musicdetail.artistunicode"
                    :handler="createhandler('artistunicode')"
                    :enabled="!!canedit"
                    maxlength="100"
                >
                    <div>{{musicdetail.artistunicode}}</div>
                </editable>
                <div v-if="!musicdetail.locked">
                    <audio controls="controls">
                        <source :src="'/api/music/file/'+musicdetail.id" type="audio/mp3" />
                        {{$t('s.notSupportAudio')}}
                    </audio>
                </div>
                <div class="flex">
                    <user :user="musicdetail.uploader"></user>
                    <div style="margin: 0 10px">{{$t('l.uploadedAt')}}</div>
                    <date-time :time="musicdetail.date"></date-time>
                </div>
                <div>{{$t('l.mapsCount')}}: {{musicdetail.mapscount}}</div>
                <div class="md-subheading">{{$t('w.description')}}:</div>
                <editable
                    :default="musicdetail.description"
                    :handler="createhandler('description')"
                    :enabled="!!canedit"
                    block
                    :label="$t('w.description')"
                    maxlength="400"
                >
                    <div>{{musicdetail.description}}</div>
                </editable>
            </div>
        </template>
        <not-found v-else-if="notfound"></not-found>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MapDetailed, MusicDetailed } from "../tools/models";
import notFound from "./others/notfound.vue";
import api, { HandleErr, Form } from "../tools/Axios";
import { userstate } from "./account/state";

export default Vue.extend({
    components: {
        notFound
    },
    data() {
        return {
            musicdetail: new MusicDetailed(),
            loaded: false,
            notfound: false
        };
    },
    computed: {
        canedit(): string {
            if (!userstate.loginstate) return "";
            if (
                this.musicdetail.uploader.username ===
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
                const res = await api.get<MusicDetailed>("music/info", {
                    params: { id }
                });
                this.musicdetail = res.data;
                this.loaded = true;
            } catch (error) {
                const res = HandleErr(error);
                if (!res)
                    this.$toasted.error(this.$t('s.toastedError') as string );
                else if (res.status === 404) this.notfound = true;
            }
        },

        createhandler(key: string) {
            return async (value: string) => {
                if (!value || !this.canedit) return;
                try {
                    const form = { id: this.musicdetail.id } as any;
                    form[key] = value;
                    const url =
                        this.canedit === "user"
                            ? "music/modify"
                            : "admin/modifymusicinfo";
                    const res = await api.post(url, Form(form));
                    this.load();
                } catch (error) {
                    this.$toasted.error(this.$t('s.toastedError') as string );
                }
            };
        }
    },
    mounted() {
        this.load();
    }
});
</script>

<style scoped>
.container {
    position: relative;
    padding: 10px;
}
.container > div {
    margin-bottom: 10px;
}
audio {
    height: 40px !important;
    width: 100%;
}

.sub {
    margin-left: 20px;
}
.edit {
    cursor: pointer;
    color: #448aff;
    margin-left: 20px;
}
.right {
    justify-content: flex-end;
    flex-grow: 1;
}
</style>
