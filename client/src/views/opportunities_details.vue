<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="page-title">
      </div>
      <div>
        <div class="row product-page-main" v-if="!isFetching">
          <div class="col-md-4 md-cs-65">
            <div class="card">
              <div class="card-body">
                <div class="ribbon ribbon-danger" v-if="opportunities.urgent">
                  Important
                </div>
                <div class="product-slider" id="sync1">
                  <swiper :options="swiperOption" ref="mySwiper">
                    <swiper-slide v-for="(product, index) in opportunities.image" :key="index">
                      <img :src="getImgUrl(opportunities.image)" :id="index" class="img-fluid bg-img" alt="index" />
                    </swiper-slide>
                  </swiper>
                </div>
                <!-- <div class="slider-nav-images mt-2" id="sync2">
                  <swiper :options="swiperOption1">
                    <swiper-slide v-for="(product, index) in opportunities.image" :key="index">
                      <img :src="getImgUrl(opportunities.image)" :id="index" class="img-fluid bg-img" alt="index" v-on:click="slideTo(index)" />
                    </swiper-slide>
                  </swiper>
                </div> -->
              </div>
            </div>
          </div>
          <div class="col-md-5 md-100">
            <div class="card">
              <div class="card-body details">
                <div class="product-page-details">
                  <h3>{{ opportunities.title }}</h3>
                </div>
                <div class="product-price f-28">
                  <router-link style="margin-bottom: 0px" :to="'/charities/' + opportunities.charity.user._id">
                    <i class="fa fa-certificate mr-2"></i>
                    {{ opportunities.charity.user.name }}
                  </router-link>

                  <router-link v-if="opportunities.collaborating.length>0" style="margin-bottom: 0px" :to="'/charities/' + opportunities.charity.user._id">
                    in collaboration with {{ opportunities.collaborating.user.name }}
                  </router-link>
                  <p>
                    <i class="fa fa-map-marker mr-2"></i>
                    {{ opportunities.city }}, {{ opportunities.postcode }}
                  </p>
                </div>
                <hr />
                <h6>Description</h6>
                <p>{{ opportunities.description }}</p>
                <h6>Responsibilities</h6>
                <ul>
                  <li v-for="(r, index) in opportunities.resp" :key="index" v-text="r"></li>
                </ul>
                <h6>Requirements</h6>
                <ul>
                  <li v-for="(rq, index) in opportunities.reqs" :key="index" v-text="rq"></li>
                </ul>
                <hr />
                <div class="row">
                  <div class="col-md-4">
                    <h6 class="product-title" style="font-size: 1.25rem;">Share it</h6>
                  </div>
                  <div class="col-md-8">
                    <div class="product-icon">
                        <share-it :shareConfig="iconConfig" :text="opportunities.title" 
                        :url="`http://localhost:8080/opportunities/${opportunities._id}`" :height="600" :width="600"/>
                    </div>
                  </div>
                </div>
                <hr />
                <!-- <router-link :to="'/opportunities/apply/' + opportunities.id" class="btn btn-success m-r-10 cart-btn-transform"><i class="fa fa-check-circle mr-1"></i> Apply Now</router-link> -->
                <div v-if="role=='user'" class="m-t-15">
                  <button v-if="isApplied(opportunities._id)" class="btn btn-success m-r-10 cart-btn-transform" disabled><i class="fa fa-check-circle mr-1"></i> Applied</button>
                  <button v-else v-show="role=='user'" class="btn btn-success m-r-10 cart-btn-transform" @click="openApplyModal"><i class="fa fa-check-circle mr-1"></i> Apply Now</button>
                </div>
                <ApplyModal v-if="isModalVisible" :opportunity="opportunities"></ApplyModal>
              </div>
            </div>
          </div>
          <div class="col-md-3 md-cs-35">
            <div class="card">
              <div class="card-body">
                <div>
                  <h5>Cause</h5>
                  <ul class="items">
                    <li class="badge badge-secondary pull-right" v-for="(c, i) in opportunities.cause" :key="i" v-text="c"></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <div>
                  <h5>Skills</h5>
                  <ul class="items">
                    <li class="badge badge-success pull-right" v-if="opportunities.skills.length == 0">
                      None
                    </li>
                    <li v-else class="badge badge-success pull-right" v-for="(c, i) in opportunities.skills" :key="i" v-text="c"></li>
                  </ul>
                </div>
              </div>
              <!-- silde-bar colleps block end here-->
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
import ApplyModal from "@/components/apply.vue";

import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
export default {
  components: {
    swiper,
    swiperSlide,
    ApplyModal,
  },
  data() {
    return {
      applications: [],
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
      },

      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 1,
        freeMode: true,
        loop: true,
        initialSlide: 0,
        autoplay: {
          delay: 1500,
          disableOnInteraction: true,
        },
        speed: 1000,
      },
      swiperOption1: {
        slidesPerView: 2,
        spaceBetween: 30,
        freeMode: true,
        centeredSlides: false,
      },
    };
  },
  computed: {
    ...mapState({
      opportunities: (state) =>
        state.opportunities.opportunities.find((item) => {
          if (router.currentRoute.params.id == item._id) {
            return item;
          }
        }),
      volunteer: (state) => state.volunteers.volunteerProfile,
      //opportunityProfile: (state)=> state.opportunities.opportunityProfile,
      role: (state) => state.auth.role,
      id: (state) => state.auth.id,
      charity: (state) => state.charities.charityProfile,
    }),
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
  },
  async created() {
    if (!this.opportunities) {
      try {
        this["opportunities/getOpportunities"]();
        await this.checkRole();
        this.isFetching= false;
      } catch (error) {
        console.log("unable to retrieve opportunity ", error);
      }
    } else {
      await this.checkRole();
      this.isFetching = false;
      console.log(this.opportunities);
    }
  },
  methods: {
    ...mapActions(["opportunities/getOpportunities", "getVolunteerById"]),
    checkRole() {
      if (this.role == "user") {
        console.log('id',this.id)
        this.getVolunteerById(this.id).then((res)=>{
          if(res.data.success){
            if(res.data.user!=null){
              this.applications = res.data.user.applications              
            }
          }
        });        
      }
    },
    isApplied(id) {
      if (this.role =='user') {
        if (this.applications.length >= 1) {
          let a = this.applications.map((a) => a.event);
          return a.includes(id) ? true : false;
        } else {
          return false;
        }
      } else {
        return false
      }
    },
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    slideTo(id) {
      this.swiper.slideTo(id, 1000, false);
    },
    openApplyModal() {
      this.isModalVisible = true;
    },
  },
};
</script>