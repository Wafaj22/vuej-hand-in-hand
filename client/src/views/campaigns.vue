<template>
  <div>
    <!-- Container-fluid starts-->
    <b-alert variant="danger" show dismissible class="alert alert-danger alert-dismissible fade show" v-if="error">
      <i class="fa fa-exclamation-triangle mr-2"></i>
      {{error}}
    </b-alert>
    <!-- <b-alert variant="success" show dismissible class="alert alert-success alert-dismissible fade show" v-if="successMessage">
      <feather type="thumbs-down"></feather>
      {{successMessage}}
    </b-alert>
    <b-alert variant="warning" show dismissible class="alert alert-warning alert-dismissible fade show" v-if="cancelMessage">
      <i class="fa fa-exclamation-triangle mr-2"></i>
      {{cancelMessage}}
    </b-alert> -->
    <div class="container-fluid">
      <div class="page-title">
        <div class="row">
          <div class="col-6 d-flex">
            <h3>Campaigns List</h3>
          </div>
        </div>
      </div>
      <div class="row" v-if="!isFetching">
        <div class="col-md-12 project-list">
          <div class="card">
            <div class="row">
              <div class="col-sm-12 p-0">
                <b-tabs content-class="mt-3">
                  <b-tab active>
                    <template v-slot:title>
                      <feather type="target"></feather> All
                    </template>
                    <b-card-text>
                      <div class="col-sm-12 p-0">
                        <div class="card">
                          <div class="card-body">
                            <div class="row">
                              <div class="col-xl-4 col-lg-6" v-for="(project, index) in allprojects" :key="index" :class="index < 3 ? 'mb-4' : ''">
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
                                      <div v-show="role!='charity'" class="product-hover">
                                        <ul>
                                          <button class="btn btn-success m-r-10 cart-btn-transform" @click="openDonateModal(project._id, 'all')">
                                            <i class="fa fa-check-circle mr-1"></i> Donate Now
                                          </button>
                                          <DonateModal v-if="all[project._id]" :campaign="project" @toParent="handler" activeTab="all"></DonateModal>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="project-box">
                                    <router-link :to="'/campaigns/' + project._id">
                                        <h5>{{ project.title }}</h5>
                                    </router-link>
                                    <div class="media">
                                      <img class="img-20 mr-1 rounded-circle" :src="getImgUrl(project.charity.image)" alt="" title="" />
                                      <router-link :to="'/charities/' + project.charity.user._id">
                                        <p>{{ project.charity.user.name }}</p>
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
                                          {{
                                            countDonations(project.donations)
                                          }}
                                          $ raised
                                        </p>
                                        <div class="media-body text-right">
                                          <span>{{ project.goal }} $</span>
                                        </div>
                                      </div>
                                      <div class="progress" style="height: 5px">
                                        <div class="progress-bar-animated progress-bar-striped" :class="'bg-' + type(project)" role="progressbar" :style="{
                                            width:
                                              (countDonations(
                                                project.donations
                                              ) /
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
                    </b-card-text>
                  </b-tab>
                  <b-tab>
                    <template v-slot:title>
                      <feather type="target"></feather> Urgent
                    </template>
                    <b-card-text>
                      <div class="col-sm-12 p-0">
                        <div class="card">
                          <div class="card-body">
                            <div class="row">
                              <div class="col-xl-4 col-lg-6" v-for="(project, index) in getUrgentCampaigns" :key="index" :class="index < 3 ? 'mb-4' : ''">
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
                                      <div v-show="role!='charity'" class="product-hover">
                                        <ul>
                                          <button class="btn btn-success m-r-10 cart-btn-transform" @click="openDonateModal(project._id, 'urgent')"><i class="fa fa-check-circle mr-1"></i> Donate Now</button>
                                          <DonateModal v-if="urgentArray[project._id]" :campaign="project" @toParent="handler" activeTab="urgent"></DonateModal>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="project-box">
                                    <router-link :to="'/campaigns/' + project._id">
                                        <h5>{{ project.title }}</h5>
                                     </router-link>
                                    <div class="media">
                                      <img class="img-20 mr-1 rounded-circle" :src="getImgUrl(project.charity.image)" alt="" title="" />
                                      <router-link :to="'/charities/' + project.charity.user._id">
                                        <p>{{ project.charity.user.name }}</p>
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
                                          {{
                                            countDonations(project.donations)
                                          }}
                                          $ raised
                                        </p>
                                        <div class="media-body text-right">
                                          <span>{{ project.goal }} $</span>
                                        </div>
                                      </div>
                                      <div class="progress" style="height: 5px">
                                        <div class="progress-bar-animated progress-bar-striped" :class="'bg-' + type(project)" role="progressbar" :style="{
                                            width:
                                              (countDonations(
                                                project.donations
                                              ) /
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
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </div>
              <div class="col-sm-6 create-project-btn">
                <div class="text-right">
                  <div class="form-group mb-0 mr-0"></div>
                  <b-button v-show="role=='charity'" v-b-modal.modal-3 variant="primary" @click="openCreateCampaignModal()"><i data-feather="plus-square"> </i>Create New
                    Campaign</b-button>
                  <CreateCampaign v-if="createNew" @toParent="closeModal"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Container-fluid Ends-->
  </div>
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

.badge-box{
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  right: 0px;
  top: 15px;
}

.badge{
  flex: 1 1 10%;
}

.campaign-image{
  height: 310px;
  width: 470px;
}
</style>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import DonateModal from "@/components/donate.vue";
import CreateCampaign from "@/components/new-campaign.vue";

export default {
  data() {
    return {
      createNew: false,
      isFetching:true,
      //successMessage: null,
      //cancelMessage: null,
        
      all: [],
      urgentArray: [],
    };
  },
  components: {
    DonateModal,
    CreateCampaign
  },
  computed: {
    ...mapGetters({
      getUrgentCampaigns: "campaigns/getUrgentCampaigns",      
    }),
    ...mapGetters(["error"]),
    ...mapState({
      role: (state) => state.auth.role,
      id: (state) => state.auth.id,
      allprojects: (state) => state.campaigns.campaigns,
    }), 
  },
  mounted() {
    this.all = new Array(this.allprojects.length).fill(false);
    this.urgentArray = new Array(this.allprojects.length).fill(false);
  },
  async created() {    
    try {
      await this["campaigns/getCampaigns"]();
      this.isFetching = false
    } catch (error) {
      console.log('Error',error);
    }
    if(this.$route.query.success){
      //this.successMessage = "Thank you for your generosity !"
      this.$toasted.show(" Thank you for your generosity !", {theme: 'outline',position: "top-right", type: 'success', icon : 'check', duration: 2000});
    } else if(this.$route.query.cancel){
      //this.cancelMessage = "Donation cancelled "
      this.$toasted.show(" Unsuccessful donation payment !", {theme: 'outline',position: "top-right", icon : 'times', type: 'error', duration: 2000});

    }   
  },
  methods: {
    ...mapActions(["campaigns/getCampaigns"]),    
    getBgColor(progress) {
      if (progress == 1) return "bg-success";
      else return "bg-primary";
    },
    type(project){
      if(this.countDonations(project.donations) >= project.goal){
        return "success"
      }
      else {
        return "primary"
      }
    },
    countDonations(donations) {
      return donations.reduce((total, obj) => obj.amount + total, 0);
    },
    openDonateModal(id,s) {
      if(s == "all"){
        this.$set(this.all, id, true)
      } else if (s == "urgent"){
        this.$set(this.urgentArray, id, true)
      }
    },
    openCreateCampaignModal(){      
      if (this.$cookie.get("charity")) {
        this.createNew = true
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
    closeModal(object){
      if(object =="false"){
        this.createNew = false
      }
    },
    handler(object){
      console.log(object)
      console.log(this.urgentArray)
      console.log(this.all)
      if (object.urgent){
        this.$set(this.urgentArray, object.id, false)
      } else {
        this.$set(this.all, object.id, false)
      }
      console.log(object)
      console.log(this.urgentArray)
      console.log(this.all)
    },
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
  },
};
</script>