<template>
    <div>
        <span class="md-headline">Search</span>

        <md-field>
            <label>Keyword</label>
            <md-input v-model="keyword" @change="search"></md-input>
        </md-field>

        <md-empty-state v-if="!searching&&results.length===0" md-label="No result"></md-empty-state>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import maplist from "./reuse/maplist.vue";
import { delay } from "../tools/functions";
export default Vue.extend({
    components: {
        "map-list": maplist
    },
    data() {
        return {
            keyword: "",
            results: [] as string[],
            searching: false
        };
    },
    methods: {
        async search() {
            this.searching = true;
            
            this.searching = false;
        }
    }
});
</script>

<style scoped>
</style>
