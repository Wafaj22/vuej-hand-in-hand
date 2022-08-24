import axios from 'axios';

const state = {
	filteredProduct: [],
	tagItems: [],

	campaigns: [],
	status: '',
	error: null,
	profile: false,
	campaignProfile: {},
	campaign: null
}

//getters
const getters = {
	getUrgentCampaigns: (state) => {
		return state.campaigns.filter((c)=> c.urgent);
	},

	filterCampaigns: (state) => {
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
	campaigns_request(state) {
		state.status = 'loading'
	},
	campaigns_list(state, users) {
		state.filteredProduct = users
		state.campaigns = users
	},
	campaign_request(state) {
		state.status = 'loading'
	},
	campaign_profile(state, user) {
		state.campaignProfile = user
	},
	register_campaign_request(state) {
		state.error = null
		state.status = 'loading'
	},
	register_campaign_success(state) {
		state.error = null
		state.status = 'success'
	},
	register_campaign_error(state, err) {
		state.error = err.response.data.message
	},
	update_campaign_request(state) {
		state.error = null
		state.status = 'loading'
	},
	update_campaign_success(state, user) {
		state.error = null
		state.status = 'success'
		state.campaign = user
	},
	update_campaign_error(state, err) {
		state.error = err.response.data.message
	},
};

// actions
const actions = {
	// Get campaign profile
	async getCampaignById({
		commit
	}, id) {
		commit('campaign_request');
		let res = await axios.get(`http://localhost:5000/campaigns/${id}`)
		try {
			if (res.data.success) {
				commit('campaign_profile', res.data.user)
				console.log('campaign profile', res.data.user)
				return res;
			}
			else {
				console.log('Error, campaign', res)
				return false
			}
		} catch (err) {
			console.log('Error', err)
			return false
		}
	},

	// Get all campaigns
	async getCampaigns({
		commit
	}) {
		try {
			commit('campaigns_request');
			let res = await axios.get('http://localhost:5000/campaigns')
			console.log(res.data.user)
			commit('campaigns_list', res.data.user)
			return res;
		} catch (err) {
			console.log('Error', err)
		}
	},

	//Create campaign profile
	async createCampaign({
		commit
	}, userData) {
		try {
			commit('register_campaign_request');
			console.log('req body', userData)
			let res = await axios.post('http://localhost:5000/campaigns', userData);
			if (res.data.success) {
				commit('register_campaign_success');
				return res;
			} else {
				console.log('failed', res)
			}
		} catch (err) {
			commit('register_campaign_error', err)
		}
	},

	//Update campaign profile
	async updateCampaign({
		commit
	}, userData) {
		try {
			commit('update_campaign_request');
			console.log('sent', userData)
			let res = await axios.put(`http://localhost:5000/campaigns/${userData.id}`, userData.user);
			console.log(userData.user)
			if (res.data.success) {
				console.log('sucess')
				console.log(res.data.user);
				commit('update_campaign_success', res.data.user);
			}
			else {
				console.log('failed', res)
			}
			return res;
		} catch (err) {
			commit('update_campaign_error', err)
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