<template>
    <md-content class="md-elevation-3 card">
        <div class="image">
            <div class="proved">Proved</div>
            <div class="plays">233</div>
            <div class="title"></div>
        </div>
        <div class="content"></div>
    </md-content>
</template>

<script lang="ts">
import Vue from "vue";

interface map {
    id: number;
}

export default Vue.extend({
    props: {}
});
</script>

<style scoped>
.card {
    display: flex;
    transition: transform 0.4s;
    border-radius: 2px;
}
.card :hover {
    transform: scale(1.05) rotate(5deg) translateX(5px);
}
.image {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
}
.image-content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
.content {
    flex-grow: 1;
}

/* smaller device */
@media only screen and (max-width: 768px) {
    .card {
        flex-direction: column;
    }
}

/* bigger device */
@media only screen and (min-width: 769px) {
    .card {
        flex-direction: row;
    }
    .image {
        max-width: 400px;
    }
}
</style>
