<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid product-wrapper sidebaron">
      <div class="page-title">
        <div class="row">
          <div class="col-6 d-flex">
            <h3>Volunteering opportunities</h3>
          </div>
        </div>
      </div>
      <div class="product-grid" v-if="!isFetching">
        <div class="feature-products">
          <div class="row">
            <div class="col-md-12 create-project-btn m-b-10">
              <div class="text-right">
                <b-button v-show="role=='charity'" v-b-modal.modal-3 variant="primary"  @click="openCreateOpportunityModal()"><i data-feather="plus-square"></i>Create New Opportunity</b-button>
                <CreateOpportunity v-if="createNew" @toParent="closeModal"/>
              </div>
            </div>
            <div class="col-md-6 products-total">
              <div class="square-product-setting d-inline-block">
                <a class="icon-grid grid-layout-view" @click="gridView()">
                  <feather type="grid"></feather>
                </a>
              </div>
              <div class="square-product-setting d-inline-block">
                <a class="icon-grid m-0 list-layout-view" @click="listView()">
                  <feather type="list"></feather>
                </a>
              </div>
            </div>
            <div class="col-md-6">
              <div class="pull-right text-right">
                <span class="f-w-600 mr-2">Sort By</span>
                <div class="select2-drpdwn-product select-options d-inline-block">
                  <select class="form-control btn-square" name="select" @change="onChangeSort($event)">
                    <option>Relevance</option>
                    <option value="a-z">Alphabetically, A-Z</option>
                    <option value="z-a">Alphabetically, Z-A</option>
                    <option value="ascending">Start date, ascending</option>
                    <option value="descending">Start date, descending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3">
              <div class="product-sidebar">
                <div class="filter-section">
                  <div class="card">
                    <div class="card-header">
                      <h6 class="mb-0 f-w-600">
                        Filters
                        <span class="pull-right">
                          <i class="fa fa-chevron-down toggle-data"></i>
                        </span>
                      </h6>
                    </div>
                    <Slider @allFilters="allfilter" @priceVal="pricefilterArray" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-9 col-sm-12">
              <form>
                <div class="form-group m-0">
                  <input class="form-control" type="text" placeholder="Search.." />
                  <i class="fa fa-search"></i>
                </div>
              </form>
              <div class="col-sm-12">
                <div v-if="filterOpportunity.length == 0">
                  <div class="search-not-found text-center">
                    <p>
                      Sorry, We didn't find any results matching this search
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="product-wrapper-grid" :class="listViewEnabled ? 'list-view' : ''">
          <div class="row">
            <div :class="[listViewEnabled ? 'col-xl-12' : 'col-xl-3 col-md-6']" v-for="(opportunity, index) in filterOpportunity" :key="index">
              <div class="card">
                <div class="product-box">
                  <div class="product-img">
                    <div class="ribbon ribbon-danger" v-if="opportunity.urgent">
                      Urgent
                    </div>
                    <img class="img-fluid" :src="getImgUrl(opportunity.image)" alt />
                    <div v-if="role=='user'" class="product-hover">                      <ul>
                        <button v-if="isApplied(opportunity._id)" class="btn btn-success m-r-10 cart-btn-transform" disabled><i class="fa fa-check-circle mr-1"></i> Applied</button>
                        <button  v-else class="btn btn-success m-r-10 cart-btn-transform" @click="openApplyModal(opportunity._id)"><i class="fa fa-check-circle mr-1"></i> Apply Now</button>
                        <ApplyModal v-if="all[opportunity._id]" :opportunity="opportunity" @toParent="handler"></ApplyModal>
                      </ul>
                    </div>
                  </div>

                  <div class="product-details">
                    <router-link :to="'/opportunities/' + opportunity._id">
                      <h4>{{ opportunity.title }}</h4>
                    </router-link>

                    <router-link style="margin-bottom: 0px" :to="'/charities/' + opportunity.charity.user._id">
                      <i class="fa fa-certificate mr-2"></i>
                      {{ opportunity.charity.user.name }}
                    </router-link>
                    <p>
                      <i class="fa fa-map-marker mr-2"></i>
                      {{ opportunity.city }} , {{ opportunity.postcode}}
                    </p>
                    <p v-if="listViewEnabled">
                      {{ opportunity.shortDescription }}
                    </p>
                  </div>
                  <div v-if="listViewEnabled" class="other-details">
                    <!-- <h6 class="f-w-600">Start Date</h6>
                    <ul class="items">
                      <li class="badge badge-primary pull-right" v-text="opportunity.startDate"></li>
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.product-wrapper-grid {
  min-height: 1000px;
}

.product-wrapper-grid.list-view .product-box .product-details {
  width: 50%;
}

.product-wrapper-grid.list-view .product-box .product-img {
  width: 30%;
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
</style>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import ApplyModal from "@/components/apply.vue";
import CreateOpportunity from "@/components/new-opportunity.vue";

import Slider from "./filterbar";
export default {
  name: "Volunteer",
  components: {
    Slider,    
    ApplyModal,
    CreateOpportunity
  },
  data() {
    return {
      createNew: false,
      applications: [],

      all: [],
      isFetching: true,

      allfilters: [],
      filtered: true,
      listViewEnabled: true,

      url: false,
    };
  },
  computed: {
    ...mapGetters({
      filterOpportunity: "opportunities/filterOpportunities",
      tags: "opportunities/setTags",
    }),
    ...mapState({
      volunteer: (state) => state.volunteers.volunteerProfile,
      role: (state) => state.auth.role,
      id: (state) => state.auth.id,
      charity: (state) => state.charities.charityProfile,
    }),
  },
  mounted() {
    this.all = new Array(this.filterOpportunity.length).fill(false);
  },
  async created() {
    try {
      this["opportunities/getOpportunities"]();
      await this.checkRole();
      this.isFetching = false;
    } catch (error) {
      console.log("Unable to find opportunities: ", error);
    }
  },
  methods: {
    ...mapActions(["opportunities/getOpportunities", "getVolunteerById"]),
    checkRole() {
      if (this.role == "user") {
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
    openCreateOpportunityModal(){
      if (this.$cookie.get("charity")) {
        this.createNew = true
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
      }
    },
    closeModal(object){
      if(object=="false")
        this.createNew = false;
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

    //For getting image path
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },

    // For Order By
    onChangeSort(event) {
      this.$store.dispatch(
        "opportunities/sortOpportunities",
        event.target.value
      );
    },

    //Filter by Cause, Charity, Color
    allfilter(selectedVal) {
      this.allfilters = selectedVal;
      this.$store.dispatch("opportunities/setTags", selectedVal);
    },

    //Price Filter
    pricefilterArray(item) {
      this.$store.dispatch("opportunities/priceFilter", item);
    },

    listView() {
      this.listViewEnabled = true;
    },
    gridView() {
      this.listViewEnabled = false;
    },
  },
};
</script>
