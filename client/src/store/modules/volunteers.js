import axios from 'axios';

const state = {
	tagItems: [],
	filteredProduct: [],
	searchTerm: '',

	volunteers: [],
	status: '',
	error: null,
	profile: false,
	volunteerProfile: {},
	volunteer: null
}


const getters = {
	volunteer: state => state.volunteer,
	volunteerProfile: (state) => { return state.volunteerProfile },
	volunteers: (state) => { return state.volunteers },

	getCities: (state) => {
		const volunteers = [...new Set(state.volunteers.map(volunteer => volunteer.city))]
		return volunteers
	},

	getCauses: (state) => {
		var uniqueCause = []
		var causes = Array();
		state.volunteers.map((charity) => {
			if (charity.causes) {
				charity.causes.map((cause) => {
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
		state.volunteers.map((opportunity) => {
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

	filterVolunteers: (state) => {
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
	volunteers_request(state) {
		state.status = 'loading'
	},
	volunteers_list(state, users) {
		state.filteredProduct = users
		state.volunteers = users
	},
	volunteer_request(state) {
		state.status = 'loading'
	},
	volunteer_profile(state, user) {
		state.volunteerProfile = user
	},
	register_volunteer_request(state) {
		state.error = null
		state.status = 'loading'
	},
	register_volunteer_success(state) {
		state.error = null
		state.status = 'success'
	},
	register_volunteer_error(state, err) {
		state.error = err.response.data.message
	},
	update_volunteer_request(state) {
		state.error = null
		state.status = 'loading'
	},
	update_volunteer_success(state, user) {
		state.error = null
		state.status = 'success'
		state.volunteer = user
	},
	update_volunteer_error(state, err) {
		state.error = err.response.data.message
	},
	priceFilter: (state) => {
		state.filteredProduct = []
		state.volunteers.find((volunteer) => {
			state.filteredProduct.push(volunteer)
			// if (volunteer.startDate >= payload[0] && volunteer.startDate <= payload[1]) { 
			// }
		})
	},
	setTags: (state, payload) => {
		state.tagItems = payload
	},
	sortVolunteers: (state, payload) => {
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
	}
}

// actions
const actions = {
	// Get volunteer profile
	async getVolunteerById({
		commit
	}, id) {
		commit('volunteer_request');
		let res = await axios.get(`http://localhost:5000/volunteers/${id}`)
		try {
			if (res.data.success) {
				commit('volunteer_profile', res.data.user)
				console.log('volunteer profile',res.data.user)
				return res;
			}
			else {
				console.log('Error, volunteer', res)
				return false
			}
		} catch (err) {
			console.log('Error', err)
			return false
		}
	},

	// Get all volunteers
	async getVolunteers({
		commit
	}) {
		try {
			commit('volunteers_request');
			let res = await axios.get('http://localhost:5000/volunteers')
			commit('volunteers_list', res.data.user)
			return res;
		} catch (err) {
			console.log('Error', err)
		}
	},

	//Create volunteer profile
	async createVolunteer({
		commit
	}, userData) {
		try {
			commit('register_volunteer_request');
			console.log('req body', userData)
			let res = await axios.post('http://localhost:5000/volunteers', userData);
			if (res.data.success) {
				commit('register_volunteer_success');
				return res;
			} else {
				console.log('failed', res)
			}
		} catch (err) {
			commit('register_volunteer_error', err)
		}
	},

	//Update volunteer profile
	async updateVolunteer({
		commit
	}, userData) {
		try {
			commit('update_volunteer_request');
			console.log('sent', userData)
			let res = await axios.put(`http://localhost:5000/volunteers/${userData.id}`, userData.user);
			console.log(userData.user)
			if (res.data.success) {
				console.log('sucess')
				console.log(res.data.user);
				commit('update_volunteer_success', res.data.user);
			}
			else {
				console.log('failed', res)
			}
			return res;
		} catch (err) {
			commit('update_volunteer_error', err)
		}
	},


	sortVolunteers: (context, payload) => {
		context.commit('sortVolunteers', payload)
	},
	priceFilter: (context, payload) => {
		context.commit('priceFilter', payload)
	},
	setTags: (context, payload) => {
		context.commit('setTags', payload)
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}