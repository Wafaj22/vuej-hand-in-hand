import axios from 'axios';

const state = {
    chats: [],
    activeuser: "",
    serchCol: [],
    serchSup: [],
    supporters: [],
    collaborators: [],
    status: "",
    loggedInUser: "",
    users: [], 
    newChat: {}
}

// getters
const getters = {
    currentChat: (state) => {
        let current = {}

        console.log(state.chats)
        var chats = state.chats.find( chat => {
            if(chat.users.indexOf(state.activeuser) !== -1){                
                return chat;
            } 
        });
        //console.log(chats)
        if(!chats){
            current = {'users': state.users, 'messages': []}
        } else {
            current = {'users': chats.users, 'messages': chats.messages}
        }

        let all = state.supporters.concat(state.collaborators)

        var users = all.find( u => {
            if(u.user._id == state.activeuser)
                return u;
        });

        if(!users){
            users = state.newChat;
        }

        console.log({...users,'chat':current})

        return {...users,'chat':current};
    },
}

// mutations
const mutations = {
    chat_request(state) {
		state.status = 'loading'
	},
	chat_profile(state, user) {
		state.chats = user
        console.log('the profile', state.chats)
	},
    addChat: (state, payload) => {
        const id = state.activeuser;
        const addchat = state.chats.find(chat => chat.users.indexOf(id) !== -1);
        addchat.messages.push({"sender": payload.sender, "time": payload.time, "text": payload.message})
    },
    setActiveuser: (state, payload) => {
        state.activeuser = payload.receiver
        state.loggedInUser = payload.sender

        let users = [];
        users.push(state.activeuser);
        users.push(state.loggedInUser);

        state.users = users
    },

    setSerchSupporters: (state, payload) => {
        state.serchSup = state.supporters.filter(function (search) {
            if (search.name.toLowerCase().search(payload.toLowerCase()) != -1)
                return search
            
        })
    },

    setSerchCollaborators: (state, payload) => {
        state.serchCol = state.collaborators.filter(function (search) {
            if (search.name.toLowerCase().search(payload.toLowerCase()) != -1)
                return search
        })
    }, 
    setActiveUser: (state, payload) => {
        state.activeuser = payload
    }, 
    setChats: (state, payload) => {
        state.chats = payload
    }, 
    addNew: (state, payload) => {
        state.newChat = payload
    }, 

    setSupporters: (state, payload) => {
        state.supporters = [];
        payload.forEach(c=> {
            if(state.supporters.indexOf(c) === -1){
                state.supporters.push(c)
            }    
        })         
        state.serchSup = payload
    }, 
    setCollaborators: (state, payload) => {
        state.collaborators = [];
        payload.forEach(c=> {
            if(state.collaborators.indexOf(c) === -1){
                state.collaborators.push(c)
            }                
        })
        state.serchCol = payload
    }, 
};

// actions
const actions = {
    addChat: (context, payload) => {
        context.commit('addChat', payload);
    },
    setActiveuser: (context, payload) => {
       context.commit('setActiveuser',payload)
    },

    setSerchSupporters:(context, payload) => {
        context.commit('setSerchSupporters',payload)
    },
    setSerchCollaborators:(context, payload) => {
        context.commit('setSerchCollaborators',payload)
    }, 
    
    // Get chat profile
	async getChat({
		commit
	}, id) {
		commit('chat_request');
		let res = await axios.get(`http://localhost:5000/chat/${id}`)
		try {
			if (res.data.success) {
				commit('chat_profile', res.data.user)
				console.log('chat profile',res.data.user)
				return res;
			}
			else {
				console.log('Error, chat', res)
				return false
			}
		} catch (err) {
			console.log('Error', err)
			return false
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