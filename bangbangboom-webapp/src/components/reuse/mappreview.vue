<template>
    <div>
        <md-card class="map-preview" @click.native="$router.push('/map/'+mapShort.id)">
            <md-ripple>
                <md-card-media md-ratio="16:9">
                    <img v-lazy="'/api/map/image/' + mapShort.id" :alt="mapShort.mapname" />

                    <div class="media-gradient"></div>
                    <div class="media-left">
                        <div class="proved" v-if="mapShort.proved">Proved</div>
                    </div>
                    <div class="media-right">
                        <div class="plays flex">
                            {{mapShort.plays}}
                            <md-icon>meplay_circle_fillednu</md-icon>
                        </div>
                    </div>
                    <div class="media-bottom ellipsis">
                        <music-title class="md-title" :music="mapShort.music"></music-title>
                        <music-artist class="md-subhead" :music="mapShort.music"></music-artist>
                    </div>
                </md-card-media>

                <md-card-content>
                    <div class="flex">
                        <div>
                            <avatar :username="mapShort.uploader.username"></avatar>
                        </div>
                        <div>{{mapShort.mapname}}</div>
                    </div>
                </md-card-content>
            </md-ripple>
        </md-card>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MapShort } from "@/tools/models";

export default Vue.extend({
    props: {
        mapShort: { type: Object, required: true }
    }
});
</script>

<style scoped>
.map-preview {
    transition: all 0.3s;
}
.map-preview:hover {
    transform: scale(1.05) rotate(2deg);
    box-shadow: 0 6px 2px -4px rgba(0, 0, 0, 0.4),
        0 4px 4px 0 rgba(0, 0, 0, 0.28), 0 2px 10px 0 rgba(0, 0, 0, 0.24);
}

.media-gradient {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.5)
    );
}

.media-left {
    position: absolute;
    left: 10px;
    top: 10px;
    color: white;
}
.proved {
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 16px;
}

.media-right {
    position: absolute;
    right: 10px;
    top: 10px;
    color: white;
}

.media-bottom {
    color: white;
    position: absolute;
    bottom: 10px;
    left: 10px;
    max-width: calc(100% - 20px);
}
</style>
