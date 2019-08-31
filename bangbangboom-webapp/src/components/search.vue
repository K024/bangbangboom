<template>
    <div>
        <span class="md-headline">Search</span>

        <md-field>
            <label>Keyword</label>
            <md-input v-model="keyword" @change="search"></md-input>
        </md-field>

        <md-empty-state v-if="!searching&&results.length===0" md-label="No result"></md-empty-state>

        <map-preview v-for="map in results" :key="map"></map-preview>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import mappreview from "./reuse/mappreview.vue";
import { delay } from "../tools/functions";
export default Vue.extend({
    components: {
        "map-preview": mappreview
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
            this.results.length = 0;
            await delay(2000);
            this.results.push(
                "123",
                "456",
                "253",
                "78",
                "34",
                "67",
                "3452",
                "34567",
                "786",
                "462"
            );
            this.searching = false;
        }
    }
});
</script>

<style scoped>
</style>
