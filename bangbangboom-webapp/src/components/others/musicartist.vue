<template>
    <div>
        {{settings.showoriginal?music.artistunicode:music.artist}}
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import {usersettings} from "./settings"
export default Vue.extend({
    props: {
        music: Object
    },
    computed: {
        settings: () => usersettings.settings
    }
});
</script>

<style scoped>
</style>
