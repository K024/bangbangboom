<template>
    <div>
        <div class="panel">
            <div class="flex">
                <span class="md-subtitle m-right">{{$t('w.MusicSource')}}</span>
                <md-radio v-model="musicSource" value="local">{{$t('w.local')}}</md-radio>
                <md-radio v-model="musicSource" value="musicid">{{$t('w.MusicId')}}</md-radio>
            </div>
            <div class="flex">
                <md-field v-show="musicSource == 'local'">
                    <label>{{$t('w.local')}}</label>
                    <md-file :placeholder="$t('w.local')" accept="audio/mp3" @change="loadMusic"></md-file>
                </md-field>
                <div class="flex fill-w" v-show="musicSource == 'musicid'">
                    <md-field>
                        <label>{{$t('w.MusicId')}}</label>
                        <md-input v-model="musicId" type="number"></md-input>
                    </md-field>
                    <md-button @click="loadMusic">{{$t('w.load')}}</md-button>
                </div>
            </div>
            <md-field>
                <label>{{$t("l.BackgroundImage")}}</label>
                <md-file accept="image/*" @change="changeBackground"></md-file>
            </md-field>
            <div class="flex m-bottom">
                <span class="md-subtitle m-right">{{$t('l.backgroundDim')}}</span>
                <md-slider style="flex-grow: 1" v-model="metastate.backgroundDim"></md-slider>
            </div>
            <div class="flex">
                <md-switch v-model="metastate.lowPerformance">{{$t('l.lowerPerformance')}}</md-switch>
                <md-switch v-model="metastate.backgroundCover">{{$t('l.BackgroundCover')}}</md-switch>
            </div>
            <div class="flex">
                <md-button @click="download">{{$t('s.downloadcurrentmap')}}</md-button>
                <md-button @click="load">{{$t('s.loadmapfile')}}</md-button>
            </div>
            <div class="flex">
                <md-button @click="loadbsmap">{{$t('s.loadbsmap')}}</md-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MetaState } from "../state";
import { GameMapState } from "../gamemapstate";
import { convert } from "./functions";
export default Vue.extend({
    data: function() {
        return {
            musicSource: "local",
            musicId: ""
        };
    },
    computed: {
        metastate: () => MetaState
    },
    methods: {
        loadMusic(e: Event) {
            if (this.musicSource === "local") {
                const files = e.target && (e.target as HTMLInputElement).files;
                if (files && files.length) {
                    const file = files.item(0);
                    MetaState.musicSrc = URL.createObjectURL(file);
                } else {
                    MetaState.musicSrc = "";
                }
            } else {
                MetaState.musicSrc = "/api/music/file/" + this.musicId;
            }
        },
        changeBackground(e: Event) {
            const files = e.target && (e.target as HTMLInputElement).files;
            if (files && files.length) {
                const file = files.item(0);
                MetaState.backgroundImageSrc = URL.createObjectURL(file);
            } else {
                MetaState.backgroundImageSrc = "";
            }
        },
        download() {
            const str = GameMapState.s.toMapString();
            const blob = new Blob([str], { type: "text/plain" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "map.txt";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        load() {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "text/plain";
            input.click();
            input.addEventListener("change", () => {
                if (input.files && input.files.length) {
                    const file = input.files.item(0);
                    if (!file) return;
                    const reader = new FileReader();
                    reader.readAsText(file, "UTF-8");
                    reader.onload = e => {
                        if (e && e.target) {
                            const content = (e.target as any).result as string;
                            localStorage.setItem("gamemapstate", content);
                            this.$toasted.success(this.$t("s.maploaded") as string);
                        }
                    };
                }
            });
        },
        loadbsmap() {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "text/plain";
            input.click();
            input.addEventListener("change", () => {
                if (input.files && input.files.length) {
                    const file = input.files.item(0);
                    if (!file) return;
                    const reader = new FileReader();
                    reader.readAsText(file, "UTF-8");
                    reader.onload = e => {
                        if (e && e.target) {
                            const content = (e.target as any).result as string;
                            try {
                                const mapstring = convert(content);
                                localStorage.setItem("gamemapstate", mapstring);
                                this.$toasted.success(this.$t("s.maploaded") as string);
                            } catch (error) {
                                this.$toasted.error(this.$t("s.convertfailed") as string);
                            }
                        }
                    };
                }
            });
        }
    }
});
</script>

<style scoped>
.m-right {
    margin-right: 20px;
}
.panel {
    max-width: 500px;
    margin: 20px auto;
}
.m-bottom {
    margin-bottom: 20px;
}
</style>