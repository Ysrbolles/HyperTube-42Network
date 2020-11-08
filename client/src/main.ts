import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import vuetify from "@/plugins/vuetify";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import 'babel-polyfill'
// Font awesome
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
Vue.use(VueMaterial)
Vue.use(BootstrapVue)
import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.config.productionTip = false;

// Setting up default vue's http modules for api calls
Vue.prototype.$http = axios;
//  Load the token from the localStorage
const token = localStorage.getItem("token");
// Is there is any token then we will simply append default axios authorization headers
if (token) {
    Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}
// Vue.use(BootstrapVue)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
