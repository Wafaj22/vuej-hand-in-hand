import Vue from "vue";
import Vuex from "vuex";
import menu from './modules/menu'
import chat from './modules/chat'
import campaigns from './modules/campaigns'
import auth from './modules/auth'
import opportunities from './modules/opportunities'
import donation from './modules/donation'
import charities from './modules/charities'
import volunteers from './modules/volunteers'
import application from './modules/application'
import notification from './modules/notification'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
      menu,
      chat,
      campaigns,
      auth,
      opportunities,
      donation,
      charities,
      volunteers,
      application,
      notification
    }
});