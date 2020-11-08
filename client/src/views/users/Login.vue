<template>
  <div>
    <div class="row">
      <div class="card mx-auto">
        <div class="card-header"  style="background-color: black; color: white;">
          <h4>Login</h4>
        </div>
        <div class="card-body">
          <form @submit.prevent="loginUser">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                name="username"
                v-model="username"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                name="password"
                id="password"
                v-model="password"
              />
            </div>
            <input type="submit" class="btn" style="background-color: black; color: white;" value="Login" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <router-link to="/register" class="card-link"
              >Need and account?</router-link
            >
            <router-link to="/forgotpass" class="card-link"
              >Forgot Password?</router-link
            >
          </form>
          <v-icon>{{icons.mdiGithub}}</v-icon><router-link to="/42" class="card-link">42</router-link>
          <router-link to="/gh" class="card-link">github</router-link>
          <router-link to="/sp" class="card-link">Spotify</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import { mdiGithub, mdiSpotify } from "@mdi/js";
import router from '@/router'
export default {
  name: 'Login',
  data() {
    return {
      icons: {
      mdiGithub,
      mdiSpotify
    },
      token: "",
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapActions(["login"]),
    loginUser() {
      if (this.username.length > 0 && this.password.length > 0) {
        let user = {
          username: this.username,
          password: this.password
        };
        this.login(user)
          .then(res => {
            window.console.log(res);
            if (res !== undefined)
              if (res.data.success) {
                this.$store.state.loggedf = true;
                // this.$router.push("/profile");
                router.push('/')
              }
          })
          .catch(err => {
            window.console.log(err);
          });
      }
    }
  },
  created() {
    if (this.$route.query.token) {
      // this.$store.state.loggedf = true;
      this.token = this.$route.query.token;
      localStorage.setItem("token", this.$route.query.token);
      axios.defaults.headers.common["Authorization"] = this.$route.query.token;

      this.$router.go("/");
    }
  }
};
</script>

<style>
.card {
  width: 60%;
  border-radius: 0;
}
.btn {
  border-radius: 4px;
  width: 90px;
}
.form-control {
  border-radius: 0;
}
</style>
