import axios from 'axios';
import router from '../../router/index';

const state = {
    token: localStorage.getItem('token') || '',
    id: localStorage.getItem('user_id') || '',
    role: localStorage.getItem('user_role') || '',
    user: {},
    status: '',
    error: null
};

const getters = {
    isLoggedIn: state => !!state.token,
    authState: state => state.status,
    user: (state) => state.user,
    error: state => state.error, 
    id: state => state.id,
    role: state => state.role
};

const actions = {
    // Login Action
    async login({
        commit
    }, user) {
        commit('auth_request');
        try {
            let res = await axios.post('http://localhost:5000/users/login-user', user)
            if (res.data.success) {
                const token = res.data.token;
                const user = res.data.user;
                // Store the token into the localstorage
                localStorage.setItem('token', token);
                // Store the token into the localstorage
                localStorage.setItem('user_id', user._id);
                localStorage.setItem('user_role', user.role);
                // Set the axios defaults
                axios.defaults.headers.common['Authorization'] = token;
                commit('auth_success', token, user);
            }
            return res;
        } catch (err) {
            commit('auth_error', err);
        }
    },
    //Login Charity
    async loginCharity({
        commit
    }, user) {
        commit('auth_request');
        try {
            let res = await axios.post('http://localhost:5000/users/login-charity', user)
            if (res.data.success) {
                const token = res.data.token;
                const user = res.data.user;
                // Store the token into the localstorage
                localStorage.setItem('token', token);
                // Store the token into the localstorage
                localStorage.setItem('user_id', user._id);
                localStorage.setItem('user_role', user.role);
                // Set the axios defaults
                axios.defaults.headers.common['Authorization'] = token;
                commit('auth_success', token, user);
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
            let res = await axios.post('http://localhost:5000/users/register-user', userData);
            if (res.data.success !== undefined) {
                commit('register_success');
            }
            return res;
        } catch (err) {
            commit('register_error', err)
        }
    },
    // Register Charity
    async registerCharity({
        commit
    }, userData) {
        try {
            commit('register_request');
            let res = await axios.post('http://localhost:5000/users/register-charity', userData);
            if (res.data.success !== undefined) {
                commit('register_success');
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
        commit('profile_request');
        let res = await axios.get('http://localhost:5000/users/profile')
        if (res.data !== undefined) {
            commit('user_profile', res.data)
        }
        else {
            console.log('Error', res)
        }
        return res;
    },

    // Logout the user
    async logout({
        commit
    }) {
        await localStorage.removeItem('token');
        localStorage.removeItem('user_role')
        localStorage.removeItem('user_id')
        commit('logout');
        delete axios.defaults.headers.common['Authorization'];
        router.push('/auth/login');
        return
    }
};

const mutations = {
    profile_request(state) {
        state.status = 'loading'
    },
    user_profile(state, user) {
        state.user = user
    },
    auth_request(state) {
        state.error = null
        state.status = 'loading'
    },
    auth_success(state, token, user) {
        state.user = user
        state.token = token
        state.status = 'success'
        state.error = null
    },
    auth_error(state, err) {
        state.error = err.response.data.message
    },
    register_request(state) {
        state.error = null
        state.status = 'loading'
    },
    register_success(state) {
        state.error = null
        state.status = 'success'
    },
    register_error(state, err) {
        state.error = err.response.data.message
    },
    logout(state) {
        state.error = null
        state.status = ''
        state.token = ''
        state.user = ''
        state.role = ''
        state.id = ''
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};