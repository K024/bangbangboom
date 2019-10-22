<template>
    <div>
        {{settings.showoriginal?music.titleunicode:music.title}}
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
