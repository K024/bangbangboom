<template>
    <div>
        <md-empty-state v-if="sent" class="md-primary" md-icon="done" :md-description="$t('w.uploaded')"></md-empty-state>
        <template v-else>
            <div class="md-title">{{$t('l.uploadMap')}}</div>
            <md-field>
                <label>{{$t('l.mapNameAscii')}}</label>
                <md-input v-model="mapname" md-counter="100"></md-input>
            </md-field>
            <md-field>
                <label>{{$t('l.musicId')}}</label>
                <md-input type="number" v-model="musicid"></md-input>
            </md-field>
            <md-field>
                <label>{{$t('w.difficulty')}}</label>
                <md-input type="number" v-model="difficulty"></md-input>
            </md-field>
            <md-field>
                <label>{{$t('l.imageFile')}}</label>
                <md-file :placeholder="$t('l.imageFile')" accept="image/*" @change="loadfile"></md-file>
            </md-field>
            <md-field>
                <label>{{$t('w.description')}}</label>
                <md-textarea v-model="description" md-autogrow md-counter="400"></md-textarea>
            </md-field>
            <div>{{$t('s.mapUploadNotice')}}</div>
            <md-button :disabled="!formvalid || loading" @click="submit">{{$t('w.submit')}}</md-button>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import api, { Form } from "../tools/Axios";
import { delay } from "../tools/functions";

function allAscii(s: string) {
    return /^[\x00-\x7F]*$/.test(s);
}

export default Vue.extend({
    data() {
        return {
            mapname: "",
            musicid: "",
            difficulty: "",
            description: "",
            image: undefined as undefined | File,
            loading: false,
            sent: false
        };
    },
    computed: {
        formvalid(): boolean {
            return (
                (this.mapname &&
                    allAscii(this.mapname) &&
                    parseInt(this.musicid) &&
                    parseInt(this.difficulty) &&
                    this.description &&
                    true) ||
                false
            );
        }
    },
    methods: {
        loadfile(e: Event) {
            const files = e.target && (e.target as HTMLInputElement).files;
            if (files && files.length) {
                const file = files.item(0);
                if (file) this.image = file;
            }
        },
        async submit() {
            if (!this.image || !this.formvalid) return;
            const content = localStorage.getItem("gamemapstate");
            if (!content) {
                this.$toasted.error(this.$t("s.localStorageEmpty") as string);
                return;
            }
            try {
                this.loading = true;
                const res = await api.post<string>(
                    "map/upload",
                    Form({
                        musicid: this.musicid,
                        mapname: this.mapname,
                        difficulty: this.difficulty,
                        content: content,
                        description: this.description,
                        image: this.image
                    })
                );
                this.sent = true;
                await delay(3000);
                this.$router.push("/map/" + res.data);
            } catch (error) {
                this.$toasted.error(this.$t("s.toastedError") as string);
            } finally {
                this.loading = false;
            }
        }
    }
});
</script>

<style scoped>
</style>
