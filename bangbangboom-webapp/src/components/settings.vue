<template>
    <div class="container">
        <div class="md-display-1">{{$t('w.settings')}}</div>
        <md-switch v-model="settings.showoriginal">{{$t('s.showSongNameInOLanguage')}}</md-switch>
        <md-field>
            <label>{{$t('w.speed')}}</label>
            <md-input v-model="config.speed" type="number" step="0.1"></md-input>
        </md-field>
        <md-field>
            <label>{{$t('l.visualOffset')}} (ms)</label>
            <md-input v-model="config.visualOffset" type="number" step="1"></md-input>
        </md-field>
        <md-field>
            <label>{{$t('l.judgeOffset')}} (ms)</label>
            <md-input v-model="config.judgeOffset" type="number" step="1"></md-input>
        </md-field>
        <md-field>
            <label>{{$t('l.noteScale')}}</label>
            <md-input v-model="config.noteScale" type="number" step="0.01"></md-input>
        </md-field>
        <md-field>
            <label>{{$t('l.barOpacity')}}</label>
            <md-input v-model="config.barOpacity" type="number" step="0.01"></md-input>
        </md-field>
        <md-field>
            <label>{{$t('l.backgoundDim')}}</label>
            <md-input v-model="config.backgroundDim" type="number" step="0.01"></md-input>
        </md-field>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameConfig } from "@/game/play/config";
import { usersettings } from "./others/settings";
export default Vue.extend({
    computed: {
        config: () => GameConfig.config,
        settings: () => usersettings
    }
});
</script>

<style scoped>
.container {
    margin: 10px;
}
.container > * {
    margin-bottom: 10px;
}
.m-bottom {
    margin-bottom: 20px;
}
.m-right {
    min-width: 120px;
}
</style>
