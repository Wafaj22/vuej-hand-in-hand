<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="page-title">
      </div>
      <div>
        <div class="row product-page-main" v-if="!isFetching">
          <div class="col-xl-4 xl-cs-65">
            <div class="card">
              <div class="card-body">
                <div class="ribbon ribbon-danger" v-if="campaigns.urgent">
                  Urgent
                </div>
                <div class="product-slider">
                  <img :src="getImgUrl(campaigns.image)" class="img-fluid bg-img" alt="index" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-5 xl-100">
            <div class="card">
              <div class="card-body details">
                <div class="product-page-details">
                  <router-link style="margin-bottom: 0px" :to="'/campaigns/' + campaigns._id">
                    <h3>{{ campaigns.title }}</h3>
                  </router-link>
                </div>
                <div class="product-price f-28">
                  <router-link style="margin-bottom: 0px" :to="'/charities/' + campaigns.charity.user._id">
                    <i class="fa fa-certificate mr-2"></i>
                    {{ campaigns.charity.user.name }}
                  </router-link>
                  <p>
                    <i class="fa fa-map-marker mr-2"></i>
                    {{ campaigns.city }}, {{ campaigns.postcode }}
                  </p>
                </div>
                <hr />
                <h6>Description</h6>
                <p>{{ campaigns.description }}</p>
                <hr />
                <div class="row">
                  <div class="col-md-4">
                    <h6 class="product-title" style="font-size: 1.25rem;">Share it</h6>
                  </div>
                  <div class="col-md-8">
                    <div class="product-icon">
                        <share-it :shareConfig="iconConfig" :text="campaigns.title" 
                        :url="`http://localhost:8080/campaigns/${campaigns._id}`" :height="600" :width="600"/>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="m-t-15">
                  <button v-show="role!='charity'" class="btn btn-success m-r-10 cart-btn-transform" @click="openDonateModal()"><i class="fa fa-check-circle mr-1"></i> Donate Now</button>
                  <DonateModal v-if="isModalVisible" :campaign="campaigns" @toParent="handler" activeTab=""></DonateModal>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 xl-cs-35">
            <div class="card">
              <div class="card-body">
                <div>
                  <h5>Cause</h5>
                  <ul  v-for="(cause, index) in campaigns.cause" :key="index" class="items">
                    <li class="badge badge-secondary pull-right" v-text="cause"></li>
                  </ul>
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

<style lang="scss">
.items {
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
}

.badge {
  flex: 0 0 30%;
  margin: 5px;
  font-size: 90%;
  cursor: pointer;
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
.vue-share-it-wrapper {
  .share-icon{
  width: 3em;
  height: 3em;
}
}

.details {
  line-height: 2;
  ul {
    list-style-type: disc;
    list-style-position: inside;
    margin-bottom: 1rem;
  }
  li {
    font-size: 15px;
  }
  a {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
    line-height: 1.2;
  }
}
</style>
<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";
import DonateModal from "@/components/donate.vue";

export default {
  components: {
    DonateModal,
  },
  data() {
    return {
      isFetching: true,
      isModalVisible: false,
      iconConfig: {
        twitter: {
          icon: true,
          size: "2x",
          outline: true,
          round: true
        },
        linkedin: {
          icon: true,
          size: "2x",
          outline: true,
          round: true
        },
        facebook: {
          icon: true,
          size: "2x",
          outline: true,
          round: true
        },
        whatsapp: {
          icon: true,
          size: "2x",
          outline: true,
          round: true
        },
        reddit: {
          icon: true,
          size: "2x",
          outline: true,
          round: true
        }
      }
    };
  },
  computed: {
    ...mapState({
      campaigns: (state) =>
        state.campaigns.campaigns.find((item) => {
          if (router.currentRoute.params.id == item._id) {
            return item;
          }
        }),
      volunteer: (state) => state.volunteers.volunteerProfile,
      //campaignProfile: (state)=> state.campaigns.campaignProfile,
      role: (state) => state.auth.role,
      id: (state) => state.auth.id,
      charity: (state) => state.charities.charityProfile
    }),
  },
  async created() { 
    if(!this.campaigns){
      try {
        await this["campaigns/getCampaigns"]();
        this.isFetching = false;
        this.campaigns = this.campaignProfile
      } catch (error) {
        console.log(error)
        console.log("unable to retrieve campaign");
      }
    }   
    else {
      this.isFetching = false;
    }
  },
  methods: {
  ...mapActions(["campaigns/getCampaigns"]),
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    openDonateModal() {
      this.isModalVisible = true;
    },
    handler(object) {
      console.log(object)
      this.isModalVisible = false;
    },
  },
};
</script>