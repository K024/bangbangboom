<template>
    <div>
        <md-empty-state v-if="sent" class="md-primary" md-icon="done" :md-description="$t('w.uploaded')"></md-empty-state>
        <template v-else>
            <div class="md-title">{{$t('l.uploadMusic')}}</div>
            <md-field>
                <label>{{$t('l.musicFile')}}</label>
                <md-file :placeholder="$t('l.musicFile')" accept="audio/mp3" @change="loadfile"></md-file>
            </md-field>
            <md-field>
                <label>{{$t('l.musicTitleAscii')}}</label>
                <md-input v-model="title" max-length="100"></md-input>
            </md-field>
            <md-field>
                <label>{{$t('l.musicTitleUnicode')}}</label>
                <md-input v-model="titleunicode" md-counter="100"></md-input>
            </md-field>
            <md-field>
                <label>{{$t('l.artistAscii')}}</label>
                <md-input v-model="artist" md-counter="100"></md-input>
            </md-field>
            <md-field>
                <label>{{$t('l.artistUnicode')}}</label>
                <md-input v-model="artistunicode" md-counter="100"></md-input>
            </md-field>
            <md-field>
                <label>{{$t('w.description')}}</label>
                <md-textarea v-model="description" md-autogrow md-counter="300"></md-textarea>
            </md-field>
            <md-button :disabled="!formvalid" @click="submit">{{$t('w.submit')}}</md-button>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import api, { Form } from "../tools/Axios";
import { delay } from "@/tools/functions";

function allAscii(s: string) {
    return /^[\x00-\x7F]*$/.test(s);
}

export default Vue.extend({
    data() {
        return {
            file: undefined as File | undefined,
            title: "",
            artist: "",
            titleunicode: "",
            artistunicode: "",
            description: "",
            loading: false,
            sent: false
        };
    },
    computed: {
        formvalid(): boolean {
            return (
                (this.file &&
                    this.title &&
                    allAscii(this.title) &&
                    this.titleunicode &&
                    this.artist &&
                    allAscii(this.artist) &&
                    this.artistunicode &&
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
                if (file) this.file = file;
            }
        },
        async submit() {
            if (!this.file || !this.formvalid) return;
            try {
                this.loading = true;
                const res = await api.post<string>(
                    "music/upload",
                    Form({
                        title: this.title,
                        artist: this.artist,
                        titleunicode: this.titleunicode,
                        artistunicode: this.artistunicode,
                        description: this.description,
                        file: this.file
                    }), {
                        timeout: 0
                    }
                );
                this.sent = true;
                await delay(3000);
                this.$router.push("/music/" + res.data);
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
