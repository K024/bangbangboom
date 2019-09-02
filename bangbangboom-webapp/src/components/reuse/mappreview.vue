<template>
    <md-card class="map-preview">
        <md-card-media>
            <img v-lazy="'/api/map/image/' + mapShort.id" :alt="mapShort.mapname" />
        </md-card-media>

        <md-card-header>
            <div class="md-title">{{mapShort.music.title}}</div>
            <div class="md-subhead">{{mapShort.music.artist}}</div>
            <div class="md-subhead">{{mapShort.mapname}}</div>
        </md-card-header>

        <div class="proved" v-if="mapShort.proved">Proved</div>

        <div class="plays">
            {{mapShort.plays}}
            <md-icon>meplay_circle_fillednu</md-icon>
        </div>
    </md-card>
</template>

<script lang="ts">
import Vue from "vue";
import { MapShort } from "@/tools/models";

export default Vue.extend({
    props: {
        mapShort: { type: MapShort, required: true }
    }
});
</script>

<style scoped>
.map-preview {
    transition: all 0.3s;
}
.map-preview :hover {
    transform: scale(1.1) rotate(5deg);
}

.proved {
    position: absolute;
    left: 10px;
    top: 10px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
}

.plays {
    position: absolute;
    right: 10px;
    top: 10px;
    color: white;
}
</style>
