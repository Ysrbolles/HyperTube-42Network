<template>
  <v-container>
    <div>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td class="avatar">
              <a target="_blank">
                <img
                  :src="cmnt.pdp"
                  width="60"
                  height="60"
                  border="0"
                />
              </a>
            </td>
            <td>
              <a @click="getPath(cmnt.username)" target="_blank">{{cmnt.username}}</a>
              <a href="https://twitter.com/0/status/1225523646199926784" target="_blank">
                <span class="date">{{cmnt.date}}</span>
              </a>
              <p>{{cmnt.comment}}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-container>
</template>

<script>
import router from "@/router"
export default {
  name: "CommentList",
  props: ['cmnt'],
  methods: {
    getPath(username){
       router.push("/profile?user="+ username)
    }
  }
};
</script>

<style scoped>
.reviews {
  background-color: #111;
  background-color: rgba(17, 17, 17, 0.8);
  padding: 25px;
  margin-bottom: 30px;
}
.reviews .avatar img {
  border-radius: 4px;
}
.reviews td {
  vertical-align: middle;
  padding: 6px;
}
.reviews .date {
  color: #777;
  font-size: 13px;
  margin-left: 10px;
}
.subtitle {
  font-family: bold;
  font-size: 30px;
  margin-bottom: 30px;
  line-height: 1.2;
  text-shadow: 0 0 6px #000;
}
</style>