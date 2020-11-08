import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue"
import MoviePage from "../views/Movie/MoviePage.vue"
import BoxOffice from '../views/Movie/BoxOffice.vue'
import Library from '../views/Movie/Library.vue'
import UpComing from '../views/Movie/UpComing.vue'
import WatchedMovies from '../views/Movie/WatchedMovies.vue'
import Error from '../views/Movie/Error.vue'
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
        requiresAuth: true
    }
  }, 
  {
    path: "/moviePage",
    name: "moviePage",
    component: MoviePage,
    meta: {
        requiresAuth: true
    }
  },
  {
    path: "/about",
    name: "about",
    component: About
    
  },
  {
    path: "/BoxOffice",
    name: "BoxOffice",
    component: BoxOffice,
    meta: {
        requiresAuth: true
    }
  },
  {

    path: "/Library",
    name: "Library",
    component: Library,
    meta: {
        requiresAuth: true
    }
  }, 
  {
    path: "/Upcoming",
    name: "UpComing",
    component: UpComing,
    meta: {
        requiresAuth: true
    }
  },
  {
    path: "/WatchedMovies",
    name: "WatchedMovies",
    component: WatchedMovies,
    meta: {
        requiresAuth: true
    }
  },
  {
    path: "/Error",
    name: "Error",
    component: Error
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
        import ('../views/users/Login.vue'),
    meta: {
        requiresGuest: true
    }
},
{
    path: '/register',
    name: 'register',
    component: () =>
        import ('../views/users/Register.vue'),
    meta: {
        requiresGuest: true
    }
},
{
    path: '/profile',
    name: 'profile',
    component: () =>
        import ('../views/users/Profile.vue'),
    meta: {
        requiresAuth: true
    }
},
{
    path: '/validation',
    name: 'validation',
    component: () =>
        import ('../views/users/Validation.vue'),
},
{
    path: '/resetpassword',
    name: 'resetPassword',
    component: () =>
        import ('../views/users/ResetPassword.vue'),
    meta: {
        requiresGuest: true
    }
},
{
    path: '/forgotpass',
    name: 'ForgotPass',
    component: () =>
        import ('../views/users/ForgotPass.vue'),
    meta: {
        requiresGuest: true
    }
},
{
    path: '/editprofile',
    name: 'EditProfile',
    component: () =>
        import ('../views/users/EditProfile.vue'),
    meta: {
        requiresAuth: true
    }
},
{
    path: '/42',
    beforeEnter(){
        window.location.href = 'http://localhost:3000/users/auth/42'
    }
},
{
    path: '/sp',
    beforeEnter(){
        window.location.href = 'http://localhost:3000/users/auth/spotify'
    }
},
{
    path: '/gh',
    beforeEnter(){
        window.location.href = 'http://localhost:3000/users/auth/github'
    }
}
];



const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!store.getters.isLoggedIn) {
          // Redirect to the Login Page
          next('/login');
      } else {
          next();
      }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
      if (store.getters.isLoggedIn) {
          // Redirect to the Login Page
          next('/profile');
      } else {
          next();
      }
  } else {
      next()
  }
});

export default router;
