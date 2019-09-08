<template>
    <div style="padding: 0 10px;">
        <md-empty-state v-if="loaded && list.length===0" :md-label="$t('l.noFavorite')"></md-empty-state>
        <template v-else>
            <div class="favorites">{{$t('w.favorites')}}</div>
            <map-list :list="list"></map-list>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MapShort } from "../tools/models";
import api from "../tools/Axios";
import mapList from "./reuse/maplist.vue";
import { userstate } from "./account/state";

export default Vue.extend({
    components: {
        mapList
    },
    data() {
        return {
            list: [] as MapShort[],
            loaded: false
        };
    },
    methods: {
        async load() {
            if (!userstate.loginstate) {
                this.$router.push("/account");
                return;
            }
            try {
                const res = await api.get<MapShort[]>("user/favorites");
                this.list = res.data;
                this.loaded = true;
            } catch (error) {
                this.$toasted.error(this.$t("s.toastedError") as string);
            }
        }
    },
    mounted() {
        this.load();
    }
});
</script>

<style scoped>
.favorites {
    font-size: 30px;
    padding: 20px 0;
}
</style>
