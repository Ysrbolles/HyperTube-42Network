<template>
  <div>
    <div class="title">
      <v-row>
        <v-col>
          <h1 v-if="movieInfo">
            {{movieInfo.title}}
            <span>({{imdb.Year}})</span>
            <v-icon v-if="Watched === true">{{icons.mdiEyeSettings}}</v-icon>
            <v-icon v-else>{{icons.mdiEyeSettingsOutline}}</v-icon>
          </h1>
          <h1 v-else>
            {{imdb.Title}}
            <span v-if="imdb.Year">({{imdb.Year}})</span>
          </h1>
        </v-col>
        <div class="rating">
          <v-rating
            class="rating"
            :value="parseInt(imdb.imdbRating)"
            color="amber"
            dense
            half-increments
            readonly
            size="15"
          ></v-rating>
        </div>
      </v-row>
    </div>

    <v-container>
      <div
        class="details"
        v-bind:style="{
                  'background-image': 'url(' + image + ')',
                  'background-repeat': 'no-repeat',
                  'background-position': 'center',
                  'background-size': 'cover',
                  'height': 'auto',
                }"
      >
        <v-row class="mb-6" no-gutters>
          <v-col cols="10" md="2">
            <v-dialog v-if="torrenthash" v-model="dialog" persistent max-width="3000px">
              <template v-slot:activator="{ on }">
                <div class="poster" style="height: 450px;" v-on="on">
                  <a class="fancybox" data-fancybox-type="iframe">
                    <v-img
                      v-if="Posterimage"
                      :src="Posterimage"
                      width="300"
                      height="450"
                      border="0"
                    />
                    <v-img v-else :src="imdb.Poster" width="300" height="450" border="0" />
                  </a>
                </div>
              </template>
            </v-dialog>

            <div v-else class="poster" style="height: 450px;">
              <a class="fancybox" data-fancybox-type="iframe">
                <v-img v-if="Posterimage" :src="Posterimage" width="300" height="450" border="0" />
                <v-img v-else :src="imdb.Poster" width="300" height="450" border="0" />
              </a>
            </div>
          </v-col>
          <v-col cols="18" md="10">
            <div class>
              <div>
                <div class="pa-2 bg-dark-transparent" style="height:auto">
                  <v-row>
                    <v-col v-if="imdb.Director">
                      <div class="line">
                        <span>{{ this.language.moviePage.director }}:</span>
                        {{imdb.Director}}
                      </div>
                    </v-col>
                    <v-col>
                      <div class="line">
                        <span>{{ this.language.moviePage.genres }}:</span>
                        {{imdb.Genre}}
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col v-if="imdb.Released">
                      <div class="line">
                        <span>{{ this.language.moviePage.release }}:</span>
                        {{imdb.Released}}
                      </div>
                    </v-col>
                    <v-col v-if="imdb.Runtime">
                      <div class="line">
                        <span>Runtime:</span>
                        {{imdb.Runtime}}
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col v-if="imdb.Awards">
                      <div class="line">
                        <span>{{ this.language.moviePage.awards }}:</span>
                        {{imdb.Awards}}
                      </div>
                    </v-col>

                    <v-col>
                      <v-dialog v-model="dialogII" persistent max-width="600px">
                        <template v-slot:activator="{ on }">
                          <v-btn color="primary" dark v-on="on">Comments</v-btn>
                        </template>
                        <v-card class="details">
                          <div class="details subtitle">Movie Reviews:</div>
                          <div>
                            <div class="reviews" style="max-height: 600px; overflow:scroll;">
                              <v-comment v-for="(n, i) in comments" :key="i" :cmnt="n" />
                            </div>
                            <v-col cols="2" sm="6" md="12">
                              <v-text-field
                                width="500"
                                label="Comment"
                                outlined
                                shaped
                                id="comment"
                              ></v-text-field>
                            </v-col>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="green darken-1" text @click="dialogII = false">Cancel</v-btn>
                              <v-btn color="warning" text @click="addComment">Add Comment</v-btn>
                            </v-card-actions>
                          </div>
                        </v-card>
                      </v-dialog>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-dialog v-if="torrenthash" v-model="dialog" persistent max-width="1000">
                        <template v-slot:activator="{ on }">
                          <v-btn color="warning" dark v-on="on">
                            <v-icon>{{icons.mdiPlayCircleOutline}}</v-icon>Watch Now
                          </v-btn>
                        </template>
                        <v-card>
                          <div class="details">
                            <v-row>
                              <v-col>
                                <h2 class="subtitle">{{imdb.Title}}</h2>
                              </v-col>
                              <v-col>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn color="warning" text @click="dialog = false">
                                    <v-icon>{{icons.mdiClose}}</v-icon>
                                  </v-btn>
                                </v-card-actions>
                              </v-col>
                
                              <video
                                :poster="image"
                                loop="loop"
                                class="jw-video jw-reset"
                                id="video"
                                controls
                                style="width: 4000px; height: auto;"
                              >
                                <source
                                  :src="`http://localhost:3000/Home/video/${torrenthash}/${imdb.imdbID}`"
                                  type="video/mp4"
                                />
                                <track
                                  v-for="(sub, index) in Sub"
                                  :key="index"
                                  :label="sub.lang"
                                  kind="subtitles"
                                  :srclang="sub.langShort "
                                  :src="'data:text/vtt;base64,'+sub.fileName"
                                />Your browser does not support HTML5 video.
                              </video>
                            </v-row>
                          </div>
                        </v-card>
                      </v-dialog>
                    </v-col>
                    <v-col>
                      <v-btn color="warning" @click="WatchLater(movieInfo._id)">
                        <v-icon>{{icons.mdiClockOutline}}</v-icon>Watch Later
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <div>
                      <v-row>
                        <v-col>
                          <div style="color: bisque; font-size: 20px;">{{ this.language.moviePage.cast }}</div>
                        </v-col>
                      </v-row>
                      <v-row>
                        <div class="cast">{{imdb.Actors}}</div>
                      </v-row>
                      <v-row>
                        <div class="infotitle" style="color: bisque; font-size: 20px;">
                          <b style="color: bisque; font-size: 20px;">{{imdb.Title}}</b> {{ this.language.moviePage.synopsis }}
                        </div>
                      </v-row>
                      <v-row>
                        <div class="cast">{{imdb.Plot}}</div>
                      </v-row>
                    </div>
                  </v-row>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-container v-if="trailer">
          <h2 class="subtitle">"{{imdb.Title}}" {{ this.language.moviePage.trailer }}</h2>
          <iframe
            class="fancybox-iframe"
            frameborder="0"
            vspace="0"
            hspace="0"
            webkitallowfullscreen
            mozallowfullscreen
            allowfullscreen
            scrolling="auto"
            :src="trailer"
          ></iframe>
        </v-container>
      </div>
    </v-container>

    <v-container v-if="Similar !== []" class="details">
      <h2 class="subtitle">{{ this.language.moviePage.similar }} "{{imdb.Title}}"</h2>
      <div class="movies">
        <div
          class="movie"
          style="width: 229px; height: 343px; opacity: 1;"
          v-for="(item, i) in Similar"
          :key="i"
          @click="getSimilarMovieinfo(item.id)"
        >
          <a>
            <MovieCard :movie="item" />
          </a>
        </div>
      </div>
    </v-container>
    <v-container></v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import MovieCard from "@/components/SimilarMovies";
import Comment from "@/components/CommentList";
import Movie from "@/services/Movie";
import router from "@/router";
import {
  mdiPlayCircleOutline,
  mdiClose,
  mdiArrowUpDropCircle,
  mdiClockOutline,
  mdiEyeSettings,
  mdiEyeSettingsOutline
} from "@mdi/js";
export default {
  name: "MoviePage",
  components: {
    MovieCard: MovieCard,
    "v-comment": Comment
  },
  data() {
    return {
      icons: {
        mdiPlayCircleOutline,
        mdiClose,
        mdiClockOutline,
        mdiEyeSettings,
        mdiEyeSettingsOutline
      },
      comments: [],
      movieInfo: [],
      imdb: [],
      genre: "",
      image: "",
      Posterimage: "",
      trailer: "",
      Similar: [],
      torrenthash: "",
      dialog: false,
      dialogII: false,
      idmovie: "",
      Sub: "",
      Watched: false,
      offsetTop: 0,
      language: []
    };
  },
  computed: mapGetters(["user"]),
  methods: {
    addComment() {
      let cmnt = document.getElementById("comment").value;
      let get = this.$router.history.current.query;
      Movie.addComment(cmnt, get.id)
        .then(() => {
         
        })
        .catch(err => err);
         cmnt = '';
          document.getElementById("comment").value = ""
    },

    WatchLater(id) {
      Movie.watchLater(
        this.user._id,
        this.Posterimage,
        this.imdb.Title,
        id
      ).then(() => window.console.log("Comment"));
    },
    moviePath(id) {
      this.movieId = id;
      router.push("/moviePage?id=" + this.movieId);
    },
    getSimilarMovieinfo(id) {
      Movie.getSimilarMovieinfo(id)
        .then(rows => {
          window.console.log(rows.imdb_id);
          if (rows.imdb_id !== null || rows.imdb_id !== undefined) {
            location.replace("/moviePage?id=" + rows.imdb_id);
          }
        })
        .catch(err => err);
    }
  },

  beforeCreate() {
    window.console.log(this.$store.state.loggedf);
    // if (this.$store.state.loggedf === false) router.push("/login");
    let get = this.$router.history.current.query;
    Movie.getMovieInfo(get.id).then(rows => {
      if (rows.req.certification === "") router.push("/");
      window.console.log(rows);
      this.Watched = rows.Watched;
      this.movieInfo = rows.req;
      this.imdb = rows.imdb;
      this.idmovie = get.id;
      if (this.movieInfo != undefined) {
        this.image = this.movieInfo.images.fanart;
        this.Posterimage = this.movieInfo.images.poster;
        if (this.movieInfo.torrents != undefined) {
          this.torrenthash = this.movieInfo.torrents.en["1080p"].url.substr(
            20,
            40
          );
        } else {
          this.torrenthash = this.movieInfo.url.substr(20, 40);
        }
        if (this.movieInfo.trailer != undefined)
          this.trailer = this.movieInfo.trailer.replace("watch?v=", "/embed/");
      } else {
        this.image = this.imdb.Poster;
      }
    });
  },
  beforeMount() {
    let get = this.$router.history.current.query;
    Movie.getSimilarMovie(get.id).then(rows => {
      this.Similar = rows;
    });
  },
  created() {
    this.language = require('../../plugins/lang/lang_' + this.$store.state.lang +'.js');
  },
  mounted() {
    let get = this.$router.history.current.query;
    Movie.getSub(get.id).then(path => {
      this.Sub = path.data;
      window.console.log("path.data[i].data");
      window.console.log(this.Sub);
    });
  },
  updated() {
    this.$store.state.loggedf = true;

    let get = this.$router.history.current.query;
    Movie.getComments(get.id).then(comments => {
      this.comments = comments.data;
    });
  }
};
</script>

<style scoped>
.jw-reset {
  text-align: left;
  direction: ltr;
}
.jwplayer video {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  background: transparent;
}
.subtitle {
  font-family: bold;
  font-size: 30px;
  margin-bottom: 30px;
  line-height: 1.2;
  text-shadow: 0 0 6px #000;
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
.fancybox-iframe {
  display: block;
  width: 100%;
  height: 500px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  border-radius: 15px;
  overflow: hidden;
}
.image {
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  backdrop-filter: brightness(150%) saturate(150%) blur(1rem);
}
body,
html {
  height: 100%;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}
.bg-dark-transparent {
  background-color: rgba(0, 0, 0, 0.7) !important;
  /* background-color:#343a40ad;
  color:rgba(255, 255, 255, 0.8); */
}
.img-back {
  filter: blur(0.2rem);
  border-radius: 0 0 100% 0;
}
.v-card-title {
  filter: none;
}
.cardinfo {
  margin-left: 0%;
}
.rating v-rating {
  float: left;
}
.info {
  width: 100%;
  min-height: 100%;
  padding: 30px;
  padding-left: 340px;
  position: absolute;
  float: right;
  left: 0;
  top: 0;
  z-index: 1;
  font-size: 18px;
}
.details {
  background-color: #111;
  background-color: rgba(17, 17, 17, 0.8);
  overflow: hidden;
  padding: 10px;
  position: relative;
  max-width: auto;
}

@media (max-width: 900px) {
  .fullinfo {
    position: relative;
    bottom: 10px;
    margin-left: 5px;
    padding-left: 10px;
  }
}

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
c anvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  outline: 0;
}
.line {
  width: 50%;
  margin-bottom: 20px;
  float: left;
  color: #ccc;
  line-height: 1.3;
  padding-right: 20px;
  font-size: 18px;
  margin-left: 10px;
  font-family: light;
}
span {
  font-size: 20px;
  color: bisque;
}
.cast {
  font-size: 20px;
}
.title {
  background-color: rgba(17, 17, 17, 0.8);

  background-position: top;
  background-repeat: repeat-x;
  margin-bottom: 1px;
  overflow: hidden;
  padding: 25px;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 50px #000;
}
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
