<template>
    <div>
        <md-button class="md-primary" to="/uploadmusic">{{$t('l.uploadMusic')}}</md-button>
        <music-list :list="list"></music-list>
        <md-button class="fill-w" v-if="list.length && !pageend" @click="load">{{$t('w.more')}}</md-button>
        <md-empty-state v-if="list.length===0" :md-label="$t('l.noUploadedMusic')"></md-empty-state>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import musicList from "../reuse/musiclist.vue";
import { MusicShort } from "../../tools/models";
import api from "../../tools/Axios";
export default Vue.extend({
    components: {
        musicList
    },
    data() {
        return {
            list: [] as MusicShort[],
            page: 0,
            pageend: false
        };
    },
    methods: {
        async load() {
            if (this.pageend) return;
            try {
                const p = this.page + 1;
                const res = await api.get<MusicShort[]>("user/mymusics", {
                    params: { page: p }
                });
                this.page = p;
                this.list.push(...res.data);
                if (res.data.length <= 0) this.pageend = true;
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string );
            }
        }
    },
    mounted() {
        this.load();
    }
});
</script>

<style scoped>
</style>