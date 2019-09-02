<template>
    <div>
        <md-empty-state v-if="sent" class="md-primary" md-icon="done" md-description="Uploaded"></md-empty-state>
        <template v-else>
            <div class="md-title">Upload Music</div>
            <md-field>
                <label>Music File</label>
                <md-file placeholder="Local" accept="audio/mp3" @change="loadfile"></md-file>
            </md-field>
            <md-field>
                <label>Music title (only ascii charactors)</label>
                <md-input v-model="title" md-counter="100"></md-input>
            </md-field>
            <md-field>
                <label>Music title unicode</label>
                <md-input v-model="titleunicode" md-counter="100"></md-input>
            </md-field>
            <md-field>
                <label>Artist (only ascii charactors)</label>
                <md-input v-model="artist" md-counter="100"></md-input>
            </md-field>
            <md-field>
                <label>Artist unicode</label>
                <md-input v-model="artistunicode" md-counter="100"></md-input>
            </md-field>
            <md-field>
                <label>Description</label>
                <md-textarea v-model="description" md-autogrow md-counter="300"></md-textarea>
            </md-field>
            <md-button :disabled="!formvalid" @click="submit">Submit</md-button>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import api, { Form } from "../tools/Axios";

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
                await api.post(
                    "music/upload",
                    Form({
                        file: this.file,
                        title: this.title,
                        artist: this.artist,
                        titleunicode: this.titleunicode,
                        artistunicode: this.artistunicode,
                        description: this.description
                    })
                );
                this.sent = true;
            } catch (error) {
                this.$toasted.error("Error: something wrong, please retry");
            } finally {
                this.loading = false;
            }
        }
    }
});
</script>

<style scoped>
</style>
