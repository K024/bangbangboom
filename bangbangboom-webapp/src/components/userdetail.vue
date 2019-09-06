<template>
    <div>
        <template v-if="loaded">
            <div class="container">
                <div>
                    <avatar :username="detail.username" class="md-avatar-icon md-large"></avatar>
                </div>
                <div class="md-display-1">{{detail.nickname}}</div>
                <div class="md-title">{{detail.username}}</div>
                <div>{{detail.whatsup}}</div>
            </div>
        </template>
        <not-found v-else-if="notfound"></not-found>
        <div v-else>{{$t('w.loading')}}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MapDetailed, MusicDetailed, AppUserDetailed } from "../tools/models";
import notFound from "./others/notfound.vue";
import api, { HandleErr } from "../tools/Axios";

export default Vue.extend({
    components: {
        notFound
    },
    data() {
        return {
            detail: new AppUserDetailed(),
            loaded: false,
            notfound: false
        };
    },
    methods: {
        async load() {
            const id = this.$route.params.id;
            try {
                const res = await api.get<AppUserDetailed>("user/info/" + id);
                this.detail = res.data;
                this.loaded = true;
            } catch (error) {
                const res = HandleErr(error);
                if (!res) this.$toasted.error(this.$t("s.toastedError") as string);
                else if (res.status === 404) this.notfound = true;
            }
        }
    },
    mounted() {
        this.load();
    }
});
</script>

<style scoped>
.container {
    position: relative;
    padding: 10px;
}
</style>
