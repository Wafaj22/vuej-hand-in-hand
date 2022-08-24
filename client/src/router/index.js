import Vue from 'vue'
import Router from "vue-router";
import store from '../store/index';

/* Auth */
import Login from "@/auth/login.vue";
import Register from "@/auth/register.vue";
import Auth from "@/auth/auth.vue";

import Body from "@/components/body.vue";
import Profile from "@/views/profile.vue";
import Chat from "@/views/chat.vue";

import Home from "@/views/home.vue";
import Campaigns from "@/views/campaigns.vue";

import Volunteer from "@/views/volunteer.vue";
import Volunteers from "@/views/volunteers.vue";

import Opportunities from "@/views/opportunities.vue";
import Details from "@/views/opportunities_details.vue";

import Campaign from "@/views/campaigns_details.vue";

import Charity from "@/views/charity.vue";
import Charities from "@/views/charities.vue";

Vue.use(Router)

const routes = [
  { path: '', redirect: { name: 'home' } },
  {
    path: "/auth", name: "auth", component: Auth, children: [
      { path: "login", name: "login", component: Login },
      { path: "register", name: "register", component: Register },
    ]
  },
  {
    path: "/home", component: Body,
    children: [
      { path: "", name: "home", component: Home }
    ]
  },
  {
    path: "/campaigns", component: Body,
    children: [
      { path: "", name: "campaigns", component: Campaigns },
      { path: ":id", name: "campaigns-details", component: Campaign },
    ]
  },
  {
    path: "/volunteers", component: Body,
    children: [
      { path: "", name: "volunteers", component: Volunteers },
      { path: ":id", name: "volunteers-details", component: Volunteer },

    ]
  },
  {
    path: "/charities", component: Body,
    children: [
      { path: "", name: 'charities', component: Charities },
      { path: ":id", name: "charities-details", component: Charity },
    ]
  },
  {
    path: "/opportunities", component: Body,
    children: [
      { path: "", name: 'opportunities', component: Opportunities },
      { path: ":id", name: 'opportunities-details', component: Details }
    ]
  },
  {
    path: "/chat", component: Body,
    children: [
      { path: "", name: 'chat', component: Chat},
      { path: ":id", name: 'chat-details', component: Chat }
    ]
  },
  {
    path: "/", component: Body,
    children: [
      { path: "profile", name: 'profile', component: Profile },
    ]
  },
];

const router = new Router({
  routes,
  base: '/',
  mode: 'history',
  linkActiveClass: "active",
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      // Redirect to the Login Page
      next('/auth/login');
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (store.getters.isLoggedIn) {
      // Redirect to the home Page
      next('/home');
    } else {
      next();
    }
  } else {
    next()
  }
});

export default router;
