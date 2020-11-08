<template>
  <div>
    <div class="row">
      <div class="card mx-auto">
        <div class="card-header text-white bg-primary">
          <h4>Reset Password link will be sent to you email</h4>
        </div>
        <div class="card-body">
          <form @submit.prevent="forgotPass">
            <div class="form-group">
              <label for="email">Your account's Email</label>
              <input
                id="email"
                type="text"
                placeholder="your email here"
                name="email"
                v-model="email"
                class="form-control"
              />
            </div>

            <input type="submit" class="btn btn-primary" value="Send" />
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
    return {
      email: ""
    };
  },
  methods: {
    ...mapActions(["forgotpasswd"]),
    forgotPass() {
      let data = {
        email: this.email
      };
      this.forgotpasswd(data)
        .then(res => {
          if (res) window.console.log(res);
        })
        .catch(err => {
          window.console.log(err);
        });
    }
  },
  created() {}
};
</script>

<style lang="css" scoped>
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
