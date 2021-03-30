import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import MoviePage from "../views/Movie/MoviePage.vue";
import BoxOffice from "../views/Movie/BoxOffice.vue";
import Library from "../views/Movie/Library.vue";
import UpComing from "../views/Movie/UpComing.vue";
import WatchedMovies from "../views/Movie/WatchedMovies.vue";
import Error from "../views/Movie/Error.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/moviePage",
    name: "moviePage",
    component: MoviePage,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/BoxOffice",
    name: "BoxOffice",
    component: BoxOffice,
  },
  {
    path: "/Library",
    name: "Library",
    component: Library,
  },
  {
    path: "/Upcoming",
    name: "UpComing",
    component: UpComing,
  },
  {
    path: "/WatchedMovies",
    name: "WatchedMovies",
    component: WatchedMovies,
  },
  {
    path: "/Error",
    name: "Error",
    component: Error,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      // Redirect to the Login Page
      next("/login");
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (store.getters.isLoggedIn) {
      // Redirect to the Login Page
      next("/profile");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
