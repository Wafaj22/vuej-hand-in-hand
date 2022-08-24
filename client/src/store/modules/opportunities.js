import moment from "moment"
import axios from 'axios';

const state = {
	tagItems: [],
	filteredProduct: [],
	searchTerm: '',

	opportunities: [],
	status: '',
	error: null,
	profile: false,
	opportunityProfile: {},
	opportunity: null
}

// getters
const getters = {
		
	getCities: (state) => {
		const cities = [...new Set(state.opportunities.map(opportunity => opportunity.city))]
		return cities
	},

	getCharities: (state) => {
		const charities = [...new Set(state.opportunities.map(opportunity => opportunity.charity.user.name))]
		return charities
	},

	getCauses: (state) => {
		var uniqueCause = []
		var causes = Array();
		state.opportunities.map((opportunity) => {
			if (opportunity.cause) {
				opportunity.cause.map((cause) => {
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
	getSkills: (state) => {
		var uniqueSkills = []
		var itemSkill = Array();
		state.opportunities.map((opportunity) => {
			if (opportunity.skills) {
				opportunity.skills.map((skill) => {
					const index = uniqueSkills.indexOf(skill);
					if (index === -1) uniqueSkills.push(skill);
				})
			}
		});
		for (var i = 0; i < uniqueSkills.length; i++) {
			itemSkill.push({ skills: uniqueSkills[i] })
		}
		return itemSkill
	},
	
	filterOpportunities: (state) => {
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
}

// mutations
const mutations = {		
	opportunities_request(state) {
		state.status = 'loading'
	},
	opportunities_list(state, users) {
		state.filteredProduct = users
		state.opportunities = users
	},
	opportunity_request(state) {
		state.status = 'loading'
	},
	opportunity_profile(state, user) {
		state.opportunityProfile = user
	},
	register_opportunity_request(state) {
		state.error = null
		state.status = 'loading'
	},
	register_opportunity_success(state) {
		state.error = null
		state.status = 'success'
	},
	register_opportunity_error(state, err) {
		state.error = err.response.data.message
	},
	update_opportunity_request(state) {
		state.error = null
		state.status = 'loading'
	},
	update_opportunity_success(state, user) {
		state.error = null
		state.status = 'success'
		state.opportunity = user
	},
	update_opportunity_error(state, err) {
		state.error = err.response.data.message
	},
	
	priceFilter: (state) => {
		state.filteredProduct = []
		state.opportunities.find((opportunity) => {
			state.filteredProduct.push(opportunity)
			// if (opportunity.createdAt >= payload[0] && opportunity.createdAt <= payload[1]) {

			// }
		})
	},

	getByCharityId: (state, payload) => {
		state.filteredProduct = []
		state.opportunities.find((opportunity) => {
			if (opportunity.opportunity.id == payload) {
				state.filteredProduct.push(opportunity)
			}
		})
	},

	setTags: (state, payload) => {
		state.tagItems = payload
	},
	sortOpportunities: (state, payload) => {
		if (payload === 'a-z') {
			state.filteredProduct.sort(function (a, b) {
				if (a.title < b.title) {
					return -1
				} else if (a.title > b.title) {
					return 1
				}
				return 0
			})
		} else if (payload === 'z-a') {
			state.filteredProduct.sort(function (a, b) {
				if (a.title > b.title) {
					return -1
				} else if (a.title < b.title) {
					return 1
				}
				return 0
			})
			//moment(a.createdAt).format("dd-mm-yyyy")< moment(b.createdAt).format("dd-mm-yyyy")
		} else if (payload === 'ascending') {
			state.filteredProduct.sort(function (a, b) {
				if (moment(a.createdAt).isBefore(b.createdAt)) {
					return -1
				} else if (moment(a.createdAt).isAfter(b.createdAt)) {
					return 1
				}
				return 0
			})
		} else if (payload === 'descending') {
			state.filteredProduct.sort(function (a, b) {
				if (moment(a.createdAt).isAfter(b.createdAt)) {
					return -1
				} else if (moment(a.createdAt).isBefore(b.createdAt)) {
					return 1
				}
				return 0
			})
		}
	},
}

// actions
const actions = {
// Get opportunity profile
	async getOpportunityById({
		commit
	}, id) {
		commit('opportunity_request');
		let res = await axios.get(`http://localhost:5000/opportunities/${id}`)
		try {
			if (res.data.success) {
				commit('opportunity_profile', res.data.user)
				console.log('opportunity profile', res.data.user)
				return res;
			}
			else {
				console.log('Error, opportunity', res)
				return false
			}
		} catch (err) {
			console.log('Error', err)
			return false
		}
	},

	// Get all opportunities
	async getOpportunities({
		commit
	}) {
		try {
			commit('opportunities_request');
			let res = await axios.get('http://localhost:5000/opportunities')
			console.log(res.data.user)
			commit('opportunities_list', res.data.user)
			return res;
		} catch (err) {
			console.log('Error', err)
		}
	},

	//Create opportunity profile
	async createOpportunity({
		commit
	}, userData) {
		try {
			commit('register_opportunity_request');
			console.log('req body', userData)
			let res = await axios.post('http://localhost:5000/opportunities', userData);
			if (res.data.success) {
				commit('register_opportunity_success');
				return res;
			} else {
				console.log('failed', res)
			}
		} catch (err) {
			commit('register_opportunity_error', err)
		}
	},

	//Update opportunity profile
	async updateOpportunity({
		commit
	}, userData) {
		try {
			commit('update_opportunity_request');
			let res = await axios.put(`http://localhost:5000/opportunities/${userData.id}`, userData.user);
			if (res.data.success) {
				console.log(res.data.user);
				commit('update_opportunity_success', res.data.user);
			}
			else {
				console.log('failed', res)
			}
			return res;
		} catch (err) {
			commit('update_opportunity_error', err)
		}
	},

	Causefilter: (context, payload) => {
		context.commit('Causefilter', payload)
	},
	sortOpportunities: (context, payload) => {
		context.commit('sortOpportunities', payload)
	},
	createOrder: (context, payload) => {
		context.commit('createOrder', payload)
	},
	priceFilter: (context, payload) => {
		context.commit('priceFilter', payload)
	},
	// getByOpportunityId: (context, payload) => {
	// 	context.commit('getByOpportunityId', payload)
	// },
	// getOpportunityById: (context, payload) => {
	// 	context.commit('getOpportunityById', payload)
	// },
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
