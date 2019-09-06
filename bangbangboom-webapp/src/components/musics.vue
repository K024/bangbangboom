<template>
    <div style="padding: 10px">
        <md-field>
            <label>{{$t('w.search')}}</label>
            <md-input v-model="keyword"></md-input>
        </md-field>

        <music-list :list="results"></music-list>
        <md-empty-state v-if="!searching&&results.length===0" :md-label="$t('l.noResult')"></md-empty-state>

        <md-button class="fill-w" v-if="results.length > 0 && !pageend" @click="nextpage">{{$t('w.more')}}</md-button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import musiclist from "./reuse/musiclist.vue";
import { delay, debounce } from "../tools/functions";
import { Route } from "vue-router";
import api from "../tools/Axios";
import { MusicShort } from "../tools/models";
export default Vue.extend({
    name: "search",
    components: {
        "music-list": musiclist
    },
    data() {
        return {
            keyword: "",
            results: [] as MusicShort[],
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
                const res = key
                    ? await api.get<MusicShort[]>("music/search", {
                          params: { key }
                      })
                    : await api.get<MusicShort[]>("music/latest");
                if (key !== this.keyword) return;
                this.results = res.data;
                this.page = 1;
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string );
            } finally {
                if (key === this.keyword) this.searching = false;
            }
        },
        async nextpage() {
            if (this.pageend) return;
            const p = this.page + 1;
            const key = this.keyword;
            try {
                const res = key
                    ? await api.get<MusicShort[]>("music/search", {
                          params: { key, page: p }
                      })
                    : await api.get<MusicShort[]>("music/latest", {
                          params: { page: p }
                      });
                if (key !== this.keyword) return;
                if (res.data.length <= 0) this.pageend = true;
                this.results.push(...res.data);
                this.page = p;
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string );
            }
        },
        route() {
            if (this.keyword) this.$router.push("/musics?key=" + this.keyword);
            else this.$router.push("/musics");
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
                this.keyword = key || "";
                this.search();
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
