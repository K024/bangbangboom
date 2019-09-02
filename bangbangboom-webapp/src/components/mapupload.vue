<template>
    <div>
        <md-empty-state v-if="sent" class="md-primary" md-icon="done" md-description="Uploaded"></md-empty-state>
        <template v-else>
            <div class="md-title">Upload Music</div>
            <md-field>
                <label>Map name (only ascii charactors)</label>
                <md-input v-model="mapname" md-counter="100"></md-input>
            </md-field>
            <md-field>
                <label>Music id</label>
                <md-input type="number" v-model="musicid"></md-input>
            </md-field>
            <md-field>
                <label>Difficulty</label>
                <md-input type="number" v-model="difficulty"></md-input>
            </md-field>
            <md-field>
                <label>Image File</label>
                <md-file placeholder="Local" accept="image/*" @change="loadfile"></md-file>
            </md-field>
            <md-field>
                <label>Description</label>
                <md-textarea v-model="description" md-autogrow md-counter="400"></md-textarea>
            </md-field>
            <div>Notice: Map content will be loaded from local storage saved from mapping page</div>
            <md-button :disabled="!formvalid || loading" @click="submit">Submit</md-button>
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
                this.$toasted.error("Local storage is empty");
                return;
            }
            try {
                this.loading = true;
                await api.post(
                    "music/upload",
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
