import Vue from "vue";
import Vuex from "vuex";
import Auth from "@/services/Auth.js";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        Auth
    },
    state: {
        loggedf: false,
        lang: 'en'
    },
    mutations: {

    },
    actions: {

    }
})