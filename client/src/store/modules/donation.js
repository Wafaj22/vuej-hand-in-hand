import axios from 'axios';

const state = {
	donations: [],
	status: '',
	error: null,
	profile: false,
	donationProfile: {},
	donation: null
}

//getters
const getters = {
}

// mutations
const mutations = {
	donations_request(state) {
		state.status = 'loading'
	},
	donations_list(state, users) {
		state.donations = users
	},
	donation_request(state) {
		state.status = 'loading'
	},
	donation_profile(state, user) {
		state.donationProfile = user
	},
	register_donation_request(state) {
		state.error = null
		state.status = 'loading'
	},
	register_donation_success(state) {
		state.error = null
		state.status = 'success'
	},
	register_donation_error(state, err) {
		state.error = err.response.data.message
	},
	payment_request(state) {
		state.error = null
		state.status = 'loading'
	},
	payment_success(state) {
		state.error = null
		state.status = 'success'
	},
	payment_error(state, err) {
		state.error = err.response.data.message
	},
	update_donation_request(state) {
		state.error = null
		state.status = 'loading'
	},
	update_donation_success(state, user) {
		state.error = null
		state.status = 'success'
		state.donation = user
	},
	update_donation_error(state, err) {
		state.error = err.response.data.message
	},
};

// actions
const actions = {
	// Get donation profile
	async getDonationById({
		commit
	}, id) {
		commit('donation_request');
		let res = await axios.get(`http://localhost:5000/donations/${id}`)
		try {
			if (res.data.success) {
				commit('donation_profile', res.data.user)
				console.log('donation profile', res.data.user)
				return res;
			}
			else {
				console.log('Error, donation', res)
				return false
			}
		} catch (err) {
			console.log('Error', err)
			return false
		}
	},

	// Get all donations
	async getDonations({
		commit
	}) {
		try {
			commit('donations_request');
			let res = await axios.get('http://localhost:5000/donations')
			console.log(res.data.user)
			commit('donations_list', res.data.user)
			return res;
		} catch (err) {
			console.log('Error', err)
		}
	},

	//Create donation profile
	async createDonation({
		commit
	}, userData) {
		try {
			commit('register_donation_request');
			console.log('req body', userData)
			let res = await axios.post('http://localhost:5000/donations', userData);
			if (res.data.success) {
				commit('register_donation_success');
				return res;
			} else {
				console.log('failed', res)
			}
		} catch (err) {
			commit('register_donation_error', err)
		}
	},

	//Stripe Payment
	async payment({
		commit
	}, userData) {
		try {
			commit('payment_request');
			console.log('req body', userData) //Body JSON.stringify({name:..,})
			let res = await axios.post('http://localhost:5000/pay/create-checkout-session', userData);
			if (res.status=='200') {
				commit('payment_success');
				console.log('response res', res)
				return res.data;
			} else {
				console.log('failed', res)
			}
		} catch (err) {
			commit('payment_error', err)
		}
	},

	//Update donation profile
	async updateDonation({
		commit
	}, userData) {
		try {
			commit('update_donation_request');
			console.log('sent', userData)
			let res = await axios.put(`http://localhost:5000/donations/${userData.id}`, userData.user);
			console.log(userData.user)
			if (res.data.success) {
				console.log('sucess')
				console.log(res.data.user);
				commit('update_donation_success', res.data.user);
			}
			else {
				console.log('failed', res)
			}
			return res;
		} catch (err) {
			commit('update_donation_error', err)
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