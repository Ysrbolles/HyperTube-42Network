<template>
  <div>
    <h2>Reset Password</h2>
    <div class="row">
      <div class="card mx-auto">
        <div class="card-header text-white bg-primary">
          <h4>New Password</h4>
        </div>
        <div class="card-body">
          <form @submit.prevent="resetPasswd">
            <div class="form-group">
              <label for="username">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                name="password"
                v-model="password"
                class="form-control"
              />
              <span
                class="rule"
              >*Password should be 6-20 characters | contain atleast 1 Upper Case / 1 Lower Case / 1 Num / 1 Special Character</span>
            </div>
            <div class="form-group">
              <label for="password">Re-type new password</label>
              <input
                type="password"
                class="form-control"
                placeholder="Confirmation Password"
                name="confirm-password"
                id="cpassword"
                v-model="cpassword"
              />
            </div>
            <input type="submit" class="btn btn-primary" value="Save" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <router-link to="/login" class="card-link">Remembred the password?</router-link>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    var tok = null;
    if (this.$route.query.token !== undefined) tok = this.$route.query.token;
    else
     this.$router.push("login");
    return {
      password: "",
      cpassword: "",
      token: tok
    };
  },
  methods: {
    ...mapActions(["resetpasswd"]),
    resetPasswd() {
      let data = {
        password: this.password,
        cpassword: this.cpassword,
        token: this.token
      };
      this.resetpasswd(data)
        .then(res => {
          if (res) window.console.log(res);
        })
        .catch(err => {
          window.console.log(err);
        });
    }
  },
  created() {
    
   
  }
};
</script>

<style lang="css" scoped>
.rule {
  color: blue;
  font-size: 14px;
}
.card {
  width: 60%;
  border-radius: 0;
}
.btn {
  border-radius: 5px;
  width: 100px;
}
.form-control {
  border-radius: 0;
}
</style>
