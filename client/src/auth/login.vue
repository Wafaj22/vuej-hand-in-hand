<template>
  <div class="main">
    <div class="container">
      <b-alert variant="danger" show dismissible class="alert alert-danger alert-dismissible fade show" v-if="error">
				<i class="fa fa-exclamation-triangle mr-2"></i>
				{{error}}
			</b-alert>      
      <div :is="currentComponent"></div>
      <div v-show="!currentComponent" >
      <h2 class="form-title" style="padding:35px; text-align: center; margin-bottom: 0;">Login as</h2>
        <div class="content" style="padding-top: 0;">
        <div  @click="swapComponent('Charity')" class="signup-image">
          <b-card header-tag="div">
            <h3 slot="header">Charity</h3>
            <b-card-text class="mb-0">
              <figure>
                <img src="../assets/images/login.png" alt="sing up image" />
              </figure>
            </b-card-text>
          </b-card>
        </div>
        <div  @click="swapComponent('Individual')" class="signup-image">
          <b-card header-tag="div">
            <h3 slot="header">Individual</h3>
            <b-card-text class="mb-0">
              <figure>
                <img src="../assets/images/donate.png" alt="sing up image" />
              </figure>
            </b-card-text>
          </b-card>
        </div>
      </div>

        <router-link to="/auth/register" class="signup-image-link">Create an account</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped src="../assets/styles/reset.css">
  .content, .signup-image-link {
    padding-bottom:50px;
  }

</style>

<script>
import { mapGetters } from "vuex";
import Charity from "./login_charity.vue";
import Individual from "./login_user.vue";

export default {
  data() {
    return {
      currentComponent: null,
    };
  },
  components: {
    Charity,
    Individual,
  },
  computed:{
    ...mapGetters(["error"]),
  },
  methods: {
    swapComponent: function (component) {
      this.currentComponent = component;
    },
  },
};
</script>