<template>
    <div class="md-layout md-gutter md-alignment-center">
        <div v-for="m in list" :key="m.id">
            <span>{{m.title}} {{m.titleunicode}}</span>
            <span>{{m.artist}} {{m.artistunicode}}</span>
            <span>{{m.uploader.nickname}}</span>
            <span>{{m.date}}</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MusicShort } from "../../tools/models";

export default Vue.extend({
    props: {
        list: {
            type: Object,
            required: true,
            validator(l: any) {
                if (l instanceof Array) {
                    if (l[0] instanceof MusicShort) return true;
                }
                return false;
            }
        }
    }
});
</script>

<style scoped>
</style>
