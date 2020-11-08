<template>
    <v-container class="details">
        <div class="tagline">
            <span class="title ml-3 mr-5">ᕼYᑭEᖇ&nbsp; <span class="font-weight-light">ᵀᵘᵇᵉ</span>{{ this.language.desc }}</span>
        </div>
        <div class="movies">
            <div class="movie" style="width: 200px; height: 300px; opacity: 1;" v-for="item in movies" :key="item.id" @click="moviePath(item.movieid)">
                <v-Movies :n="item" />
            </div>
        </div>
    </v-container>
</template>

<script>
import WatchedMovies from "@/components/WatchedMovies"
import Movie from "../../services/Movie";
import router from '@/router'
export default {
    name: 'WatchedMovies',
    components: {
        'v-Movies': WatchedMovies
    },
    data: () => ({
        movies: [],
        language: []
    }),
    methods: {
        moviePath(id) {
            this.movieId = id;
            router.push("/moviePage?id=" + this.movieId);
        },
    },
    created() {
        if (!this.$store.state.loggedf)
            router.push('/login')
        Movie.MovieWatched(6)
            .then((result) => {
                window.console.log(result.data)
                this.movies = result.data
            })
        this.language = require('../../plugins/lang/lang_' + this.$store.state.lang +'.js');
    }
}
</script>

<style scoped>
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
    opacity: 0;
}

.movies {
    margin-bottom: 30px;
    overflow: hidden;
}
</style>