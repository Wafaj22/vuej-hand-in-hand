<template>
  <div class="container-fluid product-wrapper sidebaron">
    <div class="page-title"></div>

    <div class="row">
      <div class="col-md-12" v-if="volunteer">
        <div class="card custom-card">
          <div class="row mb-2">
            <div class="col-auto">
              <img class="img-120 rounded-circle" alt="" :src="getImgUrl(volunteer.image)" />
            </div>
            <div class="col-6">
              <h3 class="mb-1">{{ volunteer.user.name }}</h3>
              <h6 class="mb-2">{{ volunteer.about }}</h6>
              <ul class="card-social">
                <li>
                  <span class="mr-1" v-if="volunteer.charities">{{ volunteer.charities.length }}</span>
                  <span class="mr-1" v-else>0</span>
                  <i>Supporting</i>
                </li>
                <li>
                  <span class="mr-1 ml-4">{{ volunteer.opportunities.length}}</span>
                  <i>Projects</i>
                </li>
              </ul>
              <p>{{ volunteer.description }}</p>
              <ul class="card-social">
                <li>
                  <router-link :to="'/chat/' + volunteer.user._id" class="btn-outline-secondary"><i class="fa fa-comments mr-2"></i>Contact</router-link>
                </li>
              </ul>
            </div>
            <div class="col">
              <h6 class="f-w-600">Causes</h6>
              <ul class="items">
                <li class="badge badge-secondary pull-right" v-for="(c, i) in volunteer.causes" :key="i" v-text="c"></li>
              </ul>
              <h6 class="f-w-600">Skills</h6>
              <ul class="items">
                <li class="badge badge-success pull-right" v-if="volunteer.skills.length == 0">
                  None
                </li>
                <li v-else class="badge badge-success pull-right" v-for="(c, i) in volunteer.skills" :key="i" v-text="c"></li>
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
              <a class="nav-link" data-toggle="tab" role="tab" :class="[{ active: activeTab == 'volunteer' }]">Volunteering Experience</a>
              <div class="material-border"></div>
            </li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade" :class="{ 'show active': activeTab == 'volunteer' }" role="tabpanel">
              <!-- :class="listViewEnabled?'list-view':''"
              :class="[listViewEnabled ? 'col-md-10' : 'col-xl-3 col-md-6']" -->
              <div class="product-wrapper-grid">
                <div class="row">
                  <div class="mb-0 m-t-20 ml-10 col-md-3" v-for="(opportunity, index) in volunteer.opportunities" :key="index">
                    <div class="card">
                      <div class="product-box">
                        <div class="product-img">
                          <div class="ribbon ribbon-danger" v-if="opportunity.urgent">
                            Important
                          </div>

                          <img class="img-fluid" :src="getImgUrl(opportunity.image)" alt />

                          <div class="product-hover">
                            <ul>
                              <router-link :to="'/opportunities/apply/' + opportunity.id">
                                <li>
                                  <button class="btn" type="button">
                                    <i class="fa fa-check-circle"></i>
                                    Apply
                                  </button>
                                </li>
                              </router-link>
                            </ul>
                          </div>
                        </div>

                        <div class="product-details">
                          <router-link :to="'/opportunities/' + opportunity.id">
                            <h4>{{ opportunity.title }}</h4>
                          </router-link>

                          <p style="margin-bottom: 0px">
                            <i class="fa fa-certificate mr-2"></i>
                            {{ opportunity.charity.name }}
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
                          <h6 class="f-w-600">Start Date</h6>
                          <ul class="items">
                            <li class="badge badge-primary pull-right" v-text="opportunity.startDate"></li>
                          </ul>
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
</style>

<script>
import { mapState } from "vuex";
import router from "@/router";
export default {
  props: ["id"],
  data() {
    return {
      activeTab: "volunteer",
      listViewEnabled: false,
    };
  },
  computed: {
    ...mapState({
      volunteer: (state) =>
        state.volunteers.volunteers.find((item) => {
          if (router.currentRoute.params.id == item.user._id) {
            return item;
          }
        }),
    }),
  },
  created() {
    if (!this.volunteer) {
      this.$store.dispatch("getVolunteers");
    }
  },
  methods: {
    //For getting image path
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    // Detail Tab
    tabContent(val) {
      this.activeTab = val;
    },
    countDonations(donations) {
      return donations.reduce((total, obj) => obj.donation + total, 0);
    },
  },
};
</script>
