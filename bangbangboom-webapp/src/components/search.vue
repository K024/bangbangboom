<template>
    <div style="padding: 10px">
        <md-field>
            <label>{{$t('w.search')}}</label>
            <md-input v-model="keyword"></md-input>
        </md-field>

        <map-list :list="results"></map-list>
        <md-empty-state v-if="!searching&&results.length===0" :md-label="$t('l.noResult')"></md-empty-state>

        <md-button class="fill-w" v-if="results.length > 0 && !pageend" @click="nextpage">{{$t('w.more')}}</md-button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import maplist from "./reuse/maplist.vue";
import { delay, debounce } from "../tools/functions";
import { Route } from "vue-router";
import api from "../tools/Axios";
import { MapShort } from "../tools/models";
export default Vue.extend({
    name: "search",
    components: {
        "map-list": maplist
    },
    data() {
        return {
            keyword: "",
            results: [] as MapShort[],
            searching: false,
            active: true,
            page: 0,
            pageend: false
        };
    },
    methods: {
        async search() {
            const key = this.keyword;
            try {
                this.searching = true;
                const res = await api.get<MapShort[]>("map/search", {
                    params: { key }
                });
                if (key !== this.keyword) return;
                this.results = res.data;
                this.page = 1;
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string);
            } finally {
                if (key === this.keyword) this.searching = false;
            }
        },
        async nextpage() {
            if (this.pageend) return;
            const p = this.page + 1;
            const key = this.keyword;
            try {
                const res = await api.get<MapShort[]>("map/search", {
                    params: { key, page: p }
                });
                if (key !== this.keyword) return;
                if (res.data.length <= 0) this.pageend = true;
                this.results.push(...res.data);
                this.page = p;
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string);
            }
        },
        route() {
            if (this.keyword) this.$router.push("/search?key=" + this.keyword);
            else this.$router.push("/search");
        }
    },
    watch: {
        keyword() {
            this.route();
        },
        $route: {
            immediate: true,
            handler(n: Route) {
                if (!this.active) return;
                const key = n.query.key as string;
                if (key) {
                    this.keyword = key;
                    this.search();
                } else {
                    this.results.length = 0;
                }
            }
        }
    },
    activated() {
        this.active = true;
    },
    deactivated() {
        this.active = false;
    },
    mounted() {
        this.route = debounce(1000, this.route);
    }
});
</script>

<style scoped>
</style>
