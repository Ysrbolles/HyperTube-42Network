<template>
  <v-container>
    <v-btn
      id="up"
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      color="warning"
      @click="toTop"
    >
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
    <div v-if="loading">
      <v-flex>
        <v-carousel :show-arrows="false" hide-delimiters style="box-shadow: 0px 0px">
          <v-carousel-item v-for="i in 10" :key="i">
            <v-layout row>
              <v-flex sm4 v-for="j in 3" :key="j" pl-2 pr-2>
                <v-skeleton-loader
                  max-width="300"
                  type=" card-heading, image,  list-item-three-line"
                ></v-skeleton-loader>
              </v-flex>
            </v-layout>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </div>

    <div v-else>
      <v-container class="details">
        <h1 class="subtitle">
          <v-icon>{{icons.mdiMovieRoll}}</v-icon>{{this.lang.nav.box}}
        </h1>

        <div class="movies">
          <div
            class="movie"
            style="width: 250px; height: 375px; opacity: 1;"
            v-for="(item, i) in lastmovie"
            :key="i"
            @click="getSimilarMovieinfo(item.id)"
          >
            <a>
              <MovieCard :movie="item" />
            </a>
          </div>
        </div>
        <v-progress-circular :size="50" color="amber" indeterminate class="dwara"></v-progress-circular>
      </v-container>
    </div>
  </v-container>
</template>
<script>
import router from "@/router";
import Movie from "../../services/Movie";
import MovieCard from "@/components/SimilarMovies";
import { mdiArrowUpDropCircle, mdiHome, mdiMovieRoll } from "@mdi/js";

export default {
  Name: "BoxOffice",
  data() {
    return {
      icons: {
        mdiArrowUpDropCircle,
        mdiHome,
        mdiMovieRoll
      },
      loading: true,
      fab: false,
      lastmovie: [],
      page: 1,
      lang: []
    };
  },
  components: {
    MovieCard: MovieCard
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 10;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    getSimilarMovieinfo(id) {
      Movie.getSimilarMovieinfo(id)
        .then(rows => {
          window.console.log(rows.imdb_id);
          location.replace("/moviePage?id=" + rows.imdb_id);
        })
        .catch(err => err);
    },
    Get_movies(page) {
      Movie.BoxOffice(page)
        .then(rows => {
          window.console.log(rows);
          for (let i = 0; i < 20; i++) {
            this.lastmovie.push(rows[i]);
          }
        })
        .catch(() => {});
    }
  },
  created() {
    this.$store.state.loggedf = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.Get_movies(1);
    this.language = require('../../plugins/lang/lang_' + this.$store.state.lang +'.js');
  },
  updated() {
    window.onscroll = () => {
      let e = document.documentElement;
      let bottomOfWindow = e.scrollHeight - e.scrollTop - e.clientHeight < 50;
      if (bottomOfWindow) {
        this.page++;
        this.Get_movies(this.page);
      }
    };
  }
};
</script>

<style scoped>
.details {
  background-color: #111;
  background-color: rgba(17, 17, 17, 0.8);
  overflow: hidden;
  padding: 10px;
  position: relative;
}
.movies .movie {
  margin-right: 1px;
  margin-bottom: 1px;
  float: left;
  position: relative;
  opacity: 0;
}
.movies {
  margin-bottom: 30px;
  overflow: hidden;
}
.subtitle {
  font-family: bold;
  font-size: 30px;
  margin-bottom: 30px;
  line-height: 1.2;
  text-shadow: 0 0 6px #000;
}
#up {
  margin-bottom: 100px;
  margin-right: 50px;
}
.dwara {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
</style>