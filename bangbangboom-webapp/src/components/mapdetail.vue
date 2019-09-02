<template>
    <div>
        <div class="image">
            <img v-lazy="'/api/map/image/' + mapdetail.id" />
        </div>

        <div class="md-headline">{{mapdetail.music.title}}</div>
        <div class="md-subheading">{{mapdetail.music.artist}}</div>
        <div>{{mapdetail.mapname}}</div>
        <div>{{mapdetail.rate}}</div>
        <div>{{mapdetail.plays}}</div>
        <div>{{mapdetail.lastmodified}}</div>
        <div>{{mapdetail.description}}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MapDetailed } from "../tools/models";
import api, { HandleErr } from "../tools/Axios";

export default Vue.extend({
    data() {
        return {
            mapdetail: new MapDetailed()
        };
    },
    methods: {
        async load() {
            const id = Number.parseInt(this.$route.params.id);
            if (isNaN(id)) this.$router.replace("/");
            try {
                const res = await api.get<MapDetailed>("map/info", {
                    params: { id }
                });
                this.mapdetail = res.data;
            } catch (error) {
                const res = HandleErr(error);
                if (!res)
                    this.$toasted.error("Error: something wrong, please retry");
                else if (res.status === 404) this.$toasted.error("Not found");
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
