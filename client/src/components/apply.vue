<template>
  <!-- Vertically centered Modal Component -->
  <b-modal @hidden="toggleModal()" ref='my-modal' size="lg" hide-footer centered title="Review your application" class="theme-modal">
    <b-alert variant="danger" show dismissible class="alert alert-danger alert-dismissible fade show" v-if="error">
      <i class="fa fa-exclamation-triangle mr-2"></i>
      {{error}}
    </b-alert>
    <div class="row mb-50 m-l-10">
      <div class="user-image">
        <img class="img-110 rounded-circle" :src="getImgUrl(image)">
        <!-- <label for="file-input" class="icon-wrapper">
          <i class="fa fa-pencil"></i>
        </label> -->
        <!-- <input style="display: none;" id="file-input" type="file" accept=".png, .jpg, .jpeg" @change="onFileChange" /> -->
      </div>
      <div class="col">
        <h3 class="mt-20">{{user.name}}</h3>
        <p>{{user.username}}</p>
      </div>
    </div>
    <div class="mb-50 m-l-10">
      <div class="form-group">
        <h6 class="form-label">Skills</h6>
        <ul v-if="isDisabled" class="items">
          <li class="badge badge-secondary pull-right" v-for="(c, i) in skillsList" :key="i" v-text="c"></li>
        </ul>
        <multiselect v-else v-model="skills" tag-placeholder="Add this as new tag" placeholder="Search or add a skill" label="name" track-by="code" :options="options" :multiple="true" :taggable="true" @tag="addTag"></multiselect>
      </div>
      <div class="form-group">
        <h6 class="form-label">Causes</h6>
        <ul v-if="isDisabled" class="items">
          <li class="badge badge-secondary pull-right" v-for="(c, i) in causesList" :key="i" v-text="c"></li>
        </ul>
        <multiselect v-else v-model="causes" tag-placeholder="Add this as new tag" placeholder="Search or add a cause" label="name" track-by="code" :options="options2" :multiple="true" :taggable="true" @tag="addTag2"></multiselect>
      </div>
      <div class="form-group">
        <h6 class="form-label">About me</h6>
        <textarea v-if="about" :disabled="isDisabled" v-model="about" class="form-control" rows="2"></textarea>
        <textarea v-else class="form-control" rows="2" v-model="about" placeholder="Introduce yourself"></textarea>
      </div>
      <div class="form-group">
        <h6 class="form-label">Volunteering Experience</h6>
        <textarea v-if="description && !isNew" v-model="description" :disabled="isDisabled" class="form-control" rows="4"></textarea>
        <textarea v-else class="form-control" v-model="description" rows="4" placeholder="A short description about your volunteering experience"></textarea>
      </div>
      <hr />
      <h4 class="mb-0"><i class="fa fa-file mr-2"></i>Work History</h4>
      <hr />
      <div class="form-group">
        <i class="fa fa-briefcase mr-2"></i><label class="form-label">Portfolio website</label>
        <input v-if="portfolio && !isNew" v-model="portfolio" :disabled="isDisabled" class="form-control" type="text" />
        <input v-else class="form-control" v-model="portfolio" type="text" placeholder="Portfolio" />
      </div>
      <div class="form-group">
        <i class="fa fa-linkedin mr-2"></i><label class="form-label">LinkedIn</label>
        <input v-if="linkedin && !isNew" v-model="linkedin" :disabled="isDisabled" class="form-control" type="text" />
        <input v-else class="form-control" v-model="linkedin" type="text" placeholder="LinkedIn" />
      </div>

    </div>
    <hr />
    <button class="btn btn-success m-r-10 cart-btn-transform" @click="apply"><i class="fa fa-check-circle mr-1"></i>Apply Now</button>
    <button v-show="!clicked" class="btn btn-primary m-r-10" @click="update">Update application</button>
    <button v-show="clicked" class="btn btn-danger" @click="cancel">Cancel</button>
  </b-modal>

</template>

<script>
import { mapActions, mapState } from "vuex";
import Multiselect from "vue-multiselect";
import moment from "moment"

export default {
  props: ["opportunity"],
  name: "ApplyModal",
  data() {
    return {
      clicked: false,
      isDisabled: true,
      url: false, //get image file from database

      error: null,

      isNew: false,

      instagram: "",
      skillsList: [],
      skills: [],
      image: "",
      about: "",
      description: "",
      causes: [],
      causesList: [],
      city: "",
      postcode: "",
      charities: [],
      mobile: "",
      facebook: "",
      website: "",
      linkedin: "",
      portfolio: "",
      tags: [],
      applications: [],
      donations: [],
      opportunities: [],
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
      options: [
        { code: 1, name: "Computer Science" },
        { code: 2, name: "Critical Thinking" },
        { code: 3, name: "Design" },
        { code: 4, name: "Creativity" },
        { code: 5, name: "Communication" },
        { code: 6, name: "Languages" },
        { code: 7, name: "Teaching" },
        { code: 8, name: "Collaboration" },
        { code: 9, name: "Leadership" },
        { code: 10, name: "Compassion" },
      ],
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }, //pass as a prop from login page
    ...mapState({
      volunteer: (state) => state.volunteers.volunteerProfile,
      id: (state) => state.auth.id,
      role: (state) => state.auth.role,
    }),
  },
  components: {
    Multiselect,
  },
  mounted() {
    this.getVolunteerById(this.id);

    if (this.volunteer) {
      this.name = this.volunteer.user.name;
      this.username = this.volunteer.user.username;
      this.skillsList = this.volunteer.skills;
      this.image= this.volunteer.image
      this.about = this.volunteer.about;
      this.description = this.volunteer.description;
      this.causesList = this.volunteer.causes;
      this.tags = this.volunteer.tags;
      this.city = this.volunteer.city;
      this.postcode = this.volunteer.postcode;
      this.mobile = this.volunteer.mobile;
      this.facebook = this.volunteer.facebook;
      this.website = this.volunteer.website;
      this.linkedin = this.volunteer.linkedin;
      this.portfolio = this.volunteer.portfolio;

      this.showModal();
    } else {
      this.$swal({
        title: "Unauthorized to apply",
        text: "Complete your volunteer profile first",
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
  methods: {
    ...mapActions([
      "getVolunteerById",
      "updateVolunteer",
      "application/createApplication",
      "opportunities/updateOpportunity",
    ]),
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    showModal() {
      this.$refs["my-modal"].show();
    },
    toggleModal() {
      this.$emit("toParent", this.opportunity._id);
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    },
    update() {
      this.isDisabled = false;
      this.clicked = true;
    },
    cancel() {
      this.isDisabled = true;
      this.clicked = false;
    },
    apply() {
      this.addApplication();
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.skills.push(tag);
    },
    addTag2(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options2.push(tag);
      this.causes.push(tag);
    },
    createNotification(){    
      let time = moment()  
      return {
          message: `${this.volunteer.user.name} has applied for ${this.opportunity.title}`, 
          category :'application',
          user : this.opportunity.charity.user._id,
          seen : false,
          image : this.volunteer.image,
          time: time.toISOString()
      }
    },
    async addApplication() {
      let s = []
      let c = []
      if(!this.isDisabled){
        s = this.skills.map((skill) => skill.name);
        c = this.causes.map((cause) => cause.name);
      } else {
        s = this.skillsList
        c = this.causesList
      }
      if (this.role == "user") {
        let application = { 
          application: {
            applicant: this.volunteer._id,
            event: this.opportunity._id,
            details: {
              name: this.volunteer.user.name,
              username: this.volunteer.user.username,
              image: this.image,
              about: this.about,
              description: this.description,
              causes: c,
              skills: s,
              linkedin: this.linkedin,
              portfolio: this.portfolio,
            },            
          }
        };

        application.notification = this.createNotification()
        console.log(application)

        await this["application/createApplication"](application)
          .then((res) => {
            if (res.data.success) {
              console.log(res.data)
              this.$swal({
                title: "Successfully Added!",
                icon: "success",
              });
              setTimeout(function(){ location.reload(); }, 5000); 
            }
          })
          .catch(function (err) {
            this.$swal({
              title: "Unable to add. Try again later.!",
              icon: "warning",
            });
            console.log(err);
          });

        this.$refs["my-modal"].hide();
      } else {
        this.$swal({
          title: "Unauthorized to add applications!",
          text: "Create your profile first",
          icon: "warning",
        });
      }
    },
  },
};
</script>
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
</style>