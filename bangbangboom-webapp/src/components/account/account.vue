<template>
    <div class="container">
        <template v-if="!userstate.loginstate">
            <div class="only-g flex center login">{{$t('s.pleaselogin')}}</div>
            <div class="login fade-in" v-if="$responsive.s">
                <user-login></user-login>
            </div>
        </template>
        <template v-else>
            <md-tabs md-swipeable class="fade-in" md-dynamic-height>
                <md-tab :md-label="$t('w.info')">
                    <span class="md-title">{{appuser.username}}</span>
                    <div class="flex">
                        <avatar v-if="appuser.hasprofile" class="md-avatar-icon md-large" :username="appuser.username"></avatar>
                        <div v-else>{{$t('l.noProfile')}}</div>
                        <md-button @click="uploadprofile">{{$t('l.uploadProfile')}}</md-button>
                    </div>
                    <md-field>
                        <label>{{$t('l.nickName')}}</label>
                        <md-input @change="setnickname" v-model="appuser.nickname" md-counter="20"></md-input>
                    </md-field>
                    <md-field>
                        <label>{{$t('l.whatsUp')}}</label>
                        <md-textarea @change="setwhatsup" v-model="appuser.whatsup" md-autogrow md-counter="300"></md-textarea>
                    </md-field>
                    <md-button class="md-accent right" @click="logout">{{$t('w.logout')}}</md-button>
                </md-tab>
                <md-tab :md-label="$t('w.musics')">
                    <music-tab />
                </md-tab>
                <md-tab :md-label="$t('w.maps')">
                    <map-tab />
                </md-tab>
                <md-tab :md-label="$t('w.admin')" v-if="userstate.currentuser.roles.indexOf('admin') >= 0">
                    <admin-tab />
                </md-tab>
            </md-tabs>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import userlogin from "./userlogin.vue";
import { userstate } from "./state";
import { AppUserDetailed } from "@/tools/models";
import api, { Xform, Form, GetXSRFHeader } from "@/tools/Axios";
import { debounce } from "@/tools/functions";
import maptab from "./maptab.vue";
import musictab from "./musictab.vue";
import admintab from "./admin.vue";

const setNickName = debounce(1000, async (nickname: string) => {
    try {
        const res = await api.post<string>(
            "user/setnickname",
            Xform({ nickname })
        );
        return true;
    } catch (err) {
        return false;
    }
});
const setWhatsUp = debounce(1000, async (whatsup: string) => {
    try {
        const res = await api.post<string>(
            "user/setwhatsup",
            Xform({ whatsup })
        );
        return true;
    } catch (err) {
        return false;
    }
});

/**
 * 用户修改个人信息界面
 * 个人设置界面
 */
export default Vue.extend({
    components: {
        "user-login": userlogin,
        "map-tab": maptab,
        "music-tab": musictab,
        "admin-tab": admintab
    },
    data() {
        return {
            appuser: new AppUserDetailed()
        };
    },
    computed: {
        userstate: () => userstate
    },
    methods: {
        async load() {
            try {
                const res = await api.get<AppUserDetailed>("user/me");
                this.appuser = res.data;
            } catch (error) {
                this.$toasted.error(this.$t('s.toastedError') as string );
            }
        },
        logout() {
            api.post("account/logout").then(() => {
                userstate.loginstate = false;
                GetXSRFHeader();
            });
        },
        setnickname() {
            setNickName(this.appuser.nickname);
        },
        setwhatsup() {
            setWhatsUp(this.appuser.whatsup);
        },
        uploadprofile() {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.click();
            input.addEventListener("change", async () => {
                if (input.files && input.files.length) {
                    const file = input.files.item(0);
                    if (!file) return;
                    try {
                        await api.post("user/uploadprofile", Form({ file }));
                        this.load();
                    } catch (error) {
                        this.$toasted.error(
                            this.$t('s.toastedError') as string 
                        );
                    }
                }
            });
        }
    },
    mounted() {
        this.$watch(
            () => userstate.loginstate,
            n => {
                if (n) this.load();
            },
            { immediate: true }
        );
    }
});
</script>

<style scoped>
.login {
    max-width: 300px;
    margin: auto;
    padding: 20px 10px;
}
.md-avatar {
    margin: 10px;
}
.right {
    float: right;
}
</style>
