<template>
    <div>
        <div class="panel">
            <div class="flex">
                <span class="md-subtitle m-right">Music Source</span>
                <md-radio v-model="musicSource" value="local">Local</md-radio>
                <md-radio v-model="musicSource" value="musicid">Music Id</md-radio>
            </div>
            <div class="flex">
                <md-field v-show="musicSource == 'local'">
                    <label>Local</label>
                    <md-file placeholder="Local" accept="audio/mp3" @change="loadMusic"></md-file>
                </md-field>
                <div class="flex fill-w" v-show="musicSource == 'musicid'">
                    <md-field>
                        <label>Music Id</label>
                        <md-input v-model="musicId" type="number"></md-input>
                    </md-field>
                    <md-button @click="loadMusic">Load</md-button>
                </div>
            </div>
            <md-field>
                <label>Backgound Image</label>
                <md-file accept="image/*" @change="changeBackground"></md-file>
            </md-field>
            <div class="flex m-bottom">
                <span class="md-subtitle m-right">Backgound Dim</span>
                <md-slider style="flex-grow: 1" v-model="metastate.backgroundDim"></md-slider>
            </div>
            <div class="flex">
                <md-switch v-model="metastate.lowPerformance">Lower Performance</md-switch>
                <md-switch v-model="metastate.backgroundCover">Backgound Cover</md-switch>
            </div>
        </div>
        <md-snackbar :md-active.sync="showSnackbar" md-persistent>
            <span>Music load error: {{metastate.loadError}}</span>
        </md-snackbar>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MetaState } from "../state";
export default Vue.extend({
    data: function() {
        return {
            musicSource: "local",
            musicId: "",
            showSnackbar: false
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
                MetaState.loadError = "To be implemented";
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
        }
    },
    watch: {
        "metastate.loadError": function(n) {
            if (n) {
                this.showSnackbar = true;
                setTimeout(() => {
                    if (MetaState.loadError === n) MetaState.loadError = "";
                }, 4000);
            }
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
    margin: auto;
}
.m-bottom {
    margin-bottom: 20px;
}
.md-snackbar {
    z-index: 10010;
}
</style>