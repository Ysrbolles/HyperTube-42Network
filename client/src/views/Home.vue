<template>
  <div>
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
      <div>
        <v-carousel :show-arrows="false" hide-delimiters style="box-shadow: 0px 0px">
          <v-carousel-item v-for="i in 3" :key="i">
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
      </div>
    </div>
    <div v-else>
      <div>
        <v-container class="details">
          <div class="tagline">
            <span class="title ml-3 mr-5">
              ᕼYᑭEᖇ&nbsp;
              <span class="font-weight-light">ᵀᵘᵇᵉ</span> {{ this.language.desc }}
            </span>
          </div>
          <div class="movies">
            <div
              class="movie"
              style="width: 250px; height: 375px; opacity: 1;"
              v-for="(item, i) in haha"
              :key="i"
              @click="moviePath(item._id)"
            >
              <a>
                <v-movie :movie="item" />
              </a>
            </div>
          </div>
          <v-progress-circular :size="50" color="amber" indeterminate class="dwara"></v-progress-circular>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import MovieCard from "@/components/MovieCard";
import { mdiArrowUpDropCircle, mdiHome } from "@mdi/js";
import Movie from "@/services/Movie";
import router from "@/router";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      icons: {
        mdiArrowUpDropCircle
      },
      fab: false,
      model: null,
      loading: true,
      haha: [],
      lastmovie: [],
      page: 1,
      movieId: "",
      sym_search: 0,
      language: []
    };
  },
  inject: ["theme"],
  components: {
    "v-movie": MovieCard
    // 'MovieSlider': MovieSlider
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
     ...mapActions(["getProfile"]),
    filtre() {
      let tab = [];
      // window.console.log(this.haha[0])
      for (let i = 0; i < this.haha.length; i++) {
        if (
          this.years == this.haha[i].year &&
          this.genre == this.haha[i].genres[0]
        ) {
          break;
        }
      }
    },
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 10;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    Get_movies(page) {
      Movie.getMovies(page)
        .then(rows => {
          if (rows.err != undefined) router.push("/Error");
          for (let i = 0; i < 50; i++) {
            this.haha.push(rows[i]);
          }
        })
        .catch(() => {});
    },
    moviePath(id) {
      if (!this.$store.state.loggedf) router.push("/login");
      this.movieId = id;
      router.push("/moviePage?id=" + this.movieId);
    }
  },
 
  created() {
    this.getProfile().then((user)=>{
       if(user){
 this.$store.state.lang = user.data.user.lang;
  this.$store.state.loggedf = true;
  this.language = require('../plugins/lang/lang_' + this.$store.state.lang +'.js');
       }
    
    }),
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    Movie.lastMovie().then(rows => {
      if (rows.err != undefined) router.push("/Error");
      this.lastmovie = rows;
    });
    this.Get_movies(1);
  },
  updated() {
    window.onscroll = () => {
      let e = document.documentElement;
      let bottomOfWindow = e.scrollHeight - e.scrollTop - e.clientHeight < 50;
      if (bottomOfWindow && this.sym_search == 0) {
        this.page++;
        this.Get_movies(this.page);
      }
    };
  }
};
</script>

<style scoped>
.tagline {
  background-color: #111;
  margin-bottom: 30px;
  padding: 20px;
  line-height: 1.5;
  font-size: 18px;
}
.mother {
  width: auto;
}
.details {
  background-color: #111;
  background-color: rgba(17, 17, 17, 0.8);
  overflow: hidden;
  padding: 10px;
  position: relative;
  max-width: auto;
}
.movies .movie {
  margin-right: 1px;
  margin-bottom: 1px;
  float: left;
  position: relative;
}
.movies {
  margin-bottom: 30px;
  overflow: hidden;
}
.list-complete {
  margin-right: 10px;
}
.list-complete-item {
  transition: all 1s;
}
.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}

.card {
  color: aliceblue;
  border-radius: 15px !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
}

::-webkit-input-placeholder {
  color: rgb(148, 148, 148);
}
:-moz-placeholder {
  color: rgb(148, 148, 148);
}
::-moz-placeholder {
  color: rgb(148, 148, 148);
}
:-ms-input-placeholder {
  color: rgb(148, 148, 148);
}

.card-columns {
  grid-row: 6;
}
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
}
.grid-container > div {
  text-align: center;
  margin-top: 5px;
  font-size: 30px;
}
.carousel-caption {
  height: 80px;
  right: 0;
  top: -15px;
  left: 65px;
  text-align: left;
}
.max-height-600 {
  max-height: 600px;
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