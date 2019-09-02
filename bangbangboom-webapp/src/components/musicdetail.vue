<template>
    <div>
        <div class="md-headline">{{musicdetail.title}}</div>
        <div>{{musicdetail.titleunicode}}</div>
        <div class="md-subheading">{{musicdetail.artist}}</div>
        <div>{musicdetail.artistunicode}}</div>
        <div>{{musicdetail.date}}</div>
        <div>{{musicdetail.mapscount}}</div>
        <div>{{musicdetail.description}}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MapDetailed, MusicDetailed } from "../tools/models";
import api, { HandleErr } from "../tools/Axios";

export default Vue.extend({
    data() {
        return {
            musicdetail: new MusicDetailed()
        };
    },
    methods: {
        async load() {
            const id = Number.parseInt(this.$route.params.id);
            if (isNaN(id)) this.$router.replace("/");
            try {
                const res = await api.get<MusicDetailed>("map/info", {
                    params: { id }
                });
                this.musicdetail = res.data;
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
