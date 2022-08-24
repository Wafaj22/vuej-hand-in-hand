<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="page-title">
        <!-- <div class="row">
             <div class="col-6 d-flex">
              <h3>Dashboard</h3>
            </div> 
          </div> -->
      </div>
      <div class="row" v-if="!isFetching">
        <div class="col-sm-6 col-xl-3 col-lg-6">
          <px-card class="bg-blue static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="align-self-center text-center">
                  <feather type="dollar-sign" class="middle"></feather>
                </div>
                <div class="media-body">
                  <span class="m-0">Total donated</span>
                  <h4 class="mb-0 counter">{{totalRaised}} $</h4>
                  <feather type="dollar-sign" class="icon-bg"></feather>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-sm-6 col-xl-3 col-lg-6">
          <px-card class="bg-orange static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="align-self-center text-center">
                  <feather type="heart" class="middle"></feather>
                </div>
                <div class="media-body">
                  <span class="m-0">Applications</span>
                  <h4 class="mb-0 counter">{{nbApplications}}</h4>
                  <feather type="heart" class="icon-bg"></feather>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-sm-6 col-xl-3 col-lg-6">
          <px-card class="bg-pink static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="align-self-center text-center">
                  <feather type="file-text" class="middle"></feather>
                </div>
                <div class="media-body">
                  <span class="m-0">Opportunities</span>
                  <h4 class="mb-0 counter">{{nbOpportunities}}</h4>
                  <feather type="file-text" class="icon-bg"></feather>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-sm-6 col-xl-3 col-lg-6">
          <px-card class="bg-purple static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="align-self-center text-center">
                  <feather type="users" class="middle"></feather>
                </div>
                <div class="media-body">
                  <span class="m-0">Charities</span>
                  <h4 class="mb-0 counter">{{nbCharities}}</h4>
                  <feather type="users" class="icon-bg"></feather>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-xl-12">
          <h4 class="card-title mb-0"><i class="fa fa-file mr-2"></i>Recommended Opportunities</h4>
          <div class="card-options"><a class="card-options-collapse" href="#" data-toggle="card-collapse"><i class="fe fe-chevron-up"></i></a><a class="card-options-remove" href="#" data-toggle="card-remove"><i class="fe fe-x"></i></a></div>
          <div class="card-body">
            <div>
              <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide class="col-xl-3 col-md-6" v-for="(opportunity, index) in opportunities" :key="index">
                  <div class="card">
                    <div class="product-box">
                      <div class="product-img">
                        <div class="ribbon ribbon-danger" v-if="opportunity[0].urgent">
                          Urgent
                        </div>
                        <img class="img-fluid" :src="getImgUrl(opportunity[0].image)" alt />
                        <div v-if="role=='user'" class="product-hover">
                          <ul>
                            <button v-if="isApplied(opportunity[0]._id)" class="btn btn-success m-r-10 cart-btn-transform" disabled><i class="fa fa-check-circle mr-1"></i> Applied</button>
                            <button v-else class="btn btn-success m-r-10 cart-btn-transform" @click="openApplyModal(opportunity[0]._id)"><i class="fa fa-check-circle mr-1"></i> Apply Now</button>
                            <ApplyModal v-if="all[opportunity[0]._id]" :opportunity="opportunity[0]" @toParent="handler"></ApplyModal>
                          </ul>
                        </div>
                      </div>

                      <div class="product-details">
                        <router-link :to="'/opportunities/' + opportunity[0]._id">
                          <h4>{{ opportunity[0].title }}</h4>
                        </router-link>

                        <router-link style="margin-bottom: 0px" :to="'/charities/' + opportunity[0].charity.user._id">
                          <i class="fa fa-certificate mr-2"></i>
                          {{ opportunity[0].charity.user.name }}
                        </router-link>
                        <p>
                          <i class="fa fa-map-marker mr-2"></i>
                          {{ opportunity[0].city }} , {{ opportunity[0].postcode}}
                        </p>
                        <p>
                          {{ opportunity[0].shortDescription }}
                        </p>
                      </div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
        <div class="col-xl-12">
          <h4 class="card-title mb-0"><i class="fa fa-file mr-2"></i>Recommended Charities</h4>
          <div class="card-options"><a class="card-options-collapse" href="#" data-toggle="card-collapse"><i class="fe fe-chevron-up"></i></a><a class="card-options-remove" href="#" data-toggle="card-remove"><i class="fe fe-x"></i></a></div>
          <div class="card-body">
            <div>
              <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide class="col-xl-3 col-md-6" v-for="(charity, index) in charities" :key="index">
                  <div class="card">
                      <div class="product-box">
                        <div class="product-img">
                          <img class="img-fluid" :src="getImgUrl(charity[0].image)" alt />
                          <div class="product-hover">
                            <!-- <ul>
                            <router-link :to="''">
                              <li v-if="role=='user'">
                                <button v-if="!isSupporting(charity._id)" v-show="!clicked" class="btn" type="button" @click="support(charity)">
                                  <i class="fa fa-heart mr-2"></i>
                                  <span>Support</span>
                                </button>
                                <button v-show="clicked || isSupporting(charity._id)" class="btn" type="button" @click="unsupport(charity)">
                                  <i class="fa fa-times mr-2"></i>
                                  <span>Unsupport</span>
                                </button>
                              </li>
                            </router-link>
                          </ul> -->
                          </div>
                        </div>

                        <div class="product-details">
                          <router-link :to="'/charities/' + charity[0].user._id">
                            <h4>{{ charity[0].user.name }}</h4>
                          </router-link>
                          <p>
                            <i class="fa fa-map-marker mr-2"></i>
                            {{ charity[0].city }} , {{ charity[0].postcode}}
                          </p>
                          <p>{{ charity[0].mission }}</p>
                        </div>
                      </div>
                    </div>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Container-fluid Ends-->
  </div>
</template>

<style lang="scss" scoped>
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
  flex: 0 0 30%;
  margin: 5px;
  font-size: 90%;
  cursor: pointer;
}
.product-box .product-img .product-hover ul li {
  width: max-content;
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
.static-top-widget-card {
  border-radius: 15px;
  .card {
    background: transparent;
  }
}
.bg-blue {
  background-color: #69c7ff;
  color: white;
}
.bg-orange {
  background-color: #f78931;
  color: white;
}
.bg-purple {
  background-color: #7366ff;
  color: white;
}
.bg-pink {
  background-color: #f73164;
  color: white;
}

.chart_data_left {
  .card-body {
    .chart-main {
      .media {
        padding: 45px 40px;
        border-right: 1px solid #ecf3fa;

        .hospital-small-chart {
          align-items: center;
          margin-bottom: -25px;

          .small-bar {
            position: relative;
            margin-top: -50px;

            .flot-chart-container {
              height: 74px;
              width: 75px;

              .feather {
                position: absolute;
                width: 100%;
                height: 95%;
              }
            }
          }
        }

        .media-body {
          .right-chart-content {
            margin-left: 30px;

            h4 {
              line-height: 1;
              font-weight: 500;
            }

            span {
              color: rgba(#2b2b2b, 0.7);
            }
          }
        }

        &.border-none {
          border-right: none;
        }
      }
    }
  }
}
</style>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import ApplyModal from "@/components/apply.vue";

export default {
  data() {
    return {
      isFetching: true,
      highest: 0,
      average: 0,
      lowest: 0,
      nbApplications: 0,
      nbOpportunities: 0,
      totalRaised: 0,
      nbCharities: 0,

      opportunities: [],
      charities: [],
      applications: [],
      all: [],

      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        initialSlide: 0,
        autoplay: {
          delay: 1500,
          disableOnInteraction: true,
        },
        speed: 1000,
      },
    };
  },
  components: {
    swiper,
    swiperSlide,
    ApplyModal,
  },

  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState({
      volunteer: (state) => state.volunteers.volunteerProfile,
      role: (state) => state.auth.role,
      id: (state) => state.auth.id,
      charity: (state) => state.charities.charityProfile,
    }),
  },
  async created() {
      try {
        await this.getVolunteerById(this.id);
        if (this.volunteer) {
          this.getOpportunitiesSimilarity();
          this.getCharitiesSimilarity();
          this.all = new Array(this.opportunities.length).fill(false);
          this.applications = this.volunteer.applications;
          this.count();
          this.isFetching = false;
        } else {
          this.$swal({
            title: "Unauthorized to view home",
            text: "Complete your profile first",
            confirmButtonText: "Redirect to profile",
            confirmButtonColor: "#4466f2",
            icon: "warning",
          }).then((result) => {
            if (result.value) {
              this.$router.push("/profile");
            }
          });
        }
      } catch {
        this.$swal({
          title: "Unauthorized to view home",
          text: "Complete your profile first",
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
    ...mapActions([
      "getVolunteerById",
      "opportunities/getOpportunities",
      "charities/getCharities",
    ]),
    count() {
      if (this.volunteer) {
        this.nbApplications = this.volunteer.applications.length
        this.nbOpportunities = this.volunteer.opportunities.length>= 1 ? this.volunteer.opportunities.length : 0;
        this.totalRaised = this.volunteer.donations.length>= 1 ? this.volunteer.donations.reduce((total, obj) => obj.amount + total, 0): 0;
        this.nbCharities = this.volunteer.charities.length>= 1 ? this.volunteer.charities.length : 0;
      } 
    },
    isApplied(id) {
      if (this.role == "user") {
        if (this.applications.length >= 1) {
          let a = this.applications.map((a) => a.event);
          return a.includes(id) ? true : false;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    handler(id) {
      console.log(id);
      console.log(this.all);

      this.$set(this.all, id, false);

      console.log(id);
      console.log(this.all);
    },
    openApplyModal(id) {
      this.$set(this.all, id, true);
    },
    wordCountMap(str) {
      let words = str.split(" ");
      let wordCount = {};
      words.forEach((w) => {
        wordCount[w] = (wordCount[w] || 0) + 1;
      });
      return wordCount;
    },
    addWordsToDictionary(wordCountmap, dict) {
      for (let key in wordCountmap) {
        dict[key] = true;
      }
    },
    wordMapToVector(map, dict) {
      let wordCountVector = [];
      for (let term in dict) {
        wordCountVector.push(map[term] || 0);
      }
      return wordCountVector;
    },
    dotProduct(vecA, vecB) {
      let product = 0;
      for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
      }
      return product;
    },
    magnitude(vec) {
      let sum = 0;
      for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
      }
      return Math.sqrt(sum);
    },
    cosineSimilarity(vecA, vecB) {
      return (
        this.dotProduct(vecA, vecB) /
        (this.magnitude(vecA) * this.magnitude(vecB))
      );
    },
    textCosineSimilarity(txtA, txtB) {
      const wordCountA = this.wordCountMap(txtA);
      const wordCountB = this.wordCountMap(txtB);
      let dict = {};
      this.addWordsToDictionary(wordCountA, dict);
      this.addWordsToDictionary(wordCountB, dict);
      const vectorA = this.wordMapToVector(wordCountA, dict);
      const vectorB = this.wordMapToVector(wordCountB, dict);
      return this.cosineSimilarity(vectorA, vectorB);
    },
    getSimilarityScore(val) {
      return Math.round(val * 100);
    },
    checkSimilarity(text1, text2) {
      const similarity = this.getSimilarityScore(
        this.textCosineSimilarity(text1, text2)
      );
      return similarity;
    },
    ...mapGetters({
      filterCharity: "charities/filterCharities",
    }),
    getVolunteerText() {
      return (
        this.volunteer.about +
        " " +
        this.volunteer.description +
        " " +
        this.volunteer.city +
        " " +
        this.volunteer.causes.toString().replaceAll(",", " ") +
        " " +
        this.volunteer.skills.toString().replaceAll(",", " ")
      );
    },
    getCharityText(charity) {
      return (
        charity.mission +
        " " +
        charity.description +
        " " +
        charity.city +
        " " +
        charity.cause.toString().replaceAll(",", " ")
      );
    },
    getOpportunityText(opportunity) {
      return (
        opportunity.shortDescription +
        " " +
        opportunity.description +
        " " +
        opportunity.city +
        " " +
        opportunity.cause.toString().replaceAll(",", " ") +
        " " +
        opportunity.skills.toString().replaceAll(",", " ") +
        " " +
        opportunity.resp.toString().replaceAll(",", " ") +
        " " +
        opportunity.reqs.toString().replaceAll(",", " ")
      );
    },
    async getCharitiesSimilarity() {
      let similarity = [];
      let score = 0;
      await this["charities/getCharities"]().then((res) => {
        if (res.data.success) {
          res.data.user.forEach((charity) => {
            score = this.checkSimilarity(
              this.getVolunteerText(),
              this.getCharityText(charity)
            );
            similarity.push([charity, score]);
          });
        }
      });
      similarity.sort(function (a, b) {
        return b[1] - a[1];
      });
      this.charities = similarity;
      return similarity;
    },
    async getOpportunitiesSimilarity() {
      let similarity = [];
      let score = 0;
      await this["opportunities/getOpportunities"]().then((res) => {
        if (res.data.success) {
          console.log("got all", res.data.user.length);
          res.data.user.forEach((opportunity) => {
            console.log("opportunity", opportunity);
            score = this.checkSimilarity(
              this.getVolunteerText(),
              this.getOpportunityText(opportunity)
            );
            console.log("score", score);
            similarity.push([opportunity, score]);
            console.log("similiary", similarity);
          });
        }
      });
      similarity.sort(function (a, b) {
        return b[1] - a[1];
      });
      console.log("opportunities", similarity);
      this.opportunities = similarity;
      return similarity;
    },
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
  },
};
</script>
