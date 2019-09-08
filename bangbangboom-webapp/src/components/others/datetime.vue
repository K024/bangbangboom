<template>
    <div class="date">
        <div>{{display}}</div>
        <md-tooltip md-direction="top">{{datestring}}</md-tooltip>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    props: { time: String },
    data() {
        return {
            display: ""
        };
    },
    computed: {
        date(): Date {
            let t = this.time;
            if (!t.endsWith("Z")) t += "Z";
            return new Date(t);
        },
        datestring(): string {
            return this.date.toLocaleString();
        }
    },
    methods: {
        update() {
            const now = new Date();
            const diff = now.getTime() - this.date.getTime();
            if (diff < 60 * 60 * 1000) {
                const minute = Math.ceil(diff / 60 / 1000);
                const next = minute * 60 * 1000 - diff;
                this.display = this.$tc("c.minutesago", minute);
                setTimeout(this.update, next);
            } else if (diff < 24 * 60 * 60 * 1000) {
                const hour = Math.ceil(diff / 60 / 60 / 1000);
                const next = hour * 60 * 60 * 1000 - diff;
                this.display = this.$tc("c.hoursago", hour);
                setTimeout(this.update, next);
            } else {
                this.display = this.date.toLocaleDateString();
            }
        }
    },
    mounted() {
        this.update();
        this.$watch(() => this.$i18n.locale, () => this.update());
    }
});
</script>

<style scoped>
.date {
    position: relative;
    display: inline-block;
    text-align: center;
}
</style>