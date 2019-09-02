<template>
    <div class="containder">
        <template v-if="!userstate.loginstate">
            <div class="only-g flex center login">{{$t('s.pleaselogin')}}</div>
            <div class="login fade-in" v-if="$responsive.s">
                <user-login></user-login>
            </div>
        </template>
        <template v-else>
            <md-tabs md-swipeable class="fade-in">
                <md-tab md-label="Info">
                    <span class="md-title">{{appuser.username}}</span>
                    <div class="flex">
                        <md-avatar v-if="appuser.hasprofile" class="md-avatar-icon md-large">
                            <img :src="'/api/user/profile/'+appuser.username" alt="None" />
                        </md-avatar>
                        <div v-else>No profile</div>
                        <md-button @click="uploadprofile">Upload Profile</md-button>
                    </div>
                    <md-field>
                        <label>Nick name</label>
                        <md-input @change="setnickname" v-model="appuser.nickname" md-counter="20"></md-input>
                    </md-field>
                    <md-field>
                        <label>Whats up</label>
                        <md-textarea @change="setwhatsup" v-model="appuser.whatsup" md-autogrow md-counter="300"></md-textarea>
                    </md-field>
                    <md-button class="md-accent right" @click="logout">Logout</md-button>
                </md-tab>
                <md-tab md-label="Musics">
                    <music-tab />
                </md-tab>
                <md-tab md-label="Maps">
                    <map-tab />
                </md-tab>
                <md-tab md-label="Admin" v-if="userstate.currentuser.roles.indexOf('admin') >= 0">
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
import api, { Xform, Form } from "@/tools/Axios";
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
                this.$toasted.error("Error: something wrong, please retry");
            }
        },
        logout() {
            api.post("account/logout").then(
                () => (userstate.loginstate = false)
            );
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
                            "Error: something wrong, please retry"
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
