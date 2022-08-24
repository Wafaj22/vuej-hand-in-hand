import axios from 'axios';

const state = {
	notifications: [],
	status: '',
	error: null,
	profile: false,
	notificationProfile: {},
	notification: null
}

//getters
const getters = {
}

// mutations
const mutations = {
	notifications_request(state) {
		state.status = 'loading'
	},
	notifications_list(state, users) {
		state.notifications = users
	},
	notification_request(state) {
		state.status = 'loading'
	},
	notification_profile(state, user) {
		state.notificationProfile = user
	},
	register_notification_request(state) {
		state.error = null
		state.status = 'loading'
	},
	register_notification_success(state) {
		state.error = null
		state.status = 'success'
	},
	register_notification_error(state, err) {
		state.error = err.response.data.message
	},
	update_notification_request(state) {
		state.error = null
		state.status = 'loading'
	},
	update_notification_success(state, user) {
		state.error = null
		state.status = 'success'
		state.notification = user
	},
	update_notification_error(state, err) {
		state.error = err.response.data.message
	},
};

// actions
const actions = {
	// Get notifications
	async getNotificationById({
		commit
	}, id) {
		commit('notification_request');
		let res = await axios.get(`http://localhost:5000/notification/${id}`)
		try {
			if (res.data.success) {
				commit('notification_profile', res.data.user)
				console.log('notification profile', res.data.user)
				return res;
			}
			else {
				console.log('Error, notification', res)
				return false
			}
		} catch (err) {
			console.log('Error', err)
			return false
		}
	},

	// Get all notifications
	async getnotifications({
		commit
	}) {
		try {
			commit('notifications_request');
			let res = await axios.get('http://localhost:5000/notification')
			console.log(res.data.user)
			commit('notifications_list', res.data.user)
			return res;
		} catch (err) {
			console.log('Error', err)
		}
	},

	//Create notification profile
	async createnotification({
		commit
	}, userData) {
		try {
			commit('register_notification_request');
			console.log('req body', userData)
			let res = await axios.post('http://localhost:5000/notification', userData);
			if (res.data.success) {
				commit('register_notification_success');
				return res;
			} else {
				console.log('failed', res)
			}
		} catch (err) {
			commit('register_notification_error', err)
		}
	},

	//Update notification profile
	async updatenotification({
		commit
	}, userData) {
		try {
			commit('update_notification_request');
			console.log('sent', userData)
			let res = await axios.put(`http://localhost:5000/notification/${userData.id}`, userData.user);
			console.log(userData.user)
			if (res.data.success) {
				console.log('sucess')
				console.log(res.data.user);
				commit('update_notification_success', res.data.user);
			}
			else {
				console.log('failed', res)
			}
			return res;
		} catch (err) {
			commit('update_notification_error', err)
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