<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="page-title">
        <div class="row">
          <div class="col-6 d-flex">
            <h3>Edit Profile</h3>
          </div>
        </div>
      </div>
      <div class="edit-profile" v-if="!isFetching">
        <b-alert variant="danger" show dismissible class="alert alert-danger alert-dismissible fade show" v-if="error" @dismissed="error=null">
          <i class="fa fa-exclamation-triangle mr-2"></i>
          {{error}}
        </b-alert>                
      <form @submit.prevent enctype="multipart/form-data">
        <div class="row">
          <div class="col-xl-4">
            <div class="card">
              <div class="card-body">
                  <div class="row mb-50">
                    <div class="user-image">
                      <img v-if="image==''" class="img-110 rounded-circle" src="../assets/images/user/7.jpg">
                      <img v-else-if="!isNew && (isDisabled || !url)" class="img-110 rounded-circle" :src="getImgUrl(image)">
                      <img v-else-if='url' class="img-110 rounded-circle" :src="url">
                      <label id="add-image" v-if="isNew || !isDisabled" for="file-input" class="icon-wrapper">
                        <i class="fa fa-pencil"></i>                        
                      </label>
                      <b-tooltip v-if="isNew || !isDisabled" target="add-image" triggers="hover" placement="right">Upload a profile image</b-tooltip>
                      <input style="display: none;" id="file-input" type="file" ref="file" accept=".png, .jpg, .jpeg" @change="onFileChange" />
                    </div>
                    <div class="col">
                      <h3 class="mt-20">{{user.name}}</h3>
                      <p>{{user.username}}</p>
                    </div>
                  </div>
                  <div class="form-group" :class="{ 'invalid': isInvalidC }">
                    <h6 class="form-label">Causes<span class="required"> *</span></h6>
                    <ul v-if="!isNew && isDisabled" class="items">
                      <li class="badge badge-secondary pull-right" v-for="(c, i) in causesList" :key="i" v-text="c"></li>
                    </ul>
                    <multiselect v-else v-model="causes" tag-placeholder="Add this as new tag" placeholder="Search or add a cause" label="name" track-by="code" :options="options2" :multiple="true" :taggable="true" @tag="addTag2" @close="onChangeCauses()"></multiselect>
                  </div>
                  <template v-if="isInvalidC">
                    <div class="error">
                      Select at least one cause
                    </div>
                  </template>
                  <div class="form-group" :class="{'form-group--error': $v.mission.$error}">
                    <h6 class="form-label">Mission<span class="required"> *</span></h6>
                    <textarea v-if="mission && !isNew" :disabled="isDisabled" v-model.trim="$v.mission.$model" class="form-control" rows="2"></textarea>
                    <textarea v-else class="form-control" rows="2" v-model.trim="$v.mission.$model" placeholder="What is your charity mission ?"></textarea>
                  </div>
                  <template v-if="$v.mission.$error">
                    <div class="error" v-if="!$v.mission.required">
                      Field is required
                    </div>
                    <div class="error" v-if="!$v.mission.minLength">
                      About must have at least{{$v.mission.$params.minLength.min}}letters.
                    </div>
                  </template>
                  <div class="form-group" :class="{'form-group--error': $v.description.$error}">
                    <h6 class="form-label">Description<span class="required"> *</span></h6>
                    <textarea v-if="description && !isNew" v-model.trim="$v.description.$model" :disabled="isDisabled" class="form-control" rows="4"></textarea>
                    <textarea v-else class="form-control" v-model.trim="$v.description.$model" rows="4" placeholder="A short description mission your charity"></textarea>
                    <template v-if="$v.description.$error">
                      <div class="error" v-if="!$v.description.required">
                        Field is required
                      </div>
                      <div class="error" v-if="!$v.description.minLength">
                        Description must have at least{{$v.description.$params.minLength.min}}letters.
                      </div>
                    </template>
                  </div>
              </div>
            </div>
          </div>
          <div class="col-xl-8">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title mb-0"><i class="fa fa-file mr-2"></i>Contact Details</h4>
                <div class="card-options"><a class="card-options-collapse" href="#" data-toggle="card-collapse"><i class="fe fe-chevron-up"></i></a><a class="card-options-remove" href="#" data-toggle="card-remove"><i class="fe fe-x"></i></a></div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <i class="fa fa-mobile mr-2"></i><label class="form-label">Mobile phone</label>
                      <input v-if="mobile && !isNew" v-model="mobile" :disabled="isDisabled" class="form-control" type="text">
                      <input v-else class="form-control" v-model="mobile" type="text" placeholder="91-(999)-999-999">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <i class="fa fa-facebook mr-2"></i><label class="form-label">Facebook</label>
                      <input v-if="facebook && !isNew" v-model="facebook" :disabled="isDisabled" class="form-control" type="text">
                      <input v-else class="form-control" v-model="facebook" type="text" placeholder="username">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <i class="fa fa-briefcase mr-2"></i><label class="form-label">Website</label>
                      <input v-if="website && !isNew" v-model="website" :disabled="isDisabled" class="form-control" type="text" />
                      <input v-else class="form-control" v-model="website" type="text" placeholder="Portfolio" />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <i class="fa fa-instagram mr-2"></i><label class="form-label">Instagram</label>
                      <input v-if="instagram && !isNew" v-model="instagram" :disabled="isDisabled" class="form-control" type="text">
                      <input v-else class="form-control" v-model="instagram" type="text" placeholder="@username">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="form-label">City</label><span class="required"> *</span>
                      <select v-if="isNew" class="form-control btn-square" v-model="city">
                        <option value="Selangor">Selangor</option>
                        <option value="Kuala Lumpur">Kuala Lumpur</option>
                      </select>
                      <select v-else :disabled="isDisabled" class="form-control btn-square" v-model="city">
                        <option value="Selangor">Selangor</option>
                        <option value="Kuala Lumpur">Kuala Lumpur</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="form-label">Postcode</label><span class="required"> *</span>
                      <input v-if="postcode && !isNew" v-model="postcode" :disabled="isDisabled" class="form-control" type="text">
                      <select v-else-if="city=='Selangor'" class="form-control btn-square" v-model="postcode">
                        <option v-for="(item,index) in postcodes.Selangor" v-bind:key="index" :value="item">{{item}} </option>
                      </select>
                      <select v-else-if="city=='Kuala Lumpur'" class="form-control btn-square" v-model="postcode">
                        <option v-for="(item,index) in postcodes.Kuala" v-bind:key="index" :value="item">{{item}} </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="form-label">Country</label>
                      <input class="form-control" type="text" value="Malaysia" disabled>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer text-right">
                <button v-show="!clicked && !isNew" class="btn btn-primary m-r-10" @click="update">Update Profile</button>
                <button v-show="clicked || isNew" class="btn btn-primary m-r-10" @click="submit">Submit changes</button>
                <button v-show="!isNew && clicked" class="btn btn-danger" @click="cancel">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        </form>
      </div>
    </div>
    <!-- Container-fluid Ends-->
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import { mapActions, mapState, mapGetters  } from "vuex";
import postcodes from '../data/postcode'

export default {
  validations: {
    mission: {
      required,
      minLength: minLength(4),
    },
    description: {
      required,
      minLength: minLength(10),
    },
    city: {
      required,
    },
    postcode: {
      required,
    },
  },
  data() {
    return {
      error: null,
      loggedInUser: {},
      clicked: false,
      isNew: false,
      isDisabled: true,
      isFetching: true,
      url: false,
      isInvalidC: false,

      options2: [
        { code: 1, name: "Animals" },
        { code: 2, name: "Children & Youth" },
        { code: 3, name: "Disabilities" },
        { code: 4, name: "Education" },
        { code: 5, name: "Environment" },
        { code: 6, name: "Elderly" },
        { code: 7, name: "Health" },
        { code: 8, name: "Homeless" },
        { code: 9, name: "Hunger & Poverty" },
        { code: 10, name: "Women's Issues" },
      ],
      instagram: "",
      image: "",
      mission: "",
      description: "",
      causes: [],
      city: "Selangor",
      postcode: "",
      charities: [],
      mobile: "",
      facebook: "",
      website: "",
      tags: [],
      applications: [],
      donations: [],
      opportunities: [],
      causesList: [],
      postcodes: postcodes
    };
  },
  components: {
    Multiselect,
  },
  methods: {
    ...mapActions(["charities/updateCharity","charities/createCharity","getProfile",]),
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    serializeUser(){
      let c = this.causes.map((cause) => cause.name);
      c.push(this.city);
      c.push(this.user.name)

      return {
        user:this.id,
        mission:this.mission,
        description:this.description,
        cause:this.causes.map((cause) => cause.name),
        tags:c,
        city:this.city,
        postcode:this.postcode,
        mobile:this.mobile,
        facebook:this.facebook,
        instagram:this.instagram,
        website:this.website,
      }
    },
    getFormData(){
      let c = this.causes.map((cause) => cause.name);
      c.push(this.city);
      c.push(this.user.name)

      const formData = new FormData();
      formData.append('user', this.id)
      formData.append('image',this.image);
      formData.append('mission',this.mission);
      formData.append('description',this.description);
      let causes = this.causes.map((cause) => cause.name);
      for (let i = 0; i < causes.length; i++) {
        formData.append('cause[]', causes[i]);
      }
      for (let i = 0; i < c.length; i++) {
        formData.append('tags[]', c[i]);
      }
      formData.append('city',this.city);
      formData.append('postcode',this.postcode);
      formData.append('mobile',this.mobile);
      formData.append('facebook',this.facebook);
      formData.append('instagram',this.instagram);
      formData.append('website',this.website);
      return formData;
    },
    registerUser() {
      let req = this.getFormData();
      this["charities/createCharity"](req).then((res) => {
        if (res.data.success) {
          this.$swal({
            title: "Your profile is successfully created",
            text: "Hand in Hand together for a better world!",
            icon: "success",
          });

          console.log(res.data)

          this.$cookie.set('charity-image',res.data.user.image,1)
          this.$cookie.set('charity',JSON.stringify(this.serializeUser()),1)

          setTimeout(function(){ location.reload(); }, 5000);          
          //this.isNew = false;  
        }
      });
    },
    updateUser() {
      let req = {
        user: this.getFormData(),
        id: this.id,
      };
      this["charities/updateCharity"](req).then((res) => {
        if (res.data.success) {
          this.$swal({
              title: "Your profile is successfully updated",
              text: "Hand in Hand together for a better world!",
              icon: "success",
            });
          this.isNew = false;
          this.$cookie.set('charity-image',res.data.user.image,1)
          this.$cookie.set('charity',JSON.stringify(this.serializeUser()),1)

          setTimeout(function(){ location.reload(); }, 5000);          
        }
      });
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);

      this.image = this.$refs.file.files[0]
    },
    addTag2(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options2.push(tag);
      this.causes.push(tag);
    },
    onChangeCauses() {
      if (this.causes.length < 1) {
        this.isInvalidC = true;
      } else {
        this.isInvalidC = false;
      }
    },
    update() {
      this.isDisabled = false;
      this.clicked = true;
    },
    cancel() {
      this.url =""
      this.image = this.$cookie.get('charity-image');
      this.isDisabled = true;
      this.clicked = false;
    },
    submit() {
      if (this.$v.$anyError || this.isInvalid || this.InvalidC) {
        this.error = "Correct all highlighted errors and try again";
      } else if (this.isEmpty()) {
        this.error = "Fill up the required fields first";
      } else {
        if (this.isNew) {
          console.log("create new profile");
          this.registerUser();
        } else {
          console.log("update profile");
          this.updateUser();
        }
      }
    },
    isEmpty: function () {
      return (
        this.mission == "" ||
        this.description == "" ||
        this.city == "" ||
        this.postcode == "" ||
        this.causes.length == 0 ||
        this.image == ""
      );
    },
  },
  computed: {
    ...mapGetters(["user"]),
    ...mapState({id: (state) => state.auth.id}),
  },
  async created() {
    await this.getProfile();
    if(this.$cookie.get('charity')!=null){
      this.loggedInUser = JSON.parse(this.$cookie.get('charity'));
      console.log(this.loggedInUser)
      this.image = this.$cookie.get('charity-image');
      this.mission = this.loggedInUser.mission;
      this.description = this.loggedInUser.description;
      this.causesList = this.loggedInUser.cause;
      this.tags = this.loggedInUser.tags;
      this.city = this.loggedInUser.city;
      this.postcode = this.loggedInUser.postcode;
      this.mobile = this.loggedInUser.mobile;
      this.facebook = this.loggedInUser.facebook;
      this.instagram = this.loggedInUser.instagram;
      this.website = this.loggedInUser.website;  
      this.isNew = false;
      this.isFetching = false;    
    } else {
      this.isNew = true;
      this.isFetching = false;       
    }
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
.multiselect__tag {
  background: #51bb25;
}
.multiselect__tag-icon::after {
  color: #fff;
}
.mt-20 {
  margin-top: 20px;
}
.mb-50 {
  margin-bottom: 50px;
}
.img-110 {
  width: 110px;
  height: 110px;
}
.user-image {
  position: relative;
  height: 0;
}
.icon-wrapper {
  position: absolute;
  margin-top: -27px;
  left: 62%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  cursor: pointer;
  overflow: hidden;
  font-size: 17px;
  box-shadow: 0 0 6px 3px rgba(68, 102, 242, 0.1);
}
.error{
  margin-top: 5px;
}
</style>
