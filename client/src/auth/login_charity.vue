<template>
  <div class="content">
    <div class="signup-image">
      <figure>
        <img src="../assets/images/login.png" alt="login image" />
      </figure>
      <router-link to="/auth/register" class="signup-image-link">Create an account</router-link>
    </div>

    <div class="signup-form">
      <h2 class="form-title">Sign in</h2>
      <form method="POST" class="register-form" id="login-form" @submit.prevent="loginUser">
        <div class="form-group" :class="{ 'form-group--error': $v.username.$error }">
          <label for="username"><i class="zmdi zmdi-account"></i></label>
          <input type="text" v-model.trim="$v.username.$model" placeholder="Registration Number" />
        </div>
        <div v-if="$v.username.$error">
          <div class="error" v-if="!$v.username.required">
            Field is required
          </div>
          <div class="error" v-if="!$v.username.minLength">
            Registration number must have at least
            {{ $v.username.$params.minLength.min }} letters.
          </div>
        </div>
        <div class="form-group" :class="{ 'form-group--error': $v.password.$error }">
          <label for="password"><i class="zmdi zmdi-lock"></i></label>
          <input type="password" v-model.trim="$v.password.$model" placeholder="Password" />
        </div>
        <div v-if="$v.password.$error">
          <div class="error" v-if="!$v.password.required">
            Field is required
          </div>
        </div>
        <div class="form-group form-button">
          <input type="submit" name="signin" id="signin" class="form-submit" value="Log in" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  validations: {
    username: {
      required,
      minLength: minLength(8),
    },
    password: {
      required,
    },
  },
  computed: {
    ...mapGetters(["error"]),
  },
  methods: {
    ...mapActions(["charities/getCharityById", "loginCharity"]),
    loginUser() {
      if (this.username == "" || this.password == "") {
        this.$swal({
          title: "Error",
          text: "Fill up the fields first",
          icon: "warning",
        });
      } else if (this.$v.$anyError) {
        this.$swal({
          title: "Error",
          text: "Correct all highlighted errors and try again",
          icon: "warning",
        });
      } else {
        let user = {
          username: this.username,
          password: this.password,
        };
        this.loginCharity(user)
          .then((res) => {
            if (res.data.success) {            
              this["charities/getCharityById"](res.data.user._id).then((res)=>{
                if(res.data.success){
                  if(res.data.user!=null){
                    this.$cookie.set('charity-image', res.data.user.image, 1)
                    delete res.data.user.image
                    delete res.data.user.campaigns
                    delete res.data.user.supporter
                    delete res.data.user.opportunities
                    delete res.data.user.connection
                    this.$cookie.set('charity', JSON.stringify(res.data.user), 1);

                    this.$router.push("/home"); 
                    location.reload() 
                  }else {
                    this.$router.push("/profile");
                    location.reload() 
                  }         
                    
                }
              })
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped src="../assets/styles/reset.css"></style>