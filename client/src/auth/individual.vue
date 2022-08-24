<template>
  <div class="content">
    <div class="signup-form">
      <h2 class="form-title">Register</h2>
      <form method="POST" class="register-form" id="register-form" @submit.prevent="registerUser">
          <div class="form-group" :class="{ 'form-group--error': $v.name.$error }">
            <label for="name"><i class="zmdi zmdi-accounts-alt material-icons-name"></i></label>
            <input type="text" placeholder="Your Name" v-model.trim="$v.name.$model" />
          </div>
          <template v-if="$v.name.$error">
            <div class="error" v-if="!$v.name.required">Field is required</div>
            <div class="error" v-if="!$v.name.alpha">Name must have only alphabet characters.</div>
            <div class="error" v-if="!$v.name.minLength">Name must have at least
              {{ $v.name.$params.minLength.min }} letters.</div>            
          </template>
          <div class="form-group" :class="{ 'form-group--error': $v.username.$error }">
            <label for="username"><i class="zmdi zmdi-check-circle"></i></label>
            <input type="text" placeholder="Username" v-model.trim="$v.username.$model" />
          </div>
          <template v-if="$v.username.$error">
            <div class="error" v-if="!$v.username.required">Field is required</div>
            <div class="error" v-if="!$v.username.minLength">Userame must have at least
              {{ $v.username.$params.minLength.min }} letters.</div>
          </template>
          <div class="form-group" :class="{ 'form-group--error': $v.email.$error }">
            <label for="email"><i class="zmdi zmdi-email"></i></label>
            <input type="email" placeholder="Your Email" v-model.trim="$v.email.$model" />
          </div>
          <template v-if="$v.email.$error">
            <div class="error" v-if="!$v.email.required">Field is required</div>
            <div class="error" v-if="!$v.email.email">Enter a valid Email.</div>
          </template>
          <div class="form-group" :class="{ 'form-group--error': $v.password.$error }">
            <label for="password"><i class="zmdi zmdi-lock"></i></label>
            <input type="password" placeholder="Password" v-model.trim="$v.password.$model" />
          </div>
          <div class="form-group form-button">
            <input type="submit" name="signup" id="signup" class="form-submit" value="Submit" />
          </div>
      </form>
    </div>

    <div class="signup-image">
      <figure>
        <img src="../assets/images/login.png" alt="sing up image" />
      </figure>
      <router-link to="/auth/login" class="signup-image-link">Already registered</router-link>
    </div>
  </div>
</template>

<style scoped src="../assets/styles/reset.css"></style>

<script>
import { required, minLength, alpha, email } from "vuelidate/lib/validators";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      name: "",
      email: "",
      username: "",
      password: ""
    };
  },
  validations: {
    name: {
      required,
      minLength: minLength(4),
      alpha
    },
    email: {
      required,
      email,
    },
    username: {
      required,
      minLength: minLength(4),
    },
    password: {
      required,
    },
  },

  methods: {
    ...mapActions(["register"]),
    registerUser() {
      if (this.isEmpty()) {
        this.$swal({
          title: "Error",
          text: "Fill up the form first",
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
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password,
        };
        this.register(user).then((res) => {
          if (res.data.success) {
            this.$swal({
              title: "Successfully registered!",
              text: "Login to create your profile!",
              icon: "success",
            });
            this.$router.push("/auth/login");
          }
        });
      }
    },
    isEmpty: function () {
      return (
        this.name == "" ||
        this.username == "" ||
        this.email == "" ||
        this.password == ""
      );
    },
  },
};
</script>