  
<template>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-7">
      <h2>La Carte National</h2>

      <div class="card" v-if="user">
        <img
          v-if="user.pdp"
          class="pdpimg"
          v-bind:src="user.pdp"
          alt="pdp"
        />
        <ul class="list-group">
          <li v-if="user.email" class="list-group-item">
            Email:
            <b>{{ user.email }}</b>
          </li>
          <li class="list-group-item">
            Username:
            <b>{{ user.username }}</b>
          </li>
          <li v-if="user.lang=='fr'" class="list-group-item">
            Name:
            <b>{{ user.name }}</b>
          </li>
          <li v-if="user.lang == 'en'" class="list-group-item">
            Prefered language:
            <b>English</b>
          </li>
          <li v-if="user.lang == 'fr'" class="list-group-item">
            Langue préférée:
            <b>French</b>
          </li>

          <li v-if="user.lang == 'fr'" class="list-group-item">
            Inscrit à:
            <b>{{ moment(new Date(user.date)).format('MM/DD/YYYY hh:mm') }}</b>
          </li>
          <li v-else class="list-group-item">
            Joined at:
            <b>{{ moment(new Date(user.date)).format('MM/DD/YYYY hh:mm') }}</b>
          </li>


          <li class="list-group-item">
            <router-link to="/editprofile" class="card-link">Update Profile</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters } from "vuex";

export default {
  computed: mapGetters(["user"]),
  methods: {
    ...mapActions(["getProfile", "get_other_Profile"]),
    moment
  },
  mounted() {
    this.$store.state.loggedf = true;
    if (this.$route.query.user) this.get_other_Profile(this.$route.query.user);
    else{
      this.getProfile().then((user)=>{
        if(user){
          this.$store.state.lang = user.data.user.lang;
          this.$store.state.loggedf = true;
          window.console.log("===> : PPP :",this.$store.state.lang);
       }
    
    })
    }
  }
};
</script>

<style lang="css" scoped>
*{
color: black;
}
.pdpimg {
  width: 100%;
  border: solid 4px black;
  border-radius: 2px;
}
</style>
