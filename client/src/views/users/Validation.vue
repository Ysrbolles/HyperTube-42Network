<template>
  <div>
    <h2>Validation</h2>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    var tok = null;
    if (this.$route.query.token !== undefined) tok = this.$route.query.token;
    return {
      token: tok
    };
  },
  methods: {
    ...mapActions(["validation"]),
    validUser(token) {
      this.validation(token)
        .then(res => {
          if(res.data.success)
          this.$router.push("login");
        })
        .catch(err => {
          window.console.log(err);
        });
    }
  },
  created() {
   
    window.console.log(this.token === null);

    if (this.token !== null) this.validUser(this.token);
    else this.$router.push("login");
  }
};
</script>

<style>
</style>