<template>
    <div class="md-layout md-gutter md-alignment-center">
        <map-preview
            v-for="ms in list"
            :key="ms.id"
            :map-short="ms"
            class="md-layout-item md-large-size-33 md-xlarge-size-33 md-medium-size-50 md-small-size-50 md-xsmall-size-100"
        ></map-preview>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MapShort } from "../../tools/models";
import MapPreview from "./mappreview.vue";

export default Vue.extend({
    props: {
        list: {
            type: Object,
            required: true,
            validator(l: any) {
                if (l instanceof Array) {
                    if (l[0] instanceof MapShort)
                        return true
                }
                return false
            }
        }
    },
    components: {
        MapPreview
    }
});
</script>

<style scoped>
</style>
