<template>
  <div class="container-fluid product-wrapper sidebaron" v-if="!isFetching">
    <div class="page-title"></div>

    <div class="row">
      <div class="col-md-9">
        <div class="card custom-card">
          <div class="row mb-2">
            <div class="col-auto">
              <img class="img-120 rounded-circle" alt="" :src="getImgUrl(charity.image)" />
            </div>
            <div class="col-6">
              <h3 class="mb-1">{{ charity.user.name }}</h3>
              <h6 class="mb-2">{{ charity.mission }}</h6>
              <ul class="card-social">
                <li>
                  <span class="mr-1">{{ charity.supporter.length }}</span><i>Supporters</i>
                </li>
                <li>
                  <span class="mr-1 ml-4">{{ charity.connection.length }}</span><i>Connections</i>
                </li>
                <li>
                  <span class="mr-1 ml-4">{{ charity.opportunities.length + charity.campaigns.length }}</span><i>Projects</i>
                </li>
              </ul>
              <p>{{ charity.description }}</p>
              <ul class="card-social">
                <li v-if="role=='user'">
                  <button v-if="!isSupporting(charity._id)" class="btn btn-outline-primary" @click="support(charity)"><i class="fa fa-heart mr-2"></i>Support</button>
                  <button v-else class="btn btn-outline-primary" @click="unsupport(charity)"><i class="fa fa-times mr-2"></i>Unsupport</button>
                </li>
                <li v-else>
                  <button v-if="isCollaborating(charity._id)"  class="btn btn-outline-primary"  disabled><i class="fa fa-heart mr-2"></i><span>Collaborating</span></button>
                  <button v-else class="btn btn-outline-primary" @click="collaborate(charity)">
                    <i class="fa fa-heart mr-2"></i>
                    <span>Collaborate</span>
                  </button>
                </li>
                <li>
                  <router-link :to="'/chat/' + charity.user._id" class="btn-outline-secondary"><i class="fa fa-comments mr-2"></i>Contact</router-link>
                </li>
              </ul>
            </div>
            <div class="col">
              <h6 class="f-w-600">Causes</h6>
              <ul class="items">
                <li class="badge badge-secondary pull-right" v-for="(c, i) in charity.cause" :key="i" v-text="c"></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <div class="contact">
              <h5>Contact Details</h5>
              <ul class="items">
                <li v-if="charity.mobile"><i class="fa fa-mobile mr-2 mb-4"></i>{{ charity.mobile }}</li>
                <li v-else>
                  <i class="fa fa-mobile mr-2 mb-4"></i><i>No mobile number</i>
                </li>
                <li v-if="charity.website">
                  <i class="fa fa-check-circle mr-2 mb-4"></i><a :href="'https://'+charity.website" target="_blank">{{ charity.website }}</a>
                </li>
                <li v-else>
                  <i class="fa fa-check-circle mr-2 mb-4"></i><i>No website</i>
                </li>
                <li v-if="charity.facebook">
                  <i class="fa fa-facebook mr-2 mb-4"></i><a :href="'https://www.facebook.com/'+charity.facebook" target="_blank">{{ charity.facebook }}</a>
                </li>
                <li v-else>
                  <i class="fa fa-facebook mr-2 mb-4"></i><i>No facebook account</i>
                </li>
                <li  v-if="charity.instagram">
                  <i class="fa fa-instagram mr-2 mb-4"></i><a :href="'https://www.instagram.com/'+charity.instagram" target="_blank">{{charity.instagram}}</a>
                </li>
                <li v-else>
                  <i class="fa fa-instagram mr-2 mb-4"></i><i>No instgram account</i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="row product-page-main">
        <div class="col-sm-12">
          <ul class="nav nav-tabs border-tab mb-0" role="tablist">
            <li class="nav-item" @click="tabContent('volunteer')">
              <a class="nav-link" data-toggle="tab" role="tab" :class="[{ active: activeTab == 'volunteer' }]">Volunteering Opportunities</a>
              <div class="material-border"></div>
            </li>
            <li class="nav-item" @click="tabContent('donate')">
              <a class="nav-link" data-toggle="tab" role="tab" :class="[{ active: activeTab == 'donate' }]">Donations Campaigns</a>
              <div class="material-border"></div>
            </li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade" :class="{ 'show active': activeTab == 'volunteer' }" role="tabpanel">
              <!-- :class="listViewEnabled?'list-view':''"
              :class="[listViewEnabled ? 'col-md-10' : 'col-xl-3 col-md-6']" -->
              <div class="product-wrapper-grid">
                <div class="row">
                  <div class="mb-0 m-t-20 ml-10 col-md-3" v-for="(opportunity, index) in charity.opportunities" :key="index">
                    <div class="card">
                      <div class="product-box">
                        <div class="product-img">
                          <div class="ribbon ribbon-danger" v-if="opportunity.urgent">
                            Important
                          </div>

                          <img class="img-fluid" :src="getImgUrl(opportunity.image)" alt />

                          <div class="product-hover">
                            <ul>
                              <button v-if="isApplied(opportunity._id)" class="btn btn-success m-r-10 cart-btn-transform" disabled><i class="fa fa-check-circle mr-1"></i> Applied</button>
                              <button v-else v-show="role!='charity'" class="btn btn-success m-r-10 cart-btn-transform" @click="openApplyModal(opportunity._id)"><i class="fa fa-check-circle mr-1"></i> Apply Now</button>
                              <ApplyModal v-if="all[opportunity._id]" :opportunity="opportunity" @toParent="handler"></ApplyModal>
                            </ul>
                          </div>
                        </div>

                        <div class="product-details">
                          <router-link :to="'/opportunities/' + opportunity._id">
                            <h4>{{ opportunity.title }}</h4>
                          </router-link>

                          <p style="margin-bottom: 0px">
                            <i class="fa fa-certificate mr-2"></i>
                            {{ charity.user.name }}
                          </p>
                          <p>
                            <i class="fa fa-map-marker mr-2"></i>
                            {{ opportunity.city }}
                          </p>
                          <p v-if="listViewEnabled">
                            {{ opportunity.shortDescription }}
                          </p>
                        </div>
                        <div v-if="listViewEnabled" class="other-details">
                          <!-- <h6 class="f-w-600">Start Date</h6>
                          <ul class="items">
                            <li
                              class="badge badge-primary pull-right"
                              v-text="opportunity.startDate"
                            ></li>
                          </ul> -->
                          <h6 class="f-w-600">Causes</h6>
                          <ul class="items">
                            <li class="badge badge-secondary pull-right" v-for="(c, i) in opportunity.cause" :key="i" v-text="c"></li>
                          </ul>
                          <h6 class="f-w-600">Skills</h6>
                          <ul class="items">
                            <li class="badge badge-success pull-right" v-if="opportunity.skills.length == 0">
                              None
                            </li>
                            <li v-else class="badge badge-success pull-right" v-for="(c, i) in opportunity.skills" :key="i" v-text="c"></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" role="tabpanel" :class="{ 'show active': activeTab == 'donate' }">
              <div class="row">
                <div class="mb-0 m-t-20 ml-10 col-xl-4 col-lg-6" v-for="(project, index) in charity.campaigns" :key="index" :class="index < 3 ? 'mb-4' : ''">
                  <div class="card">
                    <div class="product-box">
                      <div class="product-img">
                        <div class="ribbon ribbon-danger" v-if="project.urgent">
                          Urgent
                        </div>
                        <div class="badge-box">
                          <span v-for="(cause, index) in project.cause" :key="index" class="badge" :class="'badge-' + type(project)">{{ cause }}</span>
                        </div>
                        <img class="campaign-image" :src="getImgUrl(project.image)" alt />
                        <div class="product-hover">
                          <ul>
                            <button v-show="role!='charity'" class="btn btn-success m-r-10 cart-btn-transform" @click="openDonateModal('donation_${project._id}')"><i class="fa fa-check-circle mr-1"></i> Donate Now</button>
                            <DonateModal v-if="allDonations[project._id]" :campaign="project" @toParent="handlerDonations" activeTab="all"></DonateModal>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="project-box">
                      <router-link :to="'/campaigns/' + project._id">
                        <h5>{{ project.title }}</h5>
                      </router-link>
                      <div class="media">
                        <img class="img-20 mr-1 rounded-circle" :src="getImgUrl(charity.image)" alt="" title="" />
                        <router-link :to="'/charities/' + charity.user._id">
                          <p>{{ charity.user.name }}</p>
                        </router-link>
                      </div>
                      <div class="media">
                        <i class="fa fa-map-marker mr-2 ml-1 mt-1"></i>
                        <p>
                          {{ project.city }} ,
                          {{ project.postcode }}
                        </p>
                      </div>
                      <!-- <p class="description">
                          {{ project.description }}
                        </p> -->
                      <div class="project-status mt-4">
                        <div class="media mb-0">
                          <p>
                            {{ countDonations(project.donations) }} $ raised
                          </p>
                          <div class="media-body text-right">
                            <span>{{ project.goal }} $</span>
                          </div>
                        </div>
                        <div class="progress" style="height: 5px">
                          <div class="progress-bar-animated progress-bar-striped" :class="'bg-' + type(project)" role="progressbar" :style="{
                                width:
                                  (countDonations(project.donations) /
                                    project.goal) *
                                    100 +
                                  '%',
                              }" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.checkbox_animated {
  cursor: pointer;
  position: relative;
  margin: 0 1rem 0 0;
}
.product-wrapper-grid {
  min-height: 1000px;
}

.product-wrapper-grid.list-view .product-box .product-details {
  width: 50%;
}

.product-wrapper-grid.list-view .product-box .other-details {
  width: 30%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.items {
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
}

.badge {
  flex: 1 1 10%;
  font-size: 90%;
  cursor: pointer;
}

.product-box .product-img .product-hover ul li {
  width: max-content;
}

.product-box {
  border-radius: 0px;
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

.img-120 {
  width: 120px;
  height: 120px;
}

ul {
  padding-left: 0px;
  list-style-type: none;
  margin-bottom: 0;
}

.btn {
  padding: 6px 15px;
  font-weight: 500;
  font-size: 12px;
  margin-right: 10px;
}

.btn-outline-secondary {
  border: 1px solid #f73164;
  color: #f73164;
  background-color: transparent;
}

.btn-outline-secondary:hover,
.btn-outline-secondary:focus,
.btn-outline-secondary:active,
.btn-outline-secondary.active {
  color: white;
  background-color: #ec0944 !important;
  border-color: #ec0944 !important;
}

.btn-outline-primary1 {
  border: 1px solid #7366ff;
  color: #7366ff;
  background-color: transparent;
}

.btn-outline-primary1:hover,
.btn-outline-primary1:focus,
.btn-outline-primary1:active {
  color: white;
  background-color: #4433ff !important;
  border-color: #4433ff !important;
}

.card-social li button {
  letter-spacing: 0;
  cursor: pointer;
  padding: 0.375rem 1.75rem;
  font-weight: 500;
  font-size: 15px;
  margin-right: 10px;
  border-radius: 60px;
  box-shadow: 0 5px 10px 2px rgba(88, 103, 221, 0.19) !important;
}
.badge-box {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  right: 0px;
  top: 15px;
}
.campaign-image{
  height: 310px;
  width: 470px;
}
.contact{
  i.fa {
    display: inline-block;
    border-radius: 60px;
    box-shadow: 0px 0px 2px #888;
    padding: 0.5em 0.6em;
  }
}


.fa-facebook, .fa-facebook-square { color: #3b5998; }
.fa-twitter, .fa-twitter-square { color: #00aced; }
.fa-google-plus, .fa-google-plus-square { color: #dd4b39; }
.fa-youtube, .fa-youtube-play, .fa-youtube-square { color: #bb0000; }
.fa-tumblr, .fa-tumblr-square { color: #32506d; }
.fa-vine { color: #00bf8f; }
.fa-flickr { color: #ff0084; }
.fa-vimeo-square { color: #aad450; }
.fa-pinterest, .fa-pinterest-square { color: #cb2027; }
.fa-linkedin, .fa-linkedin-square { color: #007bb6;}
.fa-instagram { color: #517fa4; }
.fa-spotify { color: #1ed760; }

.card-body{
  word-break: break-all;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";
import ApplyModal from "@/components/apply.vue";
import DonateModal from "@/components/donate.vue";

export default {
  components: {
    ApplyModal,
    DonateModal,
  },
  data() {
    return {
      all: [],
      allDonations: [],
      isFetching: true,
      activeTab: "volunteer",
      listViewEnabled: false,
      supporting: [],
      collaborators: [],
      applications: []
    };
  },
  computed: {
    ...mapState({
      volunteer: (state) => state.volunteers.volunteerProfile,
      role: (state) => state.auth.role,
      id: (state) => state.auth.id,
      charityProfile: (state) => state.charities.charityProfile,
      charity: (state) =>
        state.charities.charities.find((item) => {
          if (router.currentRoute.params.id == item.user._id) {
            return item;
          }
        }),
    }),
  },
  async created() {
    if (!this.charity) {
      await this["charities/getCharities"]();
    }
    this.checkRole();
    this.all = new Array(this.charity.opportunities.length).fill(false);
    this.allDonations = new Array(this.charity.campaigns.length).fill(false);
    this.isFetching = false;
  },
  methods: {
    ...mapActions(["charities/updateCharity","updateVolunteer","getVolunteerById","charities/getCharityById","charities/getCharities"]),
    async checkRole() {
      if (this.role == "user") {
        await this.getVolunteerById(this.id).then((res)=>{
          if(res.data.success){
            if(res.data.user!=null){
              this.supporting = res.data.user.charities
              this.applications = res.data.user.applications              
            }
          }
        });        
      } else 
        await this["charities/getCharityById"](this.id).then((res)=>{
          if(res.data.success){
            if(res.data.user!=null){
              this.collaborators = res.data.user.connection              
            }
          }
      })
    },
    isCollaborating(id) {
      if (this.role =='charity') {
        console.log(this.collaborators)
        if (this.collaborators.length >= 1) {
          let a = this.collaborators.map((a) => a._id);
          return a.includes(id) || id==this.charityProfile._id ? true : false;
        } else {
          return false;
        }
      } else {
        return false
      }
    },
    isSupporting(id) {
      if (this.role =='user') {
        console.log(this.supporting)
        if (this.supporting.length >= 1) {
          let a = this.supporting.map((a) => a._id);
          return a.includes(id) ? true : false;
        } else {
          return false;
        }
      } else {
        return false
      }
    },
    isApplied(id) {
      if (this.role=='user') {
        if (this.applications.length >= 1) {
          let a = this.applications.map((a) => a.event);
          return a.includes(id) ? true : false;
        } else {
          return false;
        }
      }
    },
    handler(id) {
      console.log(id);
      console.log(this.all);

      this.$set(this.all, id, false);

      console.log(id);
      console.log(this.all);
    },
    openDonateModal(id) {
      this.$set(this.allDonations, id, true);
    },
    handlerDonations(object) {
      console.log(object);
      console.log(this.all);
      this.$set(this.allDonations, object.id, false);
      console.log(object);
      console.log(this.allDonations);
    },
    openApplyModal(id) {
      this.$set(this.all, id, true);
    },
    collaborate(charity) {
      if(this.charityProfile) {
        if (this.charityProfile.user) {
          let v = this.charityProfile.connection.map(a => a._id);
          let c = charity.connection;

          console.log('clicked', charity)
          console.log('logged in', this.charityProfile)

          if (v.indexOf(charity._id) === -1)
            v.push(charity._id);
          if(c.indexOf(this.charityProfile._id)=== -1)
            c.push(this.charityProfile._id)

          let req = {
            user: { connection: v},
            id: this.id,
          };

          this["charities/updateCharity"](req).then((res) => {
            if (res.data.success) {
              console.log(req);
              let req2 = {
                user: { connection: c },
                id: charity.user._id,
              };
              console.log(req2);
              this["charities/updateCharity"](req2).then((res) => {
                if (res.data.success) {
                  this.$swal({
                    title: "Successfully Connected!",
                    icon: "success",
                  });
                  setTimeout(function(){ location.reload(); }, 3000); 
                }
              });
            }
          });
        } else {
          this.$swal({
            title: "Unauthorized to collaborate with charities!",
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
      } else {
        this.$swal({
          title: "Unauthorized to collaborate with charities!",
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
   support(charity) {
      if (this.volunteer) {
        let v = this.volunteer.charities.map(a => a._id);
        let c = charity.supporter;

        if (v.indexOf(charity._id) === -1)
          v.push(charity._id);

        if (c.indexOf(this.volunteer._id) === -1)
          c.push(this.volunteer._id);

        console.log('charity array', c)
        console.log('volunteer array', v)

        let req = {
          user: { charities: v },
          id: this.id,
        };

        this.updateVolunteer(req).then((res) => {
          if (res.data.success) {
            console.log('re1',req);
            let req2 = {
              user: { supporter: c },
              id: charity.user._id,
            };
            console.log('req2',req2);
            this["charities/updateCharity"](req2).then((res) => {
              if (res.data.success) {
                this.$swal({
                  title: "Successfully Supported!",
                  icon: "success",
                });
                setTimeout(function(){ location.reload(); }, 3000);       
              }
            });
          }
        });
      } else {
        this.$swal({
          title: "Unauthorized to support charities!",
          text: "Complete your volunteer profile first",
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
    unsupport(charity) {
      if (this.volunteer.user) {

        let v = this.volunteer.charities.map(a => a._id);
        let c = charity.supporter;

        let supporting = v.filter(
          (item) => item !== charity._id
        );
        let supporter = c.filter(
          (item) => item !== this.volunteer._id
        );

        console.log('charity array', supporter)
        console.log('volunteer array', supporting)

        let req = {
          user: { charities: supporting },
          id: this.id,
        };

        this.updateVolunteer(req).then((res) => {
          if (res.data.success) {
            console.log('req1',req);
            let req2 = {
              user: { supporter: supporter },
              id: charity.user._id,
            };
            console.log('req2',req2);
            this["charities/updateCharity"](req2).then((res) => {
              if (res.data.success) {
                charity.supporter = charity.supporter.filter(
                  (item) => item !== this.volunteer._id
                );
                this.$swal({
                  title: "Successfully unsupported!",
                  icon: "success",
                });
                setTimeout(function(){ location.reload(); }, 3000);  
              }
            });
          }
        });
      } else {
        this.$swal({
          title: "Unauthorized to support charities!",
          text: "Create your profile first",
          icon: "warning",
        });
      }
    },
    //For getting image path
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    //Add to cart
    addToCart: function (opportunity, qty) {
      opportunity.quantity = qty ? qty : 1;
      this.$store.dispatch("opportunities/addToCart", opportunity);
    },
    // Detail Tab
    tabContent(val) {
      this.activeTab = val;
    },
    type(project) {
      if (this.countDonations(project.donations) >= project.goal) {
        return "success";
      } else {
        return "primary";
      }
    },
    countDonations(donations) {
      let sum = 0;
      donations.forEach((element) => {
        sum = sum + element.amount;
      });
      return sum;
    },
  },
};
</script>
