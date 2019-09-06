<template>
    <div class="container">
        <div v-for="(m, i) in list" :key="m.id">
            <md-divider v-if="i!==0"></md-divider>
            <router-link tag="div" class="row ellipsis" :to="'/music/' + m.id">
                <md-ripple class="flex">
                    <music-title class="title" :music="m"></music-title>
                    <music-artist class="artist" :music="m"></music-artist>
                    <date-time class="date" :time="m.date"></date-time>
                </md-ripple>
            </router-link>
        </div>
    </div>
</template><script lang="ts">
import Vue from "vue";

import { MusicShort } from "../../tools/models";

export default Vue.extend({
    props: {
        list: {
            type: Array,
            required: true
        }
    }
});
</script><style scoped>
.list-item {
    justify-content: space-between;
}

.list-item > * {
    margin: 0 10px;
}

.row {
    height: 50px;
    transition: all 0.3s;
}

.row:hover {
    background: lightgray;
}

.title {
    padding: 5px 10px;
    width: 50%;
}

.artist {
    padding: 5px 10px;
    width: 25%;
}

.date {
    width: 25%;
}

/* smaller device */
@media only screen and (max-width: 768px) {
    .date {
        display: none !important;
    }
    .title {
        width: 65%;
    }
    .artist {
        width: 33%;
    }
}
</style>