<template>
    <div>
        <v-app-bar app clipped-left color="#0E0E0E" height="60">
            <v-app-bar-nav-icon @click="drawer = !drawer" />
            <router-link to="/" class="nav-link" style="color: white;text-decoration: none;">
                <span class="title ml-3 mr-5">
              ᕼYᑭEᖇ&nbsp;
              <span class="font-weight-light">ᵀᵘᵇᵉ</span>
                </span>
            </router-link>
            <v-text-field v-if="path !== '/Library'" solo-inverted flat v-model="search" hide-details label="Search" prepend-inner-icon="search" v-on:keyup.enter="find" />
            <v-spacer />
        </v-app-bar>
    
        <v-navigation-drawer v-model="drawer" app clipped color="#0E0E0E">
            <v-list nav dense>
                <v-list-item>
                    <v-list-item-action>
                        <v-icon>{{ icons.mdiHome }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="grey--text">
                            <router-link to="/" class="nav-link" style="color: grey;text-decoration: none;">{{ this.language.nav.home }}</router-link>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider dark class="my-4" />
                <v-list-item v-if="this.$store.state.loggedf === true">
                    <v-list-item-action>
                        <v-icon>{{ icons.mdiMovieRoll }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="grey--text">
                            <router-link to="/BoxOffice" class="nav-link" style="color: grey;text-decoration: none;">{{ this.language.nav.box }}</router-link>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="this.$store.state.loggedf === true">
                    <v-list-item-action>
                        <v-icon>{{ icons.mdiLibraryMovie }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="grey--text">
                            <router-link to="/Upcoming" class="nav-link" style="color: grey;text-decoration: none;">{{ this.language.nav.upcoming }}</router-link>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="this.$store.state.loggedf === true">
                    <v-list-item-action>
                        <v-icon>{{ icons.mdiMovieSearchOutline }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="grey--text">
                            <router-link to="/Library" class="nav-link" style="color: grey;text-decoration: none;">{{ this.language.nav.search }}</router-link>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="this.$store.state.loggedf === true">
                    <v-list-item-action>
                        <v-icon>{{ icons.mdiTableEye }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="grey--text">
                            <router-link to="/WatchedMovies" class="nav-link" style="color: grey;text-decoration: none;">{{ this.language.nav.watched }}</router-link>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider dark class="my-4" />
                <v-list-item v-if="this.$store.state.loggedf === false">
                    <v-list-item-action>
                        <v-icon>{{ icons.mdiLogin }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="grey--text">
                            <router-link to="/login" class="nav-link" style="color: grey;text-decoration: none;">{{ this.language.nav.signin }}</router-link>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="this.$store.state.loggedf === false">
                    <v-list-item-action>
                        <v-icon>{{ icons.mdiAccountPlusOutline }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="grey--text">
                            <router-link to="/Register" class="nav-link" style="color: grey;text-decoration: none;">{{ this.language.nav.signup }}</router-link>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="this.$store.state.loggedf === true">
                    <v-list-item-action>
                        <v-icon>{{ icons.mdiFaceProfile }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="grey--text">
                            <router-link to="/Profile" class="nav-link" style="color: grey;text-decoration: none;">{{ this.language.nav.profile }}</router-link>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="this.$store.state.loggedf === true">
                    <v-list-item-action>
                        <v-icon>{{ icons.mdiLogout }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="grey--text">
                            <a to="/logout" class="nav-link" @click="logout">{{ this.language.nav.signout }}</a>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider dark class="my-4" />
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
import router from "@/router";

import {
    mdiArrowUpDropCircle,
    mdiHome,
    mdiMovieRoll,
    mdiLibraryMovie,
    mdiMovieSearchOutline,
    mdiTableEye,
    mdiLogin,
    mdiAccountPlusOutline,
    mdiFaceProfile,
    mdiLogout
} from "@mdi/js";

export default {
    // props: {
    //   source: String,
    // },
    props: ["path"],
    data: () => ({
        icons: {
            mdiArrowUpDropCircle,
            mdiHome,
            mdiMovieRoll,
            mdiLibraryMovie,
            mdiMovieSearchOutline,
            mdiTableEye,
            mdiLogin,
            mdiAccountPlusOutline,
            mdiFaceProfile,
            mdiLogout
        },
        drawer: false,
        items: [
            { icon: "lightbulb_outline", text: "Notes" },
            { icon: "touch_app", text: "Reminders" },
            { divider: true },
            { heading: "Labels" },
            { icon: "add", text: "Create new label" },
            { divider: true },
            { icon: "archive", text: "Archive" },
            { icon: "delete", text: "Trash" },
            { divider: true },
            { icon: "settings", text: "Settings" },
            { icon: "chat_bubble", text: "Trash" },
            { icon: "help", text: "Help" },
            { icon: "phonelink", text: "App downloads" },
            { icon: "keyboard", text: "Keyboard shortcuts" }
        ],
        search: "",
        language: []
    }),
    methods: {
        find() {
            if (this.search.length > 0) {
                // if(window.location.pathname == '/Library')
                //   location.reload()
                // else
                router.push({ path: "/Library", query: { search: this.search } });
            }
        },
        logout() {
            this.$store.state.loggedf = false;

            localStorage.removeItem('token');
            window.location.reload();
            //router.push({ path: "/Library"});
        }
    },
    beforeCreate() {
        this.$vuetify.theme.dark = true;
    },
    created() {
        this.language = require('../plugins/lang/lang_' + this.$store.state.lang + '.js');
    },
     updated() {
        this.language = require('../plugins/lang/lang_' + this.$store.state.lang + '.js');
    }
};
</script>

<style>
#keep .v-navigation-drawer__border {
    display: none;
}
</style>
