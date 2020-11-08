<template>
  <v-container>
    <div>
      <div class="tagline">
        <span class="title ml-3 mr-5">
          ᕼYᑭEᖇ&nbsp;
          <span class="font-weight-light">ᵀᵘᵇᵉ</span>{{ this.language.desc }}
        </span>
      </div>
      <v-card flat class="details">
        <v-row>
          <v-col>
            <v-text-field
              @input="search_inst()"
              label="Search"
              outlined
              color="warning"
              v-model="fill"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card-text>
              <v-select
                class="v-slider"
                :items="itemsII"
                v-model="itemII"
                label="Sort"
                outlined
                color="warning"
              ></v-select>
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-text>
              <v-select
                class="v-slider"
                :items="items"
                v-model="item"
                label="Genre"
                outlined
                color="warning"
              ></v-select>
            </v-card-text>
          </v-col>
          <v-col>
            <v-subheader></v-subheader>
            <v-btn color="warning" @click="filtre">Filtre</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
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
        <v-card class="details">
          <v-container class="details">
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
          </v-container>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import MovieCard from "@/components/MovieCard";
import { mdiArrowUpDropCircle,mdiHome } from '@mdi/js';
import Movie from '@/services/Movie'
import router from '@/router'
import io from 'socket.io-client'
  export default {
    name: 'Home',
    data(){
      return {
        rating: 0,
        items: ['action', 'aventure', 'animation', 'biographie', 'comedy',
                'crime', 'documentary', 'drama', 'family',
                'fantasy', 'film-noir', 'history', 'horror', 
                'music', 'mystery', 'romance', 'sci-fi', 'short',
                'sport', 'thriller', 'war', 'western'],
        itemsII: ['seeds' , 'rating' , 'title' , 'trending' , 'year'],
        item: '',
        itemII: '',
        maxDate: new Date().getFullYear(),
        daterange: [2012, new Date().getFullYear()],
        selected: null,
        options: [
          { value: null, text: 'Please select an option' },
          { value: 'a', text: 'This is First option' },
          { value: 'b', text: 'Selected Option' },
          { value: { C: '3PO' }, text: 'This is an option with object value' },
          { value: 'd', text: 'This one is disabled', disabled: true }
        ],
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
      years: "",
      genre: "",
      lang: "",
      search: "",
      fill: "",
      Socket: "",
      sym: 0,
      language: []
    };
  },
  inject: ["theme"],
  components: {
    "v-movie": MovieCard
    // 'MovieSlider': MovieSlider
  },
  methods: {
    filtre() {
      let tab = [];
      Movie.filtre_search(this.itemII, this.item, 1).then(rows => {
        if (rows.err != undefined) router.push("/Error");
        window.console.log(rows);
        this.haha = rows.data;
      });
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
      this.movieId = id;
      router.push("/moviePage?id=" + this.movieId);
    },
    search_inst() {
      if (this.fill.length > 0) {
        window.console.log(this.fill);
        this.Socket = io("http://localhost:3000");
        this.Socket.emit("search", this.fill);
        this.Socket.on("Search_result", data => {
          // window.console.log(data);
          this.sym = 1;
          this.haha = data.result;
        });
        this.Socket.on("Error", data => {
          router.push("/Error");
        });
      }
    }
  },
  created() {
    this.$store.state.loggedf = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.search = this.$router.history.current.query.search;
    Movie.getMovies_filtres(this.search).then(rows => {
      if (rows.err != undefined) router.push("/Error");
      this.haha = rows.result;
    });
    this.language = require('../../plugins/lang/lang_' + this.$store.state.lang +'.js');
  },
  updated() {
    let search2 = this.$router.history.current.query.search;
    if (this.search != search2) {
      Movie.getMovies_filtres(search).then(rows => {
        if (rows.err != undefined) router.push("/Error");
        this.haha = rows.result;
      });
    }
    if (this.sym == 0) {
      window.onscroll = () => {
        let e = document.documentElement;
        let bottomOfWindow = e.scrollHeight - e.scrollTop - e.clientHeight < 50;
        if (bottomOfWindow && this.sym_search == 0) {
          this.page++;
          Movie.filtre_search(this.itemII, this.item, this.page).then(rows => {
            window.console.log(rows);
            if (rows.err != undefined) router.push("/Error");
            window.console.log(rows);
            for (let i = 0; i < 50; i++) {
              this.haha.push(rows.data[i]);
            }
          });
        }
      };
    }
  }
  // updated(){
  // window.onscroll = () => {
  // let e = document.documentElement
  // let bottomOfWindow = e.scrollHeight - e.scrollTop - e.clientHeight < 50
  // if (bottomOfWindow && this.sym_search == 0) {
  //   this.page++
  //   this.Get_movies(this.page);
  // }
  // }
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
#country {
  color: white;
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
</style>