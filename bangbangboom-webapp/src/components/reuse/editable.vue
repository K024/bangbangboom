<template>
    <div>
        <div :class="{flex: !block}" v-if="!enabled || !editing">
            <slot />
            <div v-if="enabled">
                <span class="edit" @click="editing = true">{{$t('w.edit')}}</span>
            </div>
        </div>
        <div class="flex" v-else>
            <md-field :class="{'md-invalid' : invalid, autowidth: autowidth}">
                <label>{{label}}</label>
                <md-textarea v-model="value" md-autogrow :maxlength="maxlength || undefined"></md-textarea>
                <span v-if="message" class="md-error">{{message}}</span>
            </md-field>
            <md-button @click="editing = false" class="md-icon-button md-dense md-accent">
                <md-icon>clear</md-icon>
            </md-button>
            <md-button :disabled="invalid" @click="done" class="md-icon-button md-dense md-primary">
                <md-icon>done</md-icon>
            </md-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    props: {
        label: String,
        default: String,
        enabled: Boolean,
        handler: Function,
        maxlength: String,
        validator: Function,
        block: Boolean,
        autowidth: Boolean
    },
    data() {
        return {
            editing: false,
            value: "",
            message: ""
        };
    },
    computed: {
        invalid(): boolean {
            if (!this.validator) return false;
            const r = this.validator.call(null, this.value);
            if (r === true) return false;
            if (typeof r === "string") this.message = r;
            return true;
        }
    },
    methods: {
        done() {
            if (this.handler) this.handler.call(null, this.value);
            this.editing = false;
        }
    },
    mounted() {
        this.value = this.default;
    }
});
</script>

<style scoped>
.edit {
    cursor: pointer;
    color: #448aff;
    margin-left: 20px;
}
.autowidth {
    width: auto !important;
}
</style>

