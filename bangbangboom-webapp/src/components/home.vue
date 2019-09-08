<template>
    <div style="padding: 0 10px;">
        <div class="home">{{$t('w.home')}}</div>
        <map-list :list="list"></map-list>

        <md-button class="fill-w" v-if="list.length > 0 && !pageend" @click="load">{{$t('w.more')}}</md-button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MapShort } from "../tools/models";
import api from "../tools/Axios";
import mapList from "./reuse/maplist.vue";

export default Vue.extend({
    components: {
        mapList
    },
    data() {
        return {
            list: [] as MapShort[],
            page: 0,
            pageend: false
        };
    },
    methods: {
        async load() {
            if (this.pageend) return;
            try {
                const p = this.page + 1;
                const res = await api.get<MapShort[]>("map/latest", {
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
.home {
    font-size: 30px;
    padding: 20px 0;
}
</style>
