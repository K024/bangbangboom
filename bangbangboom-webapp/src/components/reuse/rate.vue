<template>
    <div>
        <div>{{ratescore}}</div>
        <div>1: {{rate.r1}}</div>
        <div>2: {{rate.r2}}</div>
        <div>3: {{rate.r3}}</div>
        <div>4: {{rate.r4}}</div>
        <div>5: {{rate.r5}}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RateDetail } from "../../tools/models";
export default Vue.extend({
    props: {
        rate: { type: RateDetail, required: true }
    },
    computed: {
        ratescore(): number {
            let total = 0;
            let count = 0;
            total += this.rate.r1 * 1;
            count += this.rate.r1;
            total += this.rate.r2 * 2;
            count += this.rate.r2;
            total += this.rate.r3 * 3;
            count += this.rate.r3;
            total += this.rate.r4 * 4;
            count += this.rate.r4;
            total += this.rate.r5 * 5;
            count += this.rate.r5;
            return total / count;
        }
    }
});
</script>

<style scoped>
</style>
