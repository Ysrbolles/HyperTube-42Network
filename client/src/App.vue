<template>
  <v-app >

    <navbar :path="path"/>
    <v-content >
      <v-container>
        
      <v-Errors v-if="error" :msg="error"/>
      <v-Succ v-if="success" :msg="success"/>
     
      <router-view/>
    
      </v-container>
     </v-content>
    <v-footer />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import NavBar from "./components/NavBar.vue"
import Footer from './components/Footer.vue'
import Errors from "./components/Errors.vue";
import Successes from "./components/Successes.vue";
import { mapActions, mapGetters } from "vuex";

// import io from 'socket.io-client'
export default Vue.extend({
  name: "App",
  components: {
    "navbar": NavBar,
    'v-footer': Footer,
    'v-Errors': Errors,
    'v-Succ' :Successes
  },
  computed: {
    ...mapGetters(["user"]),
    ...mapGetters(["error", "success"])
  },
    methods: {
    ...mapActions(["getProfile"])

  },
  data: () => ({
      path: '',
     classBase: 'fill-space',
    //  Socket: null
  }),
 
  updated(){
    this.path = this.$router.currentRoute.path
  },
  created(){
//      this.getProfile().then((user)=>{
//        if(user){
//  this.$store.state.lang = user.data.user.lang;
//     window.console.log(this.$store.state.lang);
//        }
     
//     })
  }

   
});
</script>

<style scoped>
.haha{
  max-width: 100%;
}
</style>