<template>
  <!-- Vertically centered Modal Component -->
  <b-modal @hidden="toggleModal()" ref='my-modal-create' id="modal-3" size="lg" hide-footer centered title="Create New Opportunity" class="theme-modal">
    <b-alert variant="danger" show dismissible class="alert alert-danger alert-dismissible fade show" v-if="error">
      <i class="fa fa-exclamation-triangle mr-2"></i>
      {{error}}
    </b-alert>
    <form @submit.prevent enctype="multipart/form-data" >
    <form-wizard color="#4466f2" ref="wizard" :start-index="0" title="" subtitle="" back-button-text="Back" next-button-text="Next!" finish-button-text="Submit" @on-error="handleErrorMessage" @on-complete="addOpportunity">
      <tab-content title="Opportunity details" :before-change="validateAsync">
        <div class="setup-content" id="step-1">
          <div class="col-xs-12">
            <div class="col-md-12">
              <div class="form-group">
                <label class="control-label">In collaboration with: </label>
                <multiselect v-model="collaborating" placeholder="Search and add a charity" label="name" track-by="id" :options="charitiesOptions" :multiple="true" :taggable="false"></multiselect>
              </div>
              <div class="form-group" :class="{ 'form-group--error': $v.title.$error }">
                <label class="control-label">What is your Opportunity Title ?</label><span class="required"> *</span>
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
                <label class="control-label">Choose relevant opportunity causes</label><span class="required"> *</span>
                <multiselect v-model="cause" tag-placeholder="Add this as new tag" placeholder="Search or add a category" label="name" track-by="id" :options="options" :multiple="true" :taggable="true" @tag="addTag" @close="onChange(cause)"></multiselect>
              </div>
              <template v-if="isInvalid">
                <div class="error">
                  Select one or more causes
                </div>
              </template>
              <div class="form-group">
                <label class="control-label" :class="{ 'form-group--error': $v.city.$error }">City</label><span class="required"> *</span>
                <input class="form-control" type="text" placeholder="City" v-model.trim="$v.city.$model" />
              </div>
              <template v-if="$v.city.$error">
                <div class="error" v-if="!$v.city.required">
                  Field is required
                </div>
              </template>
              <div class="form-group">
                <label class="control-label">Postcode</label><span class="required"> *</span>
                <input class="form-control" type="text" placeholder="" v-model.trim="$v.postcode.$model" />
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
      <tab-content title="Opportunity Description" :before-change="validateAsync">
        <div class="setup-content" id="step-2">
          <div class="col-xs-12">
            <div class="col-md-12">
              <div class="form-group">
                <label class="control-label">Add an image</label><span class="required"> *</span>
                <input class="form-control" type="file" ref="file" accept=".png, .jpg, .jpeg" @change="onFileChange"/>
              </div>
              <div class="form-group">
                <label class="control-label" :class="{'form-group--error': $v.shortDescription.$error}">Summarize your opportunity</label><span class="required"> *</span>
                <input class="form-control" type="text" placeholder="A brief summary about your opportunity" v-model.trim="$v.shortDescription.$model" />
              </div>
              <template v-if="$v.shortDescription.$error">
                <div class="error" v-if="!$v.shortDescription.required">
                  Field is required
                </div>
                <div class="error" v-if="!$v.shortDescription.minLength">
                  Summary must have at least {{$v.shortDescription.$params.minLength.min}} letters.
                </div>
              </template>

              <div class="form-group" :class="{'form-group--error': $v.description.$error}">
                <label class="control-label">Give more details</label><span class="required"> *</span>
                <textarea class="form-control" rows="5" placeholder="A detailed description about the volunteering opportunity" v-model.trim="$v.description.$model"></textarea>
              </div>
              <template v-if="$v.description.$error">
                <div class="error" v-if="!$v.description.required">
                  Field is required
                </div>
                <div class="error" v-if="!$v.description.minLength">
                  Description must have at least {{$v.description.$params.minLength.min}} letters.
                </div>
              </template>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Volunteer profile" :before-change="validateAsync">
        <div class="setup-content" id="step-3">
          <div class="col-xs-12">
            <div class="col-md-12">
              <div class="form-group m-checkbox-inline mb-0">
                <label class="control-label">Mark as urgent: </label>
                <div class="radio radio-primary d-inline-block">
                  <b-form-radio v-model="urgent" :value="true">Yes</b-form-radio>
                </div>
                <div class="radio radio-primary d-inline-block">
                  <b-form-radio v-model="urgent" :value="false" checked>No</b-form-radio>
                </div>
              </div>
              <div class="form-group" :class="{ 'invalid': isInvalid }">
                <label class="control-label">Choose required volunteer skills</label><span class="required"> *</span>
                <multiselect v-model="skills" tag-placeholder="Add this as new tag" placeholder="Search or add a skill" label="name" track-by="id" :options="skillsOptions" :multiple="true" :taggable="true" @tag="addSkill" @close="onChange(skills)"></multiselect>
              </div>
              <template v-if="isInvalid">
                <div class="error">
                  Select at least one skill
                </div>
              </template>
              <div class="form-group" :class="{ 'invalid': reqsInvalid }">
                <label class="control-label">Add volunteer requirements</label><span class="required"> *</span>
                <multiselect v-model="reqs" tag-placeholder="Add this as new requirement" placeholder="Requirements" label="name" track-by="id" :options="reqsOptions" :multiple="true" :taggable="true" @tag="addReqs" @close="onChangeReqs(reqs)"></multiselect>
              </div>
              <template v-if=" reqsInvalid">
                <div class="error">
                  Add at least one requirement
                </div>
              </template>
              <div class="form-group" :class="{ 'invalid': respInvalid }">
                <label class="control-label">List volunteer responsabilites</label><span class="required"> *</span>
                <multiselect v-model="resp" tag-placeholder="Add this as new responsability" placeholder="Responsabilities" label="name" track-by="id" :options="respOptions" :multiple="true" :taggable="true" @tag="addResp" @close="onChangeResp(resp)"></multiselect>
              </div>
              <template v-if="respInvalid">
                <div class="error">
                  Add at least one responsability
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
label {
  font-weight: 500;
}

.m-checkbox-inline {
  label {
    margin-right: 15px;
  }

  .d-inline-block {
    display: inline-block !important;
    margin-right: 1rem;
  }
}

.multiselect__tag {
  background: #51bb25;
}
.multiselect__tag-icon::after {
  color: #fff;
}
b-modal {
  background: #fff;
  box-shadow: 0px 15px 16.83px 0.17px rgba(0, 0, 0, 0.05);
  -moz-box-shadow: 0px 15px 16.83px 0.17px rgba(0, 0, 0, 0.05);
  -webkit-box-shadow: 0px 15px 16.83px 0.17px rgba(0, 0, 0, 0.05);
  -o-box-shadow: 0px 15px 16.83px 0.17px rgba(0, 0, 0, 0.05);
  -ms-box-shadow: 0px 15px 16.83px 0.17px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  -moz-border-radius: 20px;
  -webkit-border-radius: 20px;
  -o-border-radius: 20px;
  -ms-border-radius: 20px;
}

.product-box {
  border-radius: 0px;
}

.img-fluid {
  width: 100%;
  border-radius: 0.25rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  max-width: 100%;
  height: auto;
}

.ribbon {
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  clear: left;
  position: absolute;
  top: 12px;
  left: 0px;
  color: #fff;
  z-index: 2;
}

.ribbon-danger {
  background: #dc3545;
}

.form-group--error .form-control {
  border: 2px solid #e72734;
  box-shadow: 0 0 0 0.2rem rgba(179, 65, 99, 0.514);
}

.invalid .multiselect__tags {
  border: 2px solid #e72734;
  box-shadow: 0 0 0 0.2rem rgba(179, 65, 99, 0.514);
}

.error {
  color: red;
  font-size: 0.75em;
  padding-left: 10px;
  margin-top: -10px;
}

.badge-box {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  right: 0px;
  top: 15px;
}

.badge {
  flex: 1 1 10%;
}
</style>

<script>
import { mapActions, mapState } from "vuex";
import { required, minLength } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import postcodes from '../data/postcode'

export default {
  data() {
    return {
      charity: "",
      name: "",
      opportunities: [],
      isFetching: "true",
      createNew: false,

      error: null,
      isInvalid: false,
      respInvalid: false,
      reqsInvalid: false,

      title: "",
      description: "",
      shortDescription: "",
      city: "Kuala Lumpur",
      postcodes: postcodes,
      cause: [],
      skills: [],
      postcode: "",
      image: "",
      collaborating: [],
      urgent: false,
      reqs: [],
      resp: [],

      charitiesOptions: [],

      skillsOptions: [
        { id: 1, name: "Computer Science" },
        { id: 2, name: "Critical Thinking" },
        { id: 3, name: "Design" },
        { id: 4, name: "Creativity" },
        { id: 5, name: "Communication" },
        { id: 6, name: "Languages" },
        { id: 7, name: "Teaching" },
        { id: 8, name: "Collaboration" },
        { id: 9, name: "Leadership" },
        { id: 10, name: "Compassion" },
      ],

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

      respOptions: [],
      reqsOptions: [],
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
    shortDescription: {
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
  components: {
    Multiselect,
  },
computed: {
    ...mapState({
      id: (state) => state.auth.id,
      role: (state) => state.auth.role
    }),
  },
  async created() {
    await this["charities/getCharityById"](this.id).then((res) => {
      if (res.data.success) {
        if (res.data.user != null) {
          res.data.user.connection.forEach((c) => {
            this.charitiesOptions.push({ id: c._id, name: c.user.name });
          });
          this.charity = JSON.parse(this.$cookie.get("charity"))._id;
          this.name = JSON.parse(this.$cookie.get("charity")).user.name
          this.opportunities = res.data.user.opportunities    
          console.log("charity _id", this.charity);
          console.log("opportunities", this.opportunities);
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

  },
  methods: {
    ...mapActions([
      "opportunities/createOpportunity",
      "charities/updateCharity",
      "updateVolunteer",
      "charities/getCharityById",
    ]),
    showModal() {
      this.$refs["my-modal-create"].show();
    },
    toggleModal() {
      this.$emit("toParent", "false");
    },
    //Add new opportunity modal methods
    onChange(array) {
      if (array.length < 1) {
        this.isInvalid = true;
      } else {
        this.isInvalid = false;
      }
    },
    onChangeResp(array) {
      if (array.length < 1) {
        this.respInvalid = true;
      } else {
        this.respInvalid = false;
      }
    },
    onChangeReqs(array) {
      if (array.length < 1) {
        this.reqsInvalid = true;
      } else {
        this.reqsInvalid = false;
      }
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        id: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.cause.push(tag);
    },

    addSkill(newTag) {
      const tag = {
        name: newTag,
        id: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.skillsOptions.push(tag);
      this.skills.push(tag);
    },

    addResp(newTag) {
      const tag = {
        name: newTag,
        id: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.respOptions.push(tag);
      this.resp.push(tag);
    },

    addReqs(newTag) {
      const tag = {
        name: newTag,
        id: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.reqsOptions.push(tag);
      this.reqs.push(tag);
    },

    handleErrorMessage: function (error) {
      this.error = error;
    },

    isEmpty: function () {
      return (
        (this.$refs.wizard.activeTabIndex == 0 &&
          (this.title == "" ||
            this.city == "" ||
            this.postcode == "" ||
            this.cause.length == 0)) ||
        (this.$refs.wizard.activeTabIndex == 1 &&
          (this.description == "" || this.shortDescription == "" || this.image=="")) ||
        (this.$refs.wizard.activeTabIndex == 2 &&
          (this.reqs.length == 0 ||
            this.resp.length == 0 ||
            this.skills.length == 0))
      );
    },

    validateAsync: function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (
            this.$v.$anyError ||
            this.isInvalid ||
            this.reqsInvalid ||
            this.respInvalid             
          ) {
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
    addOpportunity() {
      if (this.role == "charity") {
        let s = this.skills.map((skill) => skill.name);
        let c = this.cause.map((cause) => cause.name);
        this.tags = s.concat(c);
        this.tags.push(this.city);
        this.tags.push(this.name);

        const formData = new FormData();
        formData.append("charity", this.charity);
        formData.append("title", this.title);
        formData.append("image", this.image);
        formData.append("shortDescription", this.shortDescription);
        formData.append("description", this.description);       
        formData.append("city", this.city);
        formData.append("postcode", this.postcode);
        formData.append("urgent", this.urgent);
        for (let i = 0; i < c.length; i++) {
          formData.append('cause[]', c[i]);
        }
        for (let i = 0; i < this.tags.length; i++) {
          formData.append('tags[]', this.tags[i]);
        }
        let collaborating = this.collaborating.map((c)=> c.id)
        if(this.collaborating.length>=1){
          for (let i = 0; i < collaborating.length; i++) {
            formData.append("collaborating[]", collaborating[i]);
          }
        }
        for (let i = 0; i < s.length; i++) {
          formData.append('skills[]', s[i]);
        }
        let reqs = this.reqs.map((r) => r.name)
        for (let i = 0; i < reqs.length; i++) {
          formData.append('reqs[]', reqs[i]);
        }
        let resp = this.resp.map((r) => r.name)
        for (let i = 0; i < resp.length; i++) {
          formData.append('resp[]', resp[i]);
        }
        
        console.log('Form sent', formData)
        this["opportunities/createOpportunity"](formData)
          .then((res) => {
            if (res.data.success) {
              this.opportunities.push(res.data._id);

              console.log("opp", this.opportunities);

              let req = {
                user: { opportunities: this.opportunities },
                id: this.id,
              };

              this["charities/updateCharity"](req).then((res) => {
                if (res.data.success) {
                  console.log("updated opportunities in charity");
                }
              });

              this.$swal({
                title: "Successfully Added!",
                icon: "success",
              });
              
              setTimeout(function(){ location.reload(); }, 4000);  
            }
          })
          .catch(function (err) {
            this.$swal({
              title: "Unable to add. Try again later.!",
              icon: "warning",
            });
            console.log(err);
          });

         this.toggleModal();

      } else {
        this.$swal({
          title: "Unauthorized to add opportunities!",
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