import axios from 'axios';
import router from '../router/index';
import stro from '../store'
// import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

const state = {
    token: localStorage.getItem('token') || '',
    user: {},
    status: '',
    error: null,
    success: null
};
var link = "http://localhost:3000"
const getters = {
    // isLoggedIn: function (state) {
    //     if (state.token != '') {
    //         return true
    //     } else {
    //         return false
    //     }
    // }
    isLoggedIn: state => !!state.token,
    authState: state => state.status,
    user: state => state.user,
    error: state => state.error,
    success: state => state.success,
};

const actions = {
    // Login Action
    async login({
        commit
    }, user) {
        commit('auth_request');
        try {
            let res = await axios.post(link + '/users/login', user)
            if (res.data.success) {
                
                const token = res.data.token;
                const user = res.data.user;
                // Store the token into the localstorage
                localStorage.setItem('token', token);
                // Set the axios defaults
                stro.state.loggedf = true;
                axios.defaults.headers.common['Authorization'] = token;
                commit('auth_success', token, user);
            } else {
                commit('auth_error', res);
                setTimeout(function(){ state.error = '' }, 5000);
            }
            return res;
        } catch (err) {
            commit('auth_error', err);
        }
    },
    // Register User
    async register({
        commit
    }, userData) {
        try {
            commit('register_request');
            let res = await axios.post(link + '/users/register', userData);
            if (res.data.success === true){
                commit('register_success', res);
                setTimeout(function(){ state.success = '' }, 5000);
        }
            else {
                commit('register_error', res)
                setTimeout(function(){ state.error = '' }, 5000);
            }
            return res;
        } catch (err) {
            commit('register_error', err)
        }
    },
    // Get the user Profile
    async getProfile({
        commit
    }) {
        try {
            commit('profile_request');
            let res = await axios.get(link + '/users/profile')
            if (res.status != 200) {
                delete axios.defaults.headers.common['Authorization'];
                router.push('/login');
            }
  
            stro.state.lang = res.data.user.lang;
            commit('user_profile', res.data.user)
            return res;
        } catch (err) {
            await localStorage.removeItem('token');
            commit('logout');
            delete axios.defaults.headers.common['Authorization'];
            router.push('/login');
            return
        }
    },
    // Get another user's Profile
    async get_other_Profile({
        commit
    }, user) {
        try {
            commit('otherprofile_request');
            let res = await axios.post(link + '/users/user', { "user": user })
            if (res.status != 200) {
                
                router.push('/profile');
            } else {
                commit('otheruser_profile', res.data.user)
                setTimeout(function(){ state.error = '' }, 5000);
                return res;
            }

        } catch (err) {
            return;
        }
    },
    // Logout the user
    async logout({
        commit
    }) {
        await localStorage.removeItem('token');
        commit('logout');
        delete axios.defaults.headers.common['Authorization'];

        try {
            this.$store.state.loggedf = true;

        } catch (error) {
            window.console.log(error)
        }

        router.push('/login');
        return
    },
    // Validation account by token 
    async validation({
        commit
    }, token) {
        commit('validation_request');
        try {
            let res = await axios.get(link + '/users/validation/' + token)
            if (res.data.success){
                commit('validation_success', res);
                setTimeout(function(){ state.success = '' }, 5000);

            }
            else{
                commit('validation_error', res);
                setTimeout(function(){ state.error = '' }, 5000);
            }

            return res;
        } catch (err) {
            commit('validation_error', err);
        }
    },
    // Change password by token
    async resetpasswd({
        commit
    }, data) {
        commit('resetpasswd_request');
        try {
            let res = await axios.post(link + '/users/reset/', data)
            if (res.data.success){
                commit('resetpasswd_success', res);
                setTimeout(function(){ state.success = '' }, 5000);

            }
            else{
                
                commit('resetpasswd_error', res);
                setTimeout(function(){ state.error = '' }, 5000);
            }

            return res;
        } catch (err) {
            commit('resetpasswd_error', err);
        }
    },
    // Send reset password link to email 
    async forgotpasswd({
        commit
    }, data) {
        commit('forgotpasswd_request');
        try {
            let res = await axios.post(link + '/users/forgotpasswd/', data)
            if (res.data.success){
                commit('forgotpasswd_success', res);
                setTimeout(function(){ state.success = '' }, 5000);

            } 
            else
            {
                commit('forgotpasswd_error', res);
                setTimeout(function(){ state.error = '' }, 5000);
            }

            return res;
        } catch (err) {
            commit('forgotpasswd_error', err);
            setTimeout(function(){ state.error = '' }, 5000);

        }
    },
    // Update profile infos
    async updateprofile({
        commit
    }, data) {
        commit('updateprofile_request');
        try {
            let res = await axios.post(link + '/users/updateprofile/', data)
            if (res.data.success)
            {
                stro.state.lang = data.lang;
                commit('updateprofile_success', res);
                setTimeout(function(){ state.success = '' }, 5000);

            }
            else{
                commit('updateprofile_error', res);
                setTimeout(function(){ state.error = '' }, 5000);
        }

            return res;
        } catch (err) {
            commit('updateprofile_error', err);
            setTimeout(function(){ state.error = '' }, 5000);

        }
    },
   // Update password 
   async updatepassword({
    commit
}, data) {
    commit('updatepassword_request');
    try {
        let res = await axios.post(link + '/users/updatepassword/', data)
        if (res.data.success)
        {
            stro.state.lang = data.lang;
            commit('updatepassword_success', res);
            setTimeout(function(){ state.success = '' }, 5000);

        }
        else
        {
            commit('updatepassword_error', res);
        setTimeout(function(){ state.error = '' }, 5000);


        }

        return res;
    } catch (err) {
        commit('updatepassword_error', err);
        window.console.log(state.error);
        setTimeout(function(){ state.error = '' }, 5000);


    }
},
};

const mutations = {
    auth_request(state) {
        state.error = null
        state.status = 'loading'
    },
    auth_success(state, token, user) {
        state.token = token
        state.user = user
        state.status = 'success'
        state.error = null
        state.success = ''
    },
    auth_error(state, err) {
        state.error = err.data.msg
    },
    register_request(state) {
        state.error = null
        state.status = 'loading'
    },
    register_success(state, res) {
        state.error = null
        state.status = res.data.msg
        state.success = res.data.msg
    },
    register_error(state, err) {
        state.error = err.data.msg
    },
    logout(state) {
        state.error = null
        state.status = ''
        state.token = ''
        state.user = ''
    },
    profile_request(state) {
        state.status = 'loading'
    },
    user_profile(state, user) {
        state.user = user
    },
    otherprofile_request(state) {
        state.status = 'loading'
    },
    otheruser_profile(state, user) {
        state.user = user
    },
    validation_request(state) {
        state.error = null
        state.status = 'loading';
    },
    validation_success(state, res) {
        state.error = null
        state.status = 'success'
        state.success = res.data.msg
    },
    validation_error(state, err) {
        state.error = err.data.msg
    },
    resetpasswd_request(state) {
        state.error = null
        state.status = 'loading';
    },
    resetpasswd_success(state, res) {
        state.error = null
        state.status = 'success'
        state.success = res.data.msg
    },
    resetpasswd_error(state, err) {
        state.error = err.data.msg
    },
    forgotpasswd_request(state) {
        state.error = null
        state.status = 'loading';
    },
    forgotpasswd_success(state, res) {
        state.error = null
        state.status = 'success'
        state.success = res.data.msg
    },
    forgotpasswd_error(state, err) {
        state.error = err.data.msg
    },
    updateprofile_request(state) {
        state.error = null
        state.status = 'loading';
    },
    updateprofile_success(state, res) {
        state.error = null
        state.status = 'success'
        state.success = res.data.msg
    },
    updateprofile_error(state, err) {
        state.error = err.data.msg
    },
    updatepassword_request(state) {
        state.error = null
        state.status = 'loading';
    },
    updatepassword_success(state, res) {
        state.error = null
        state.status = 'success'
        state.success = res.data.msg
    },
    updatepassword_error(state, err) {
        state.error = err.data.msg
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};