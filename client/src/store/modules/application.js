import axios from 'axios';

const state = {
	applications: [],
	status: '',
	error: null,
	profile: false,
	applicationProfile: {},
	application: null
}

//getters
const getters = {
}

// mutations
const mutations = {
	applications_request(state) {
		state.status = 'loading'
	},
	applications_list(state, users) {
		state.applications = users
	},
	application_request(state) {
		state.status = 'loading'
	},
	application_profile(state, user) {
		state.applicationProfile = user
	},
	register_application_request(state) {
		state.error = null
		state.status = 'loading'
	},
	register_application_success(state) {
		state.error = null
		state.status = 'success'
	},
	register_application_error(state, err) {
		state.error = err.response.data.message
	},
	update_application_request(state) {
		state.error = null
		state.status = 'loading'
	},
	update_application_success(state, user) {
		state.error = null
		state.status = 'success'
		state.application = user
	},
	update_application_error(state, err) {
		state.error = err.response.data.message
	},
};

// actions
const actions = {
	// Get application profile
	async getApplicationById({
		commit
	}, id) {
		commit('application_request');
		let res = await axios.get(`http://localhost:5000/applications/${id}`)
		try {
			if (res.data.success) {
				commit('application_profile', res.data.user)
				console.log('application profile', res.data.user)
				return res;
			}
			else {
				console.log('Error, application', res)
				return false
			}
		} catch (err) {
			console.log('Error', err)
			return false
		}
	},

	// Get all applications
	async getApplications({
		commit
	}) {
		try {
			commit('applications_request');
			let res = await axios.get('http://localhost:5000/applications')
			console.log(res.data.user)
			commit('applications_list', res.data.user)
			return res;
		} catch (err) {
			console.log('Error', err)
		}
	},

	//Create application profile
	async createApplication({
		commit
	}, userData) {
		try {
			commit('register_application_request');
			console.log('req body', userData)
			let res = await axios.post('http://localhost:5000/applications', userData);
			if (res.data.success) {
				commit('register_application_success');
				return res;
			} else {
				console.log('failed', res)
			}
		} catch (err) {
			commit('register_application_error', err)
		}
	},

	//Update application profile
	async updateApplication({
		commit
	}, userData) {
		try {
			commit('update_application_request');
			console.log('sent', userData)
			let res = await axios.put(`http://localhost:5000/applications/${userData.id}`, userData.user);
			console.log(userData.user)
			if (res.data.success) {
				console.log('sucess')
				console.log(res.data.user);
				commit('update_application_success', res.data.user);
			}
			else {
				console.log('failed', res)
			}
			return res;
		} catch (err) {
			commit('update_application_error', err)
		}
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}