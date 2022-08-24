import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store';
import VueFeather from 'vue-feather'
import Vue2Filters from 'vue2-filters'
import VueSweetalert2 from 'vue-sweetalert2';
import BootstrapVue from 'bootstrap-vue'
import PxCard from './components/Pxcard.vue'
import Vuelidate from "vuelidate";
import Toasted from 'vue-toasted';
import axios from 'axios';
import { Datetime } from 'vue-datetime'
import VueFormWizard from 'vue-form-wizard';
import SmartTable from 'vuejs-smart-table'
import shareIt from 'vue-share-it';
import VueCookie from 'vue-cookie';

Vue.use(Vue2Filters)

Vue.config.productionTip = false

// Setting up default vue's http modules for api calls
Vue.prototype.$http = axios;
// Load the token from the localStorage
const token = localStorage.getItem("token");
// Is there is any token then we will simply append default axios authorization headers
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

//Import bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'

// Import fonts
import './assets/fonts/material-icon/css/material-design-iconic-font.min.css';
import './assets/fonts/poppins/css/poppins.css';

//Import formWizard
import "vue-form-wizard/dist/vue-form-wizard.min.css";

// Import Theme scss
import './assets/styles/app.scss';


Vue.use(VueCookie);
Vue.component(PxCard.name, PxCard)
Vue.use(BootstrapVue)
Vue.use(VueFeather)
Vue.use(Vuelidate)
Vue.use(VueSweetalert2)
Vue.use(VueFormWizard)
Vue.use(Toasted, {
  iconPack: 'fontawesome'
});
Vue.use(Datetime)
Vue.use(shareIt);
Vue.use(SmartTable)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')