<template>
    <md-button
        @click="scrolltop"
        class="md-icon-button md-raised backtop"
        :style="{ transform: visible ? '' : 'translateX(100px)' }"
    >
        <md-icon>expand_less</md-icon>
    </md-button>
</template>

<script lang="ts">
import Vue from "vue";
import { debounce, throttle } from "../../tools/functions";
export default Vue.extend({
    data: function() {
        return {
            el: document.documentElement,
            visible: false
        };
    },
    methods: {
        // tslint:disable-next-line
        onscroll: function() {},
        scrolltop: function() {
            if (!this.el.scrollTop) this.el = document.body;
            const half = this.el.scrollTop / 2 + 20;
            const totop = () => {
                const speed =
                    Math.abs(half - Math.abs(half - this.el.scrollTop)) / 5 + 1;
                this.el.scrollTop -= speed;
                if (this.el.scrollTop > 0) requestAnimationFrame(totop);
            };
            requestAnimationFrame(totop);
        }
    },
    mounted() {
        this.el = document.documentElement;
        this.onscroll = throttle(
            500,
            () => (this.visible = window.pageYOffset >= 200)
        );
        document.addEventListener("scroll", this.onscroll);
    },
    beforeDestroy() {
        document.removeEventListener("scroll", this.onscroll);
    }
});
</script>

<style scoped>
.backtop {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 40px;
    transition: all 0.6s;
    z-index: 100;
}
</style>
