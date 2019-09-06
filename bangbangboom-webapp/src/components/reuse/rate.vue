<template>
    <div class="box">
        <div class="line" v-for="i in 5" :key="i">
            <div class="bar" @click="choose(i)">
                <div
                    class="barcontent"
                    :class="{myrate:myrate===i}"
                    :style="{height:rate['r'+i]/ratescore.count*100+'%'}"
                ></div>
            </div>
            <div>{{i}}</div>
        </div>
        <div class="avg flex">
            <md-icon>star</md-icon>
            <div>{{ratescore.average.toFixed(2)}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RateDetail } from "../../tools/models";
export default Vue.extend({
    props: {
        rate: { type: Object, required: true },
        myrate: { type: Number }
    },
    computed: {
        ratescore(): { count: number; average: number } {
            let total = 0;
            let count = 0;
            for (let i = 1; i <= 5; i++) {
                total += this.rate["r" + i] * i;
                count += this.rate["r" + i];
            }
            if (count === 0) count = 1;
            return {
                count,
                average: total / count
            };
        }
    },
    methods: {
        choose(r: number) {
            this.$emit("rate", r);
        }
    }
});
</script>

<style scoped>
.box {
    display: flex;
    align-items: stretch;
    justify-content: center;
    height: 100px;
    position: relative;
}
.line {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    margin: 0 2px;
    width: 25px;
}
.bar:hover {
    cursor: pointer;
    background: rgba(68, 137, 255, 0.288);
}
.bar {
    width: 100%;
    flex-grow: 1;
    position: relative;
    transition: background 0.2s;
}
.barcontent {
    background: gray;
    position: absolute;
    width: 100%;
    bottom: 0;
}
.avg {
    position: absolute;
    right: 20px;
    top: 0;
}
.myrate {
    cursor: pointer;
    background: rgba(45, 122, 255, 0.699);
}
</style>
