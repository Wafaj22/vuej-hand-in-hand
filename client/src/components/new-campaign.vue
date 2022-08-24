<template>
  <!-- Vertically centered Modal Component -->
  <b-modal @hidden="toggleModal()" ref='my-modal-create' id="modal-3" size="lg" hide-footer centered title="Create New Campaign" class="theme-modal">
    <b-alert variant="danger" show dismissible class="alert alert-danger alert-dismissible fade show" v-if="error">
      <i class="fa fa-exclamation-triangle mr-2"></i>
      {{error}}
    </b-alert>
    <form @submit.prevent enctype="multipart/form-data">
      <form-wizard ref="wizard" color="#4466f2" :start-index="0" title="" subtitle="" back-button-text="Back" next-button-text="Next!" finish-button-text="Submit" @on-error="handleErrorMessage" @on-complete="addCampaign">
        <tab-content title="Basic details" :before-change="validateAsync">
          <div class="setup-content" id="step-1">
            <div class="col-xs-12">
              <div class="col-md-12">
                <div class="form-group">
                  <label class="control-label">In collaboration with: </label>
                  <multiselect v-model="collaborating" placeholder="Search and add a charity" label="name" track-by="id" :options="charitiesOptions" :multiple="true" :taggable="false"></multiselect>
                </div>
                <div class="form-group" :class="{ 'form-group--error': $v.title.$error }">
                  <label class="control-label">What is your Campaign Title ?</label><span class="required"> *</span>
                  <input class="form-control" type="text" placeholder="Ex: Help us pay for bills" v-model.trim="$v.title.$model" />
                </div>
                <template v-if="$v.title.$error">
                  <div class="error" v-if="!$v.title.required">
                    Field is required
                  </div>
                  <div class="error" v-if="!$v.title.minLength">
                    Title must have at least
                    {{ $v.title.$params.minLength.min }} letters.
                  </div>
                </template>
                <div class="form-group" :class="{ 'invalid': isInvalid }">
                  <label class="control-label">Choose relevant campaign causes</label><span class="required"> *</span>
                  <multiselect v-model="cause" tag-placeholder="Add this as new tag" placeholder="Search or add a category" label="name" track-by="id" :options="options" :multiple="true" :taggable="true" @tag="addTag" @close="onChange"></multiselect>
                </div>
                <template v-if="isInvalid">
                  <div class="error">
                    Select one or more causes
                  </div>
                </template>
                <div class="form-group">
                  <label class="control-label" :class="{ 'form-group--error': $v.city.$error }">City</label><span class="required"> *</span>
                  <select class="form-control btn-square" v-model.trim="$v.city.$model">
                    <option value="Selangor">Selangor</option>
                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                  </select>
                </div>
                <template v-if="$v.city.$error">
                  <div class="error" v-if="!$v.city.required">
                    Field is required
                  </div>
                </template>
                <div class="form-group">
                  <label class="control-label">Postcode</label><span class="required"> *</span>
                  <select v-if="city=='Selangor'" class="form-control btn-square" v-model.trim="$v.postcode.$model">
                    <option v-for="(item,index) in postcodes.Selangor" v-bind:key="index" :value="item">{{item}} </option>
                  </select>
                  <select v-else-if="city=='Kuala Lumpur'" class="form-control btn-square" v-model.trim="$v.postcode.$model">
                    <option v-for="(item,index) in postcodes.Kuala" v-bind:key="index" :value="item">{{item}} </option>
                  </select>
                </div>
                <template v-if="$v.postcode.$error">
                  <div class="error" v-if="!$v.postcode.required">
                    Field is required
                  </div>
                </template>
              </div>
            </div>
          </div>
        </tab-content>
        <tab-content title="Campaign Story" :before-change="validateAsync">
          <div class="setup-content" id="step-2">
            <div class="col-xs-12">
              <div class="col-md-12">
                <div class="form-group">
                  <label class="control-label">Add a cover image</label><span class="required"> *</span>
                  <input class="form-control" type="file" ref="file" accept=".png, .jpg, .jpeg" @change="onFileChange" />
                </div>
                <div class="form-group">
                  <label class="control-label" :class="{'form-group--error': $v.description.$error}">Tell your story</label><span class="required"> *</span>
                  <textarea class="form-control" rows="5" placeholder="A short description about your campaign" v-model.trim="$v.description.$model"></textarea>
                </div>
                <template v-if="$v.description.$error">
                  <div class="error" v-if="!$v.description.required">
                    Field is required
                  </div>
                  <div class="error" v-if="!$v.description.minLength">
                    Description must have at least {{$v.description.$params.minLength.min}}letters.
                  </div>
                </template>
              </div>
            </div>
          </div>
        </tab-content>
        <tab-content title="Last step" :before-change="validateAsync">
          <div class="setup-content" id="step-3">
            <div class="col-xs-12">
              <div class="col-md-12">
                <div class="form-group m-checkbox-inline mb-0">
                  <label class="control-label">Mark as urgent: </label>
                  <div class="radio radio-primary d-inline-block">
                    <b-form-radio v-model="urgent" :value="true">Yes</b-form-radio>
                  </div>
                  <div class="radio radio-primary d-inline-block">
                    <b-form-radio v-model="urgent" :value="false">No</b-form-radio>
                  </div>
                </div>
                <div class="form-group" :class="{ 'form-group--error': $v.goal.$error }">
                  <label class="control-label">Set your fundraising goal</label><span class="required"> *</span>
                  <input class="form-control" type="text" placeholder="Enter goal amount" v-model.trim="$v.goal.$model" />
                </div>
                <template v-if="$v.goal.$error">
                  <div class="error m-b-5" v-if="!$v.goal.required">
                    Field is required
                  </div>
                  <div class="error m-b-5" v-if="!$v.goal.numeric">
                    Enter a valid number.
                  </div>
                  <div class="error" v-if="!$v.goal.minValue">
                    Goal amount must be at least{{$v.goal.$params.minValue.min}} $.
                  </div>
                </template>
              </div>
            </div>
          </div>
        </tab-content>
      </form-wizard>
    </form>
  </b-modal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { required, minLength, minValue, numeric } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import postcodes from '../data/postcode'

export default {
  data() {
    return {
      charity: "",
      campaigns: [],
      isFetching: "true",

      error: null,
      isInvalid: false,

      title: "",
      description: "",
      city: "Kuala Lumpur",
      postcodes: postcodes,
      cause: [],
      goal: "",
      postcode: "",
      image: "",
      collaborating: [],
      urgent: false,

      url: false,

      all: [],
      urgentArray: [],

      charitiesOptions: [],

      options: [
        { id: 1, name: "Animals" },
        { id: 2, name: "Children & Youth" },
        { id: 3, name: "Disabilities" },
        { id: 4, name: "Education" },
        { id: 5, name: "Environment" },
        { id: 6, name: "Elderly" },
        { id: 7, name: "Health" },
        { id: 8, name: "Homeless" },
        { id: 9, name: "Hunger & Poverty" },
        { id: 10, name: "Women's Issues" },
      ],
    };
  },
  validations: {
    title: {
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
    cause: {
      required,
    },
    goal: {
      required,
      numeric,
      minValue: minValue(1000)
    },
    postcode: {
      required,
    },
  },
  components: {
    Multiselect,
  },
  computed: {
    ...mapState({
      id: (state) => state.auth.id,
      role: (state) => state.auth.role,
    }),
  },
  async created() {
    if (this.$cookie.get("charity")) {
      this.charity = JSON.parse(this.$cookie.get("charity"))._id;
      await this["charities/getCharityById"](this.id).then((res) => {
        if (res.data.success) {
          if (res.data.user != null) {
            //let code = 1;
            res.data.user.connection.forEach((c) => {
              this.charitiesOptions.push({ id: c._id, name: c.user.name });
              //code = code + 1;
            });
            this.campaigns = res.data.user.campaigns;
            this.showModal();
          } else {
            this.$swal({
              title: "Unauthorized to add campaigns!",
              text: "Create your profile first",
              confirmButtonText: "Redirect to profile",
              confirmButtonColor: "#4466f2",
              icon: "warning",
            }).then((result) => {
              if (result.value) {
                this.$router.push("/profile");
              }
            });
          }
        }
      });
    } else {
      this.$swal({
        title: "Unauthorized to add campaigns!",
        text: "Create your profile first",
        confirmButtonText: "Redirect to profile",
        confirmButtonColor: "#4466f2",
        icon: "warning",
      }).then((result) => {
        if (result.value) {
          this.$router.push("/profile");
        }
      });
    }
  },
  methods: {
    showModal() {
      this.$refs["my-modal-create"].show();
    },
    toggleModal() {
      this.$emit("toParent", "false");
    },
    //Add new modal
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.cause.push(tag);
    },
    onChange() {
      if (this.cause.length < 1) {
        this.isInvalid = true;
      } else {
        this.isInvalid = false;
      }
    },
    isEmpty: function () {
      return (
        (this.$refs.wizard.activeTabIndex == 0 &&
          (this.title == "" ||
            this.city == "" ||
            this.postcode == "" ||
            this.cause.length == 0)) ||
        (this.$refs.wizard.activeTabIndex == 1 &&
          (this.description == "" || this.image == "")) ||
        (this.$refs.wizard.activeTabIndex == 2 && this.goal == "")
      );
    },
    handleErrorMessage: function (error) {
      this.error = error;
    },
    validateAsync: function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.$v.$anyError || this.isInvalid) {
            reject("Correct all highlighted errors and try again");
          } else if (this.isEmpty()) {
            reject("Fill up the required fields first");
          } else {
            resolve(true);
          }
        }, 1000);
      });
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);

      this.image = this.$refs.file.files[0];
    },
    getFormData() {
      const formData = new FormData();
      formData.append("charity", this.charity);
      formData.append("title", this.title);
      formData.append("image", this.image);
      formData.append("goal", this.goal);
      formData.append("description", this.description);
      formData.append("city", this.city);
      formData.append("postcode", this.postcode);
      formData.append("urgent", this.urgent);
      let causes = this.cause.map((cause) => cause.name);
      for (let i = 0; i < causes.length; i++) {
        formData.append("cause[]", causes[i]);
      }
      let collaborating = this.collaborating.map((c) => c.id);
      if (this.collaborating.length >= 1) {
        for (let i = 0; i < collaborating.length; i++) {
          formData.append("collaborating[]", collaborating[i]);
        }
      }
      return formData;
    },
    ...mapActions([
      "campaigns/createCampaign",
      "charities/updateCharity",
      "charities/getCharityById",
    ]),
    addCampaign() {
      if (this.role == "charity") {
        let req = this.getFormData();
        this["campaigns/createCampaign"](req)
          .then((res) => {
            console.log("res", res);
            if (res.data.success) {
              let newcampaigns = this.campaigns.map((campaign) => campaign._id);
              newcampaigns.push(res.data._id);
              console.log("after adding campaigns", newcampaigns);

              let req = {
                user: { campaigns: newcampaigns },
                id: this.id,
              };

              this["charities/updateCharity"](req).then((res) => {
                if (res.data.success) {
                  console.log("updated campaigns in charity");
                }
              });
              this.$swal({
                title: "Successfully Added!",
                icon: "success",
              });
              
            }
          })
          .catch(function (err) {
            this.$swal({
              title: "Unable to add. Try again later.!",
              icon: "warning",
            });
            console.log(err);
          });

        setTimeout(function(){ location.reload(); }, 4000); 
        this.toggleModal();
         
      } else {
        this.$swal({
          title: "Unauthorized to add campaigns!",
          text: "Create your profile first",
          confirmButtonText: "Redirect to profile",
          confirmButtonColor: "#4466f2",
          icon: "warning",
        }).then((result) => {
          if (result.value) {
            this.$router.push("/profile");
          }
        });
        this.toggleModal();
      }
    },
  },
};
</script>