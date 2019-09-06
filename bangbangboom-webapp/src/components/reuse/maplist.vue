<template>
    <div class="md-layout md-gutter">
        <map-preview
            v-for="ms in list"
            :key="ms.id"
            :map-short="ms"
            class="md-layout-item md-large-size-50 md-xlarge-size-50 md-medium-size-50 md-small-size-50 md-xsmall-size-100"
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
            type: Array,
            required: true
        }
    },
    components: {
        MapPreview
    }
});
</script>

<style scoped>
.md-layout-item {
    margin-bottom: 16px;
}
</style>
