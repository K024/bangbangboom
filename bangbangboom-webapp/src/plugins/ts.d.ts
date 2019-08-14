
// tslint:disable

declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}
declare module '*.wav' {
    const name: string
    export default name;
}

declare module "vue-progressbar" {
    import { PluginFunction } from "vue";

    export interface OptionType {
        color?: string | null,
        failedColor?: string | null,
        thickness?: string | null,
        transition?: {
            speed: string | null,
            opacity: string | null,
            termination: number | null,
        } | null,
        autoRevert?: boolean | null,
        location?: "left" | "right" | "top" | "bottom" | null,
        position?: "relative" | "absolute" | "fixed" | null,
        inverse?: boolean | null,
        autoFinish?: boolean | null,
    }

    export const install: PluginFunction<OptionType>;

    interface ProgressMethods {
        start(): void;
        finish(): void;
        fail(): void;
        increase(percent: number): void;
        decrease(percent: number): void;
        set(percent: number): void;
    }

    module "vue/types/vue" {
        interface Vue {
            $Progress: ProgressMethods;
        }
    }
}


declare module "vue-material" {
    import { PluginObject } from "vue";
    const VueMaterial: PluginObject<any>
    export default VueMaterial
}
