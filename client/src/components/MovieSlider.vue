<template>
  <div class="box1">
    <div>
      <v-img :src="movie.images.fanart"></v-img>
    </div>
    <v-btn class="icon" color="red" rounded @click="Watch">Watch Now</v-btn>
    <div class="title">
      <div>{{movie.title}}</div>
      <v-row align="center" class="mx-0">
        <v-rating
          :value="movie.rating.percentage"
          color="amber"
          dense
          half-increments
          readonly
          size="14"
        ></v-rating>
        <div class="grey--text ml-4">{{movie.vote_average}}</div>
        <div>{{movie.synopsis}}</div>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "MovieCard",
  props: ["movie"],
  data() {
    return {};
  },
  methods: {
    Watch() {}
  },
  created() {
    window.console.log("---------------------------------");
    window.console.log(this.movie);
  }
};
</script>

<style scoped>
.box1:after,
.box1:before {
  width: 100%;
  transition: all 0.3s ease 0s;
}
.box1 .icon {
  text-align: center;
}
.box1 .title {
  letter-spacing: 1px;
}
.box1 .icon,
.box1 .title,
.box1 .movie {
  margin: 0;
  position: absolute;
}
.box1 {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  padding: 0;
  position: relative;
  overflow: hidden;
}
.box1:after,
.box1:before {
  height: 100%;
  content: "";
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transform-origin: 100% 0;
  transform: rotateZ(90deg);
}
.box1:after {
  top: auto;
  bottom: 0;
  transform-origin: 0 100%;
}
.box1:hover:after,
.box1:hover:before {
  transform: rotateZ(0);
}
.box1 img {
  height: auto;
  transform: scale(0) rotate(0);
}

.box1 .title {
  font-size: 10px;
  font-style: italic;
  font-family: "Comic Sans MS, Comic Sans, cursive";
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 1px #004cbf;
  bottom: 10px;
  left: 10px;
  opacity: 0;
  z-index: 2;
  transform: scale(0);
  transition: all 0.5s ease 0.2s;
}
.box1 .title p {
  margin: 0;
}
.box1:hover .title {
  opacity: 2;
  transform: scale(0.9);
}
.box1 .icon {
  padding: 7px 5px;
  list-style: none;
  background: #fff;
  border-radius: 0 0 0 10px;
  top: -100%;
  right: 0;
  z-index: 2;
  transition: all 0.3s ease 0.2s;
}
.box1 .movie {
  padding: 7px 5px;
  color: #004cbf;
  background: #fff;

  top: -100%;

  z-index: 2;
  transition: all 0.3s ease 0.2s;
}
.box1:hover .icon {
  top: 0;
}
.box1 .icon li {
  display: block;
  margin: 10px 0;
}

.btn-outline-warning:hover {
  color: white;
}
</style>