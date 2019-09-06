<template>
    <div>
        <md-button class="md-primary" to="/uploadmap">{{$t('l.uploadMap')}}</md-button>
        <map-list :list="maps"></map-list>
        <md-button class="fill-w" v-if="maps.length && !pageend" @click="load">{{$t('w.more')}}</md-button>
        <md-empty-state v-if="maps.length===0" :md-label="$t('l.noUploadedMap')"></md-empty-state>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MapShort } from "../../tools/models";
import api from "../../tools/Axios";
import mapList from "../reuse/maplist.vue";

export default Vue.extend({
    components: {
        mapList
    },
    data() {
        return {
            maps: [] as MapShort[],
            page: 0,
            pageend: false
        };
    },
    methods: {
        async load() {
            if (this.pageend) return;
            try {
                const p = this.page + 1;
                const res = await api.get<MapShort[]>("user/mymaps", {
                    params: { page: p }
                });
                this.page = p;
                this.maps.push(...res.data);
                if (res.data.length <= 0) this.pageend = true;
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string );
            }
        }
    },
    mounted: function() {
        this.load();
    }
});
</script>

<style scoped>
</style>