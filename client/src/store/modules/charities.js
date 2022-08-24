import axios from 'axios';

const state = {
	tagItems: [],
	filteredProduct: [],
	searchTerm: '',
	
	charities: [],
	status: '',
	error: null,
	profile: false,
	charityProfile: {},
	charity: null
}

// getters
const getters = {

	getCities: (state) => {
		const charities = [...new Set(state.charities.map(charity => charity.city))]
		return charities
	},

	getCauses: (state) => {
		var uniqueCause = []
		var causes = Array();
		state.charities.map((charity) => {
			if (charity.cause) {
				charity.cause.map((cause) => {
					const index = uniqueCause.indexOf(cause);
					if (index === -1) uniqueCause.push(cause);
				})
			}
		});
		for (var i = 0; i < uniqueCause.length; i++) {
			causes.push({ cause: uniqueCause[i] })
		}
		return causes
	},

	filterCharities: (state) => {
		return state.filteredProduct.filter((product) => {
			if (!state.tagItems.length) {
				return true
			}
			const Tags = state.tagItems.some((prev) => { // Match Tags
				if (product.tags) {
					if (product.tags.includes(prev)) {
						return prev
					}
				}
			})
			return Tags
		})
	},
	getOrder: (state) => {
		return state.order
	}
}

// mutations
const mutations = {
	priceFilter: (state) => {
		state.filteredProduct = []
		state.charities.find((charity) => {
			state.filteredProduct.push(charity)
			// if (charity.startDate >= payload[0] && charity.startDate <= payload[1]) {

			// }
		})
	},

	getByCharityId: (state, payload) => {
		state.filteredProduct = []
		state.charities.find((charity) => {
			if (charity.charity.id == payload) {
				state.filteredProduct.push(charity)
			}
		})
	},

	setTags: (state, payload) => {
		state.tagItems = payload
	},

	sortCharities: (state, payload) => {
		if (payload === 'a-z') {
			state.filteredProduct.sort(function (a, b) {
				if (a.user.name < b.user.name) {
					return -1
				} else if (a.user.name > b.user.name) {
					return 1
				}
				return 0
			})
		} else if (payload === 'z-a') {
			state.filteredProduct.sort(function (a, b) {
				if (a.user.name > b.user.name) {
					return -1
				} else if (a.user.name < b.user.name) {
					return 1
				}
				return 0
			})
		}
	},
	charities_request(state) {
		state.status = 'loading'
	},
	charities_list(state, users) {
		state.filteredProduct = users
		state.charities = users
	},
	charity_request(state) {
		state.status = 'loading'
	},
	charity_profile(state, user) {
		state.charityProfile = user
	},
	register_charity_request(state) {
		state.error = null
		state.status = 'loading'
	},
	register_charity_success(state) {
		state.error = null
		state.status = 'success'
	},
	register_charity_error(state, err) {
		state.error = err.response.data.message
	},
	update_charity_request(state) {
		state.error = null
		state.status = 'loading'
	},
	update_charity_success(state, user) {
		state.error = null
		state.status = 'success'
		state.charity = user
	},
	update_charity_error(state, err) {
		state.error = err.response.data.message
	},
}

// actions
const actions = {
	// Get charity profile
	async getCharityById({
		commit
	}, id) {
		commit('charity_request');
		let res = await axios.get(`http://localhost:5000/charities/${id}`)
		try {
			if (res.data.success) {
				commit('charity_profile', res.data.user)
				console.log('charity profile', res.data.user)
				return res;
			}
			else {
				console.log('Error, charity', res)
				return false
			}
		} catch (err) {
			console.log('Error', err)
			return false
		}
	},

	// Get all charities
	async getCharities({
		commit
	}) {
		try {
			commit('charities_request');
			let res = await axios.get('http://localhost:5000/charities')
			console.log(res.data.user)
			commit('charities_list', res.data.user)
			return res;
		} catch (err) {
			console.log('Error', err)
		}
	},

	//Create charity profile
	async createCharity({
		commit
	}, userData) {
		try {
			commit('register_charity_request');
			console.log('req body', userData)
			let res = await axios.post('http://localhost:5000/charities', userData);
			if (res.data.success) {
				commit('register_charity_success');
				return res;
			} else {
				console.log('failed', res)
			}
		} catch (err) {
			console.log(err)
			commit('register_charity_error', err)
		}
	},

	//Update charity profile
	async updateCharity({
		commit
	}, userData) {
		try {
			commit('update_charity_request');
			console.log('sent', userData)
			let res = await axios.put(`http://localhost:5000/charities/${userData.id}`, userData.user);
			console.log(userData.user)
			if (res.data.success) {
				commit('update_charity_success', res.data.user);
			}
			else {
				console.log('failed', res)
			}
			return res;
		} catch (err) {
			console.log('error',err)
			commit('update_charity_error', err)
		}
	},
	sortCharities: (context, payload) => {
		context.commit('sortCharities', payload)
	},
	priceFilter: (context, payload) => {
		context.commit('priceFilter', payload)
	},
	getByCharityId: (context, payload) => {
		context.commit('getByCharityId', payload)
	},
	setTags: (context, payload) => {
		context.commit('setTags', payload)
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
