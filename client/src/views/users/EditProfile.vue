<template>
  <div>
    <div class="row">
      <div class="col-md">
        <div class="card mx-auto">
          <div class="card-header" style="background-color: black; color: black;">
            <h4>Update Your profile infos</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <div class="form-group">
                <label for="username">Username:</label>
                <input
                  id="username"
                  type="text"
                  placeholder="your username here"
                  name="username"
                  v-model="username"
                  class="form-control"
                />
                <span class="rule">*Username should be 3-15 characters | alpha/num only</span>
              </div>
              <div class="form-group">
                <label for="name">Full name:</label>
                <input
                  id="name"
                  type="text"
                  placeholder="your full name here"
                  name="name"
                  v-model="name"
                  class="form-control"
                />
                <span class="rule">*Name should be 3-20 characters | alpha/num only</span>
              </div>
              <div class="form-group">
                <label for="email">Email:</label>
                <input
                  id="email"
                  type="text"
                  placeholder="your email here"
                  name="email"
                  v-model="email"
                  class="form-control"
                />
              </div>
       

              <div class="form-group">
                <label for="lang">Prefered language: [{{user.lang}}]</label>
                <select v-model="lang" name="lang" id="lang" class="form-control">
                  <option value="en">English</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <input type="submit" class="btn btn-primary" value="Save Changes" />
              &nbsp;&nbsp;&nbsp;&nbsp;
            </form>
          </div>
        </div>
      </div>
      <div class="col-md">
        <div class="card mx-auto">
          <div class="card-header" style="background-color: black; color: black;">
            <h4>Update Your profile picture</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="updatePicture">
              <div
                class="image-input"
                :style="{ 'background-image': `url(${imageData})` }"
                @click="chooseImage"
              >
                <span v-if="!imageData" class="placeholder">Choose an Image</span>
                <input
                  class="file-input"
                  ref="fileInput"
                  type="file"
                  @input="onSelectFile"
                  accept=".jpg, .jpeg, .png"
                />
              </div>
              <br />
              <p class="picmsg">{{picmsg}}</p>
              <br />
              <input @click="onUpload" class="btn btn-primary" value="Save New Picture" />
              &nbsp;&nbsp;&nbsp;&nbsp;
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md">
        <div class="card mx-auto">
          <div class="card-header" style="background-color: black; color: black;">
            <h4>Update Your Password</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="updatePassword">
              <div class="form-group">
                <label for="password">Password:</label>
                <input
                  id="pass2"
                  type="password"
                  placeholder="password"
                  name="pass"
                  v-model="pass"
                  class="form-control"
                />
                <span
                  class="rule"
                >*Password should be 6-20 characters | contain atleast 1 Upper Case / 1 Lower Case / 1 Num / 1 Special Character</span>
              </div>

              <div class="form-group">
                <label for="password">Password confirmation:</label>
                <input
                  id="pass"
                  type="password"
                  placeholder="password"
                  name="pass"
                  v-model="cpass"
                  class="form-control"
                />
         
              </div>
        
              <input type="submit" class="btn btn-primary" value="Save Changes" />
              &nbsp;&nbsp;&nbsp;&nbsp;
            </form>
          </div>
        </div>
      </div>
  
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      name: "",
      pass:"",
      cpass: "",
      lang: "en",
      username: "",
      imageData: null,
      selectedFile: null,
      picmsg: ""
    };
  },
  computed: mapGetters(["user"]),
  methods: {
    ...mapActions(["getProfile"]),
    ...mapActions(["updateprofile"]),
    ...mapActions(["updatepassword"]),

    updateProfile() {

      let data = {
        email: this.email,
        name: this.name,
        lang: this.lang,
        username: this.username
      };
      this.updateprofile(data).then((res)=>{
if(res.data.success == true)
this.$store.state.lang = this.lang;

      });
    },
    updatePassword(){
     let data = {
        pass: this.pass,
        cpass: this.cpass
      };
      this.updatepassword(data);
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },
    onSelectFile(event) {
      const input = this.$refs.fileInput;
      const files = input.files;
      this.selectedFile = event.target.files[0];
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
          this.imageData = e.target.result;
        };
        reader.readAsDataURL(files[0]);
        this.$emit("input", files[0]);
      }
    },
    onUpload() {
      if (this.selectedFile) {
        const fd = new FormData();
        fd.append("image", this.selectedFile, this.selectedFile.name);
        axios
          .post("http://localhost:3000/users/updatepicture", fd)
          .then(res => {
            if (res.data) this.picmsg = res.data;
          });
      }
    }
  },
  created() {},
  mounted() {
    this.getProfile().then(data => {
      this.$store.state.loggedf = true;
      if (data) {
        this.name = data.data.user.name;
        this.email = data.data.user.email;
        this.username = data.data.user.username;
      }
    });
  }
};
</script>

<style scoped>
* {
  color: black;
}
h4 {
  color: white;
}
.rule {
  color: blue;
  font-size: 14px;
}
.picmsg {
  color: green;
  font-size: 20px;
}
.card {
  width: 80%;
  border-radius: 0;
}
.btn {
  border-radius: 0;
}
.form-control {
  border-radius: 0;
}
img {
  width: 90%;
}
.image-input {
  display: block;
  width: 100%;
  height: 400px;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
}
.placeholder {
  background: #f0f0f0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 18px;
  font-family: Helvetica;
}
.placeholder:hover {
  background: #e0e0e0;
}
.file-input {
  display: none;
}
</style>